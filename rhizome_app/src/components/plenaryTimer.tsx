import { useEffect, useState } from "react";
import type { IPlenaryTimer } from "../interfaces/components/IPlenaryTimer";
import Button from "./button";

function PlenaryTimer(props: IPlenaryTimer) {
    const { onFinish, leaderDefenseTime, advisorDefenseTime } = props;
    const [timeLeft, setTimeLeft] = useState(120);
    const [textButton, setTextButton] = useState("Pular Plenaria");
    console.log("VALORES Q CHEGOU NA PLENARIA: " + leaderDefenseTime + advisorDefenseTime);

    useEffect(() => {
        if (leaderDefenseTime || advisorDefenseTime) {
            setTimeLeft(30);
            setTextButton("Pular defesa");
        }
    }, [leaderDefenseTime, advisorDefenseTime]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setTimeLeft(120)
            onFinish();
        }

        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerInterval);
    }, [timeLeft, onFinish]);

    const handleButtonClickFather = () => {
        console.log("");
        onFinish();
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // .padStart(2, '0') garante que "2" vire "02" na tela
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return (
        <>
            <div className="bg-[#F6F7EF] flex flex-col w-full rounded-3xl justify-center items-center shadow-2xl ">
                <h1 className="text-[#1E293B] font-semibold text-3xl pt-5">
                    {leaderDefenseTime || advisorDefenseTime ? "Tempo de Defesa" : "Plenaria Iniciada"}
                </h1>
                <h1 className="text-[#1E293B] font-medium text-6xl pt-1 px-5">
                    {formattedMinutes}:{formattedSeconds}
                </h1>
                <div className="pb-5 w-full px-11 pt-4">
                    <Button
                        usesOn="commonGame"
                        text={textButton}
                        color={"darkBlue"}
                        onClickButtonChildren={handleButtonClickFather}
                    />
                </div>
            </div>
        </>
    );
}

export default PlenaryTimer;
