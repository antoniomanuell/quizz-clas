"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, ChevronsLeft, X } from "lucide-react";

const questions = [
    {
        questionText: "1 What is React?",
        answers: [
            { answerText: "4A library for building user interfaces", isCorrect: true, id: 1 },
            { answerText: "5A fron-end framework", isCorrect: false, id: 2 },
            { answerText: "6A back-end framework", isCorrect: false, id: 3 },
            { answerText: "7A database", isCorrect: false, id: 4 }
        ]
    },

    {
        questionText: "2 What is React?",
        answers: [
            { answerText: "8A library for building user interfaces", isCorrect: true, id: 1 },
            { answerText: "9A fron-end framework", isCorrect: false, id: 2 },
            { answerText: "10A back-end framework", isCorrect: false, id: 3 },
            { answerText: "11A database", isCorrect: false, id: 4 }
        ]
    },

    {
        questionText: "3 What is React?",
        answers: [
            { answerText: "12A library for building user interfaces", isCorrect: true, id: 1 },
            { answerText: "13A fron-end framework", isCorrect: false, id: 2 },
            { answerText: "14A back-end framework", isCorrect: false, id: 3 },
            { answerText: "15A database", isCorrect: false, id: 4 }
        ]
    }
]

export default function Home() {
    const [started, setStarted] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleNext = () => {
        if (!started) {
            setStarted(true);
            return;
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }

        setSelectedAnswer(null);
        setIsCorrect(null);
    }

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer.id);
        const isCurrentCorrect = answer.isCorrect;
        if (isCurrentCorrect) {
            setScore(score + 1);
        }
        setIsCorrect(isCurrentCorrect);
    }

  return (
    <div className="flex flex-col flex-1">
       <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
            <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
                <Button size="icon" variant="outline"><ChevronLeft /></Button>
                <ProgressBar value={(currentQuestion/ questions.length) * 100} />
                <Button size="icon" variant="outline">
                    <X />
                </Button>
            </header>
       </div> 
    <main className="flex justify-center flex-1">
      {!started ? <h1 className="text-3xl font-bold">CLAS QUIZ APP</h1> : (
        <div>
            <h2 className="text-3xl font-bold">{questions[currentQuestion].questionText}</h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
                {
                    questions[currentQuestion].answers.map (answer => {
                        return (
                            <Button key={answer.id} variant={"secondary"} onClick={() => handleAnswer(answer)} >{answer.answerText}</Button>
                        )
                    })
                }
            </div>
        </div>
      )}
    </main>
    <footer className="footer pb-9 px-6 relative mb-0">
        <p>{isCorrect ? 'correct' : 'icorrect'}</p>
      <Button onClick={handleNext}>{!started ? 'Iniciar' : 'Próximo'}</Button>
    </footer>
    </div>
  )
}
