import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { Description } from "@radix-ui/react-dialog";

import saveQuizz from "./saveToDb";

export async function POST(req: NextRequest) {
    const body = await req.formData();
    const document = body.get("pdf");

    try{
        const pdfLoader = new PDFLoader(document as Blob, {
            parsedItemSeparator: ""
        });
        const docs = await pdfLoader.load();

        const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
        const texts = selectedDocuments.map((doc) => doc.pageContent);

        const prompt = `Você é um gerador de quizzes profissional.

Seu objetivo é gerar quizzes de alta qualidade com base no texto fornecido, que resume um documento. O quiz deve ser totalmente coerente com o conteúdo, sem erros, pegadinhas ou perguntas vagas.

Regras obrigatórias:

Leia o conteúdo atentamente e só gere perguntas cuja resposta esteja clara no texto.

As perguntas devem ter enunciados completos e objetivos.

As alternativas devem ser plausíveis para estimular o raciocínio.

Indique claramente qual é a resposta correta (isCorrect: true) para cada pergunta.

O nível de dificuldade deve ser coerente com o nível solicitado (Fácil, Médio ou Avançado).

Não invente informações que não estejam no texto.

Evite perguntas que dependam de interpretação subjetiva.

Retorne somente um objeto JSON com a estrutura:
{
  "quizz": {
    "name": "Título do quiz(curto e relevante ao conteúdo)",
    "description": "Descrição breve do conteúdo avaliado no quiz",
    "questions": [
      {
        "questionText": "Texto da pergunta",
        "answers": [
          { "answerText": "Alternativa A", "isCorrect": false },
          { "answerText": "Alternativa B", "isCorrect": true },
          { "answerText": "Alternativa C", "isCorrect": false },
          { "answerText": "Alternativa D", "isCorrect": false }
        ]
      }
    ]
  }
}
  Instruções finais:

Gere pelo menos 3 perguntas, cada uma com 4 alternativas, com apenas uma correta.

Retorne apenas o JSON, sem comentários, explicações ou formatações extras.

Siga as regras acima com precisão.
`

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            { error: "OpenAI API key not provided" }, 
            { status: 500}
        );
    }

    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-4-1106-preview"
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
        name: "extractor",
        description: "Extracts fields from the output",
        parameters: {
            type: "object",
            properties: {
                quizz: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    questionText: { type: "string" },
                                    answers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                answerText: { type: "string" },
                                                isCorrect: { type: "boolean" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    const runnable = model
    .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
    })
    .pipe(parser);

        const message = new HumanMessage({
            content: [
                {
                    type: "text",
                    text: prompt + "\n" + texts.join("\n")
                }
            ]
        })

        const result = await runnable.invoke([message]);
        console.log(result);

        const { quizzId } = await saveQuizz(result.quizz);

        return NextResponse.json(
            { quizzId }, 
            { status: 200}
        );
    }   catch(e:any) {
        return NextResponse.json({ error: e.message }, { status: 500});
    }
}