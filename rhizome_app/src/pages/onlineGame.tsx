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
    const [advisorSelected, setAdvisorSelected] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    const [stateOfGame, setStateOfGame] = useState<
        | "waitingRoom"
        | "choiceAdvisor"
        | "ShowChaosCard"
        | "showPlayerFunction"
        | "votingGovernment"
        | "alertVotingReproveds"
        | "alertVotingNotApproveds"
        | "advisorChoiceCard"
        | "leaderChoiceCard"
        | "leaderDefenseTime"
        | "advisorDefenseTime"
        | "plenaryTime"
        >("waitingRoom");

    const handleStartGame = () => {
        console.log("Iniciando o jogo...");
    };

    const handleAdvisorSelected = (id: string | null) => {
        console.log("Conselheiro selecionado:", id);
    };

    const componentToRender = () => {
        if(stateOfGame === "waitingRoom") {
            return(
                <>
                    <ShowPlayersConected startGame={handleStartGame} isAdmin={isAdmin} />
                </>
            );
        } else if(stateOfGame == 'votingGovernment'){
            return(
                <>
                    <ChoiceAdvisorForGovernement
                        nameLider="Joao"
                        playersList={["ojaf", "kij", "oj", "agjpoa"]}
                        onlineGame={true}
                        aprovedGroup={handleAdvisorSelected}
                        playersVoting={true}
                        advisorName="Militão"
                    />
                </>
            )
        } else if(stateOfGame == 'choiceAdvisor'){
            return(
                <>
                    <ChoiceAdvisorForGovernement
                        nameLider="Joao"
                        playersList={["ojaf", "kij", "oj", "agjpoa"]}
                        onlineGame={true}
                        aprovedGroup={handleAdvisorSelected}
                        playersVoting={false}
                        advisorName="Militão"
                    />
                </>
            )
        } else if(stateOfGame == 'leaderDefenseTime'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'advisorDefenseTime'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'leaderChoiceCard'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'advisorChoiceCard'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'ShowChaosCard'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'alertVotingNotApproveds'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'alertVotingReproveds'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'plenaryTime'){
            return(
                <>
                
                </>
            )
        } else if(stateOfGame == 'showPlayerFunction'){
            return(
                <>
                
                </>
            )
        }
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
                        {componentToRender()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OnlineGame;
