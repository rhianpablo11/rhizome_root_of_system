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
import { generatePlayersFunction, prepareMyPlayerList } from "../services/gameService";
import { usePeer } from "../contexts/PeerContext";
import ShowPlayerFunction from "./showPlayerFunction";
import type { IPlayerData } from "../interfaces/components/IShowPlayerFunction";

function OnlineGame() {
    const [advisorSelected, setAdvisorSelected] = useState<string | null>(null);
    const { players, roomId, myPlayerName } = usePeer();
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
    const [myRole, setMyRole] = useState<'community' | 'lobby'>('community')
    const [playersName, setPlayersName] = useState<string[]>([])
    const [myName, setMyName] = useState<string>('')
    const [aliars, setAliars] = useState<string[]>([])
    const [playersReady, setPlayersReady] = useState<string[]>([]);
    const [myFormattedList, setMyFormattedList] = useState<IPlayerData[]>([]);
    console.log(myPlayerName)
    const handleNetworkMessage = (message: GameMessage) => {
        // Se a rede mandou mudar o estado do jogo, a interface obedece cegamente:
        switch (message.type) {
            case 'START_GAME':
                { console.log(message)
                const playersList = message.payload;
                const myCustomList = prepareMyPlayerList(playersList, myPlayerName);
                console.log(myCustomList)
                const myUser = playersList.find((player: any) => player.name === myPlayerName);
                setMyFormattedList(myCustomList);
                if (myUser) {
                    console.log(`🕵️‍♂️ Fui designado como: ${myUser.playerRole}`);
                    setMyRole(myUser.playerRole);
                } else {
                    console.error("Eita, não achei meu nome na lista do Host!");
                }
                setStateOfGame("showPlayerFunction");
                
                setAliars(message.payload) //filtrar quem é do mesmo Role que o usuario
                break; }
            case 'HAVE_SEE_MY_FUNCTION': {
                // Apenas o Host se importa com essa contagem!
                if (isHost) {
                    const readyPlayerName = message.payload.name;
                    console.log(`✅ [HOST RECEBEU]: O jogador ${readyPlayerName} está pronto!`);
                    
                    setPlayersReady((prev) => {
                        // Verifica se o cara já não tá na lista para não contar duas vezes
                        if (prev.includes(readyPlayerName)) return prev;
                        
                        const newList = [...prev, readyPlayerName];
                        // Chama a checagem com a lista atualizada
                        checkIfAllAreReady(newList);
                        return newList;
                    });
                }
                break;
            }
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
            const playerNames = players.map((p) => p.name);
            console.log(players)
            const playersFunctions = generatePlayersFunction(playerNames)
            // Avisa TODOS os celulares para irem para a tela de papel
            sendNetworkMessage({ type: 'START_GAME', payload:playersFunctions, isHost: true });
            const myCustomList = prepareMyPlayerList(playersFunctions, myPlayerName);
            setMyFormattedList(myCustomList);
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


    const notifyAboutHaveSeeMyFunction = () => {
        console.log('cheguei na função q notifica')
        if (isHost) {
            // Se eu sou o Host, eu já me coloco na lista de "Prontos"
            setPlayersReady((prev) => {
                const newList = [...prev, myPlayerName];
                checkIfAllAreReady(newList); // Chama a checagem (vamos criar essa função já já!)
                return newList;
            });
        } else {
            // Se sou Cliente, eu aviso o Host na rede
            sendNetworkMessage({
                type: 'HAVE_SEE_MY_FUNCTION',
                payload: { name: myPlayerName },
                isHost: false
            });
        }
        
        // Todo mundo (Cliente e Host) muda a tela para ficar esperando a próxima etapa
        setStateOfGame("waitToDo");
    }


    // 🧠 A Lógica Exclusiva do Host para avançar o jogo
    const checkIfAllAreReady = (readyList: string[]) => {
        // Se a quantidade de pessoas prontas for igual ou maior que o total de jogadores na rede...
        if (readyList.length >= players.length) {
            console.log("🔥 TODO MUNDO PRONTO! INICIANDO A RODADA!");
            
            // Aqui o Host sorteia quem será o Líder inicial!
            // (Para testar rápido, vamos pegar o primeiro jogador da lista)
            const initialLeader = players[0].name;

            // O Host manda a ordem para a rede dizendo quem é o Líder e mudando a tela
            sendNetworkMessage({
                type: 'LEADER_CHOICE_ADVISOR',
                payload: { currentLeader: initialLeader },
                isHost: true
            });
            
            // O Host também muda a própria tela
            setStateOfGame("choiceAdvisor");
        }
    };


    const componentToRender = () => {
        if(stateOfGame === "waitingRoom") {
            return(
                <>
                    <ShowPlayersConected startGame={handleStartGameClick} isAdmin={isHost} />
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
                    <ShowPlayerFunction onlineGame={true} listPlayers={myFormattedList} onFinish={notifyAboutHaveSeeMyFunction} />
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
