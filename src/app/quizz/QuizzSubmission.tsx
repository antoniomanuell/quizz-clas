import { useEffect } from "react";
import Bar from "@/components/Bar";
import Image from "next/image";
import { useReward } from "react-rewards";

type Props = {
    scorePercentage: number,
    score: number,
    totalQuestions: number
}

const QuizzSubmission = (props: Props) => {
    const { scorePercentage, score, totalQuestions } = props;
    const { reward } = useReward('rewardId', 'confetti');

    useEffect(() => {
        if(scorePercentage === 100) {
            reward();
        }
    }, [scorePercentage, reward])
    return (
        <div className="flex flex-col flex-1">
            <main className="py-11 flex flex-col gap-4 items-center flex-1 mt-24">
                <h2 className="text-3xl font-bold">Quiz Completado</h2>
                <p>Sua Pontuação: {scorePercentage}%</p>
                {scorePercentage === 100 ? 
                <div className="flex flex-col items-center">
                    <p>Parabéns! 🥳</p>
                    <div className="flex justify-center">
                        <Image src="/images/owl-smiling.png" alt="Smiling Owl Image"
                        width={400} height={400} />
                    </div>
                    <span id="rewardID" />
                </div> 
                :
                <>
                 <div className="flex flex-row gap-8 mt-6">
                    <Bar percentage={scorePercentage} color="green" />
                    <Bar percentage={100 - scorePercentage} color="red" />
                 </div>
                 <div className="flex flex-row gap-8">
                    <p>{score} Correctas</p>
                    <p>{totalQuestions - score} Incorrectas</p>
                 </div>
                </>}
            </main>
        </div>
    )
}

export default QuizzSubmission; 