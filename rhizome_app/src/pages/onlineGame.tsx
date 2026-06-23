import { useState } from "react";
import bg from "../assets/bg.webp";
import Button from "../components/button";
import GetDataOnlineRoom from "../components/getDataOnlineRoom";
import LogoType from "../components/logoType";
import ShowPlayersConected from "../components/showPlayersConecteds";
import type { IOnlineGame } from "../interfaces/components/IOnlineGame";
import ChoiceAdvisorForGovernement from "./choiceAdvisorForGovernement";
import CreateRoom from "./createRoomComponent";
import AlertModal from "../components/alertModal";
import { useGameNetwork } from "../hooks/useGameNetwork";
import type { GameMessage } from "../interfaces/game/INetwork";

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
        | 'waitToDo'
        >("waitingRoom");


    const handleNetworkMessage = (message: GameMessage) => {
        // Se a rede mandou mudar o estado do jogo, a interface obedece cegamente:
        switch (message.type) {
            case 'START_GAME':
                setStateOfGame("showPlayerFunction");
                break;
            case 'LEADER_CHOICE_ADVISOR':
                setStateOfGame("choiceAdvisor");
                break;
            case 'VOTING_ON_GOVERNMENT':
                setStateOfGame("votingGovernment");
                break;
            case 'WAITING_FOR_GOVERNMENT_ACTION':
                setStateOfGame("waitToDo");
                break;
            // Adicione os outros cases conforme for construindo as telas
        }
    };


    const { sendNetworkMessage, isHost } = useGameNetwork(handleNetworkMessage);


    const handleStartGameClick = () => {
        // Apenas o Host tem permissão para disparar o início do jogo
        if (isHost) {
            // Aqui futuramente você chamará o gameService.generatePlayersFunction()
            
            // Avisa TODOS os celulares para irem para a tela de papel
            sendNetworkMessage({ type: 'START_GAME', isHost: true });
            
            // O Host muda a própria tela também
            setStateOfGame("showPlayerFunction");
        }
    };


    const handleAdvisorSelected = (id: string | null) => {
        console.log("Conselheiro selecionado:", id);
        setAdvisorSelected(id);
        
        if (isHost) {
            sendNetworkMessage({ 
                type: 'VOTING_ON_GOVERNMENT', 
                payload: { advisorId: id },
                isHost: true 
            });
            setStateOfGame("votingGovernment");
        }
    };


    const componentToRender = () => {
        if(stateOfGame === "waitingRoom") {
            return(
                <>
                    <ShowPlayersConected startGame={handleStartGameClick} isAdmin={isAdmin} />
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
                    <AlertModal text={""} buttonText={""} onSkip={()=>{} } />
                </>
            )
        } else if(stateOfGame == 'alertVotingReproveds'){
            return(
                <>
                    <AlertModal text={""} buttonText={""} onSkip={()=>{} } />
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
        } else if(stateOfGame == 'waitToDo'){
            return(
                <>
                    <AlertModal text={""} buttonText={""} onSkip={()=>{} } />
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
