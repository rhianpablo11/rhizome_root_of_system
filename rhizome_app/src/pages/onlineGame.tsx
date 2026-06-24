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
import { ChoiceGovernament, generatePlayersFunction, getCardsIds, prepareMyPlayerList } from "../services/gameService";
import { usePeer } from "../contexts/PeerContext";
import ShowPlayerFunction from "./showPlayerFunction";
import type { IPlayerData } from "../interfaces/components/IShowPlayerFunction";
import cardsData from "../database/cards_data.json";

function OnlineGame() {
    
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
    const [playersName, setPlayersName] = useState<IPlayerData[]>([])
    const [myName, setMyName] = useState<string>('')
    const [aliars, setAliars] = useState<string[]>([])
    const [playersReady, setPlayersReady] = useState<string[]>([]);
    const [myFormattedList, setMyFormattedList] = useState<IPlayerData[]>([]);
    const [currentLeaderIndex, setCurrentLeaderIndex] = useState<number>(0)
    const [possibleAdvisors, setPossibleAdvisors] = useState<IPlayerData[]>([])
    const [advisorSelected, setAdvisorSelected] = useState<string>("");

    const [reprovedGovernmentCount, setReprovedGovernmentCount] = useState<number>(0);
    const [votesCount, setVotesCount] = useState<{ approved: number; reproved: number; votedPlayers: string[] }>({
        approved: 0,
        reproved: 0,
        votedPlayers: []
    });

    
    const rotateLeader = () => {
        setCurrentLeaderIndex((prevIndex) => (prevIndex + 1) % players.length);
    };

    console.log(myPlayerName)
    const handleNetworkMessage = (message: GameMessage) => {
        // Se a rede mandou mudar o estado do jogo, a interface obedece cegamente:
        switch (message.type) {
            case 'START_GAME':
                { console.log(message)
                const playersList = message.payload;
                
                setPlayersName(playersList)
                
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
                setCurrentLeaderIndex(message.payload.currentLeader)    
                if(isHost){
                    
                    setStateOfGame("choiceAdvisor");
                } else{
                    setStateOfGame('waitToDo')
                }
                
                break;
            case 'VOTE_CAST': {
                if (isHost) {
                    const { vote, voterName } = message.payload;
                    handleIncomingVote(vote, voterName);
                }
                break;
            }
            case 'VOTING_ON_GOVERNMENT':
                setAdvisorSelected(message.payload.advisorId)
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
            setPlayersName(playersFunctions)
            // Avisa TODOS os celulares para irem para a tela de papel
            sendNetworkMessage({ type: 'START_GAME', payload:playersFunctions, isHost: true });
            const myCustomList = prepareMyPlayerList(playersFunctions, myPlayerName);
            setMyFormattedList(myCustomList);
            // O Host muda a própria tela também
            setStateOfGame("showPlayerFunction");
        }
    };


    const handleAdvisorSelected = (id: string | null | undefined) => {
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
            const advisorAvailables = ChoiceGovernament(playersName, currentLeaderIndex)
            setPossibleAdvisors(advisorAvailables)
            console.log(advisorAvailables)
            console.log('PASSEI POR CA')
            // Aqui o Host sorteia quem será o Líder inicial!
            // (Para testar rápido, vamos pegar o primeiro jogador da lista)
            //const initialLeader = players[0].name;

            // O Host manda a ordem para a rede dizendo quem é o Líder e mudando a tela
            sendNetworkMessage({
                type: 'LEADER_CHOICE_ADVISOR',
                payload: { currentLeader: currentLeaderIndex },
                isHost: true
            });
            

            
            // O Host também muda a própria tela
            setStateOfGame("choiceAdvisor");
        }
    };


    const handleIncomingVote = (vote: 'approved' | 'reproved', voterName: string) => {
        setVotesCount((prev) => {
            // Evita voto duplo
            if (prev.votedPlayers.includes(voterName)) return prev;

            const newApproved = vote === 'approved' ? prev.approved + 1 : prev.approved;
            const newReproved = vote === 'reproved' ? prev.reproved + 1 : prev.reproved;
            const newVotedPlayers = [...prev.votedPlayers, voterName];

            // Verifica se todo mundo já votou
            if (newVotedPlayers.length === players.length) {
                console.log(`🗳️ Fim da votação! Aprovados: ${newApproved} | Reprovados: ${newReproved}`);
                
                if (newApproved > newReproved) {
                    console.log("✅ GOVERNO APROVADO!");
                    // Reseta o contador de Caos
                    setReprovedGovernmentCount(0);
                    getCardsIds(cardsData)
                    // TODO: Mudar estado para Leader Choice Card
                    sendNetworkMessage({ type: 'LEADER_CHOICE_CARD', 
                                         payload: {leaderId: currentLeaderIndex,
                                                   cardId:
                                         },
                                         isHost: isHost })
                    
                } else {
                    console.log("❌ GOVERNO REPROVADO!");
                    const newFailCount = reprovedGovernmentCount + 1;
                    setReprovedGovernmentCount(newFailCount);
                    
                    if (newFailCount >= 3) {
                        console.log("🔥 CAOS! 3 Governos reprovados!");
                        // TODO: Implementar lógica de carta de caos forçada
                    } else {
                        // Gira o líder e recomeça a rodada!
                        // TODO: Implementar chamada para a próxima rodada
                    }
                }
            }

            return { approved: newApproved, reproved: newReproved, votedPlayers: newVotedPlayers };
        });
    };


    const castVote = (voteType: 'approved' | 'reproved') => {
        console.log(`Meu voto foi: ${voteType}`);
        
        // Manda o voto pro Host
        sendNetworkMessage({
            type: 'VOTE_CAST',
            payload: { vote: voteType, voterName: myPlayerName },
            isHost: isHost
        });

        // Se eu sou o Host, eu já contabilizo meu próprio voto
        if (isHost) {
            handleIncomingVote(voteType, myPlayerName);
        }

        // Fica esperando o Host apurar as urnas
        setStateOfGame("waitToDo");
    };


    const componentToRender = () => {

        const currentLeaderName = playersName.length > 0 ? playersName[currentLeaderIndex]?.name : "Líder";

        if(stateOfGame === "waitingRoom") {
            return(
                <>
                    <ShowPlayersConected startGame={handleStartGameClick} isAdmin={isHost} />
                </>
            );
        } else if(stateOfGame == 'votingGovernment'){
            console.log(playersName)
            console.log(currentLeaderIndex)
            console.log(currentLeaderName)
            console.log(advisorSelected)
            return(
                <>
                    <ChoiceAdvisorForGovernement
                        nameLider={currentLeaderName}
                        playersList={[]}
                        onlineGame={true}
                        aprovedGroup={() => castVote('approved')}
                        reprovedGroup={() => castVote('reproved')}
                        playersVoting={true}
                        advisorName={advisorSelected}
                    />
                </>
            )
        } else if(stateOfGame == 'choiceAdvisor'){
            return(
                <>
                    <ChoiceAdvisorForGovernement
                        nameLider={currentLeaderName}
                        playersList={possibleAdvisors}
                        onlineGame={true}
                        aprovedGroup={handleAdvisorSelected}
                        playersVoting={false}
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
                    <div className="w-full h-full -my-15 flex flex-col items-center justify-center">
                        <AlertModal text={"Está ocorrendo uma operação entre o Lider e o Conselheiro, ou esperando pelo host iniciar a partida, por favor aguarde!"} buttonText={""} onSkip={()=>{} } />
                    </div>
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
                    <div className="w-full h-full flex px-4 justify-center">
                        {componentToRender()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OnlineGame;
