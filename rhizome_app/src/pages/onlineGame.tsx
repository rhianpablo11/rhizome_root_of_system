import { useState } from "react";
import bg from "../assets/bg.webp";
import Button from "../components/button";
import GetDataOnlineRoom from "../components/getDataOnlineRoom";
import LogoType from "../components/logoType";
import ShowPlayersConected from "../components/showPlayersConecteds";
import type { IOnlineGame } from "../interfaces/components/IOnlineGame";
import ChoiceAdvisorForGovernement from "./choiceAdvisorForGovernement";
import CreateRoom from "./createRoomComponent";

function OnlineGame() {
    const [advisorSelected, setAdvisorSelected] = useState<String | null>(null);
    const [stateOfGame, setStateOfGame] = useState<"waitingRoom" | "choiceAdvisor" | "showChaosCard">("waitingRoom");
    const handleStartGame = () => {
        console.log("Iniciando o jogo...");
    };

    const handleAdvisorSelected = (id: string | null) => {
        console.log("Conselheiro selecionado:", id);
    };

    const componentToRender = () => {
        return <></>;
    };

    return (
        <>
            <div
                className="w-full h-dvh flex flex-col items-center overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${bg}")`,
                }}>
                <div className="w-full h-full flex flex-col items-start  backdrop-blur-[3px]">
                    <div className="w-full flex items-center justify-center mt-4">
                        <LogoType localOfUse="offlinePage" />
                    </div>
                    <div className="w-full h-full flex justify-center">
                        {/* <ShowPlayersConected startGame={handleStartGame} isAdmin={true} /> */}
                        <ChoiceAdvisorForGovernement
                            nameLider="Joao"
                            playersList={["ojaf", "kij", "oj", "agjpoa"]}
                            onlineGame={true}
                            aprovedGroup={handleAdvisorSelected}
                            playersVoting={true}
                            advisorName="Militão"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default OnlineGame;
