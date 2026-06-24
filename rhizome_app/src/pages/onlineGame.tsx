import { useEffect, useState } from "react";
import bg from "../assets/bg.webp";
import LogoType from "../components/logoType";
import ShowPlayersConected from "../components/showPlayersConecteds";
import ChoiceAdvisorForGovernement from "./choiceAdvisorForGovernement";
import AlertModal from "../components/alertModal";
import { useGameNetwork } from "../hooks/useGameNetwork";
import type { GameMessage } from "../interfaces/game/INetwork";
import { ChoiceGovernament, generatePlayersFunction, getCardsIds, prepareMyPlayerList } from "../services/gameService";
import { usePeer } from "../contexts/PeerContext";
import ShowPlayerFunction from "./showPlayerFunction";
import type { IPlayerData } from "../interfaces/components/IShowPlayerFunction";
import cardsData from "../database/cards_data.json";
import ShowCardsToChoice from "./showCardsToChoice";
import HeaderGamingPoints from "../components/headerGamingPoints";
import { useNavigate } from "react-router";



function OnlineGame() {
    const MAX_SCORE = 5;    
    const navigate = useNavigate()
    const { players, roomId, myPlayerName, broadcast } = usePeer();
    const isHost = players.find(p => p.name === myPlayerName)?.isHost || false;
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
        | 'gameOver'
        >("waitingRoom");
    const [myRole, setMyRole] = useState<'community' | 'lobby'>('community')
    const [playersName, setPlayersName] = useState<IPlayerData[]>([])

    const [aliars, setAliars] = useState<string[]>([])
    const [playersReady, setPlayersReady] = useState<string[]>([]);
    const [myFormattedList, setMyFormattedList] = useState<IPlayerData[]>([]);
    const [currentLeaderIndex, setCurrentLeaderIndex] = useState<number>(0)
    const [possibleAdvisors, setPossibleAdvisors] = useState<IPlayerData[]>([])
    const [advisorSelected, setAdvisorSelected] = useState<string>("");
    const [cardsOfRound, setCardsOfRound] = useState<string[]>([''])
    const [playersConfirmedCard, setPlayersConfirmedCard] = useState<string[]>([]);
    const [score, setScore] = useState({ community: 0, lobby: 0 });
    const [reprovedGovernmentCount, setReprovedGovernmentCount] = useState<number>(0);
    const [winnerTeam, setWinnerTeam] = useState<string | null>(null);
    const [votesCount, setVotesCount] = useState<{ approved: number; reproved: number; votedPlayers: string[] }>({
        approved: 0,
        reproved: 0,
        votedPlayers: []
    });

    useEffect(()=>{
        console.log(myRole)
        console.log(aliars)
        console.log(playersReady)
        console.log(playersConfirmedCard)
        console.log(votesCount)
    },[myRole, aliars, playersReady, playersConfirmedCard, votesCount])
    
    // const rotateLeader = () => {
    //     setCurrentLeaderIndex((prevIndex) => (prevIndex + 1) % players.length);
    // };

    
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
            case 'VOTING_ON_GOVERNMENT':{
                // 📡 REBOTE DO HOST: O Host recebe do Líder (Cliente) e avisa todo mundo que é hora de votar!
                if (isHost && !message.isHost) {
                    broadcast({
                        type: 'VOTING_ON_GOVERNMENT',
                        payload: message.payload,
                        isHost: true
                    });
                }
                
                setAdvisorSelected(message.payload.advisorId);
                setStateOfGame("votingGovernment");
                break;
            }
            case 'WAITING_FOR_GOVERNMENT_ACTION':
                setStateOfGame("waitToDo");
                break;
            case 'LEADER_CHOICE_CARD':{
                const currentLeaderReceived = message.payload.leaderId
                console.log('LEADER_CHOICE_CARD')
                console.log(currentLeaderReceived)
                console.log(playersName)
                console.log(myPlayerName)
                console.log(message.payload.cardsId)

                if(playersName[currentLeaderReceived].name == myPlayerName){
                    setCardsOfRound(message.payload.cardsId)
                    setStateOfGame("leaderChoiceCard")
                } else{
                    setStateOfGame('waitToDo')
                }
                break;
            }
            case 'ADVISOR_CHOICE_CARD':
                if (isHost && !message.isHost) {
                    broadcast({
                        type: 'ADVISOR_CHOICE_CARD',
                        payload: message.payload,
                        isHost: true
                    });
                }

                if(myPlayerName == message.payload.advisorName){
                    setCardsOfRound(message.payload.cardsRemaining)
                    setStateOfGame('advisorChoiceCard')
                } else{
                    setStateOfGame('waitToDo')
                }
                break;
            case 'SHOW_CHAOS_CARD':
                console.log('CHEGUEI: SHOW_CHAOS_CARD')
                if (isHost && !message.isHost) {
                    broadcast({
                        type: 'SHOW_CHAOS_CARD',
                        payload: message.payload,
                        isHost: true
                    })
                }
                console.log('AAAAA:' + message.payload.cardChoice)
                setCardsOfRound([message.payload.cardChoice])
                setStateOfGame('ShowChaosCard')
                break;

            case 'PLAYER_CONFIRMED_CARD': {
                if (isHost) {
                    const readyPlayerName = message.payload.name;
                    setPlayersConfirmedCard((prev) => {
                        if (prev.includes(readyPlayerName)) return prev;
                        const newList = [...prev, readyPlayerName];
                        checkIfAllConfirmedCard(newList); // 🧠 Chama a checagem de fim de rodada
                        return newList;
                    });
                }
                break;
            }
            case 'UPDATE_SCORE_AND_NEW_ROUND': {
                setScore(message.payload.newScore);
                setCurrentLeaderIndex(message.payload.newLeaderIndex);
                setReprovedGovernmentCount(message.payload.reprovedCount !== undefined ? message.payload.reprovedCount : 0);
                // Zera as variáveis locais de votação para a rodada nova
                setAdvisorSelected("");
                setCardsOfRound([]);
                
                // Se eu sou o Líder Novo, abro minha tela de escolha. Senão, espero.
                if (myPlayerName === playersName[message.payload.newLeaderIndex].name) {
                    const advisorAvailables = ChoiceGovernament(playersName, message.payload.newLeaderIndex);
                    setPossibleAdvisors(advisorAvailables);
                    setStateOfGame("choiceAdvisor");
                } else {
                    setStateOfGame("waitToDo");
                }
                break;
            }
            case 'GAME_OVER': {
                setScore(message.payload.newScore);
                setWinnerTeam(message.payload.winner);
                setStateOfGame('gameOver');
                break;
            }
            // Adicione os outros cases conforme for construindo as telas
        }
    };


    const { sendNetworkMessage } = useGameNetwork(handleNetworkMessage);


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
        if (!id) return;
        console.log("Conselheiro selecionado:", id);
        setAdvisorSelected(id);
        
        // 🚨 MUDANÇA: Agora QUALQUER líder manda a mensagem pra rede!
        sendNetworkMessage({ 
            type: 'VOTING_ON_GOVERNMENT', 
            payload: { advisorId: id },
            isHost: isHost 
        });
        
        // Se eu sou o Host, eu já pulo de tela pra não esperar o meu próprio rebote
        if (isHost) {
            setStateOfGame("votingGovernment");
        } else {
            // O Cliente Líder vai pra tela de espera aguardando o Host dar o "ok" global
            setStateOfGame("waitToDo");
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


    const checkIfAllConfirmedCard = (readyList: string[]) => {
        if (readyList.length >= players.length) {
            const finalCard = cardsOfRound[0]; 
            const isCommunityCard = finalCard.includes('c'); 
            
            const newScore = {
                community: isCommunityCard ? score.community + 1 : score.community,
                lobby: !isCommunityCard ? score.lobby + 1 : score.lobby
            };

            // 🏆 LÓGICA DE VITÓRIA (O TRIBUNAL FINAL)
            if (newScore.community >= MAX_SCORE || newScore.lobby >= MAX_SCORE) {
                const winnerGroup = newScore.community >= MAX_SCORE ? 'Comunidade' : 'Executivos (Lobby)';
                
                sendNetworkMessage({
                    type: 'GAME_OVER',
                    payload: { newScore, winner: winnerGroup },
                    isHost: true
                });
                
                setScore(newScore);
                setWinnerTeam(winnerGroup);
                setStateOfGame("gameOver");
                return; // 🛑 Para a execução aqui! O jogo acabou!
            }

            const newLeaderIndex = (currentLeaderIndex + 1) % players.length;

            setPlayersConfirmedCard([]);
            setVotesCount({ approved: 0, reproved: 0, votedPlayers: [] });
            setReprovedGovernmentCount(0); // Reseta o Caos sempre que uma carta passa

            setScore(newScore);
            setCurrentLeaderIndex(newLeaderIndex);

            sendNetworkMessage({
                type: 'UPDATE_SCORE_AND_NEW_ROUND',
                payload: { newScore, newLeaderIndex, reprovedCount: 0 },
                isHost: true
            });

            if (myPlayerName === playersName[newLeaderIndex].name) {
                const advisorAvailables = ChoiceGovernament(playersName, newLeaderIndex);
                setPossibleAdvisors(advisorAvailables);
                setStateOfGame("choiceAdvisor");
            } else {
                setStateOfGame("waitToDo");
            }
        }
    };


    const handleIncomingVote = (vote: 'approved' | 'reproved', voterName: string) => {
        setVotesCount((prev) => {
            if (prev.votedPlayers.includes(voterName)) return prev;

            const newApproved = vote === 'approved' ? prev.approved + 1 : prev.approved;
            const newReproved = vote === 'reproved' ? prev.reproved + 1 : prev.reproved;
            const newVotedPlayers = [...prev.votedPlayers, voterName];

            if (newVotedPlayers.length === players.length) {
                if (newApproved > newReproved) {
                    setReprovedGovernmentCount(0);
                    const cardsIdsOfRound = getCardsIds(cardsData).slice(0, 3);
                    setCardsOfRound(cardsIdsOfRound);
                    
                    sendNetworkMessage({ 
                        type: 'LEADER_CHOICE_CARD', 
                        payload: { leaderId: currentLeaderIndex, cardsId: cardsIdsOfRound },
                        isHost: isHost 
                    });
                    
                    if(isHost && playersName[currentLeaderIndex].name == myPlayerName){
                        setStateOfGame("leaderChoiceCard");
                    } else{
                        setStateOfGame("waitToDo");
                    }
                    
                } else {
                    // 🔥 LÓGICA DA ROLETA DO CAOS E VOTAÇÃO REPROVADA
                    const newFailCount = reprovedGovernmentCount + 1;
                    
                    if (newFailCount >= 3) {
                        // Bateu 3! CAOS!
                        const chaosCard = getCardsIds(cardsData)[0]; // Puxa 1 carta aleatória
                        setReprovedGovernmentCount(0);
                        setCardsOfRound([chaosCard]);
                        
                        sendNetworkMessage({
                            type: 'SHOW_CHAOS_CARD',
                            payload: { cardChoice: chaosCard },
                            isHost: true
                        });
                        setStateOfGame("ShowChaosCard");

                    } else {
                        // Apenas 1 ou 2 falhas. Gira a mesa sem carta!
                        setReprovedGovernmentCount(newFailCount);
                        const newLeaderIndex = (currentLeaderIndex + 1) % players.length;
                        setCurrentLeaderIndex(newLeaderIndex);
                        setVotesCount({ approved: 0, reproved: 0, votedPlayers: [] });

                        sendNetworkMessage({
                            type: 'UPDATE_SCORE_AND_NEW_ROUND',
                            payload: { newScore: score, newLeaderIndex: newLeaderIndex, reprovedCount: newFailCount },
                            isHost: true
                        });

                        if (myPlayerName === playersName[newLeaderIndex].name) {
                            const advisorAvailables = ChoiceGovernament(playersName, newLeaderIndex);
                            setPossibleAdvisors(advisorAvailables);
                            setStateOfGame("choiceAdvisor");
                        } else {
                            setStateOfGame("waitToDo");
                        }
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


    const notifyAboutCardChoiceOfLeader = (cardsRemaining: string[]) =>{

        sendNetworkMessage({
            type: 'ADVISOR_CHOICE_CARD',
            isHost: isHost,
            payload: {cardsRemaining: cardsRemaining,
                      advisorName: advisorSelected
            }
        })
        setStateOfGame('waitToDo')
    }

    const notifyAboutCardChoiceOfAdvisor = (cardsRemaining: string) =>{
        sendNetworkMessage({
            type: 'SHOW_CHAOS_CARD',
            isHost: isHost,
            payload: {cardChoice: cardsRemaining}
        })
        console.log(`[ADVISOR] Mudando minha tela para mostrar a carta escolhida: ${cardsRemaining}`);
        setCardsOfRound([cardsRemaining]);
        setStateOfGame('ShowChaosCard');
    }


    const notifyPlayerConfirmedCard = () => {
        if (isHost) {
            setPlayersConfirmedCard((prev) => {
                const newList = [...prev, myPlayerName];
                checkIfAllConfirmedCard(newList);
                return newList;
            });
        } else {
            sendNetworkMessage({ type: 'PLAYER_CONFIRMED_CARD', payload: { name: myPlayerName }, isHost: false });
        }
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
                    <ShowCardsToChoice
                        key="advisor-turn"
                        nameAdvisor={currentLeaderName}
                        nameLider={currentLeaderName}
                        showToLider={true}
                        cardsId={cardsOfRound}
                        onAdvisorVoted={()=>{}}
                        onLiderVoted={notifyAboutCardChoiceOfLeader}
                        state="defense"
                    />
                </>
            )
        } else if(stateOfGame == 'advisorChoiceCard'){
            return(
                <>
                    <ShowCardsToChoice
                        key="advisor-turn"
                        nameAdvisor={myPlayerName}
                        nameLider={currentLeaderName}
                        showToLider={false}
                        cardsId={cardsOfRound}
                        onAdvisorVoted={notifyAboutCardChoiceOfAdvisor}
                        onLiderVoted={()=>{}}
                        state="defense"
                    />
                </>
            )
        } else if(stateOfGame == 'ShowChaosCard'){
            console.log('EU CONSIGO CHEGAR AQ?')
            console.log(cardsOfRound)
            return(
                <>
                    <ShowCardsToChoice
                        key={`chaos-card-${cardsOfRound[0]}`}
                        nameAdvisor={'Povo'}
                        nameLider={'Povo'}
                        showToLider={false}
                        cardsId={cardsOfRound}
                        onAdvisorVoted={notifyPlayerConfirmedCard}
                        onLiderVoted={notifyPlayerConfirmedCard}
                        state="confirm"
                    />
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
                <div className="w-full h-full -my-15 flex flex-col items-center justify-center">
                    {/* AQUI O JOGADOR VÊ O ALERTA SE A VOTAÇÃO TIVER SIDO REPROVADA MANTENDO O WAIT TODO */}
                    <AlertModal 
                        text={reprovedGovernmentCount > 0 
                            ? `O governo foi reprovado! Nível de caos na mesa: ${reprovedGovernmentCount}/3. Aguarde o próximo líder.` 
                            : "Está ocorrendo uma operação na mesa. Por favor, aguarde a sua vez!"} 
                        buttonText={""} 
                        onSkip={()=>{} } 
                    />
                </div>
            )
        } else if (stateOfGame === 'gameOver') {
            // 🏆 TELA DE FINAL DE JOGO MATADORA
            return (
                <div className="w-full h-full flex flex-col items-center justify-center animate-bounce">
                    <AlertModal 
                        text={`🏆 FIM DE JOGO! O grupo vencedor foi: ${winnerTeam?.toUpperCase()}! Placar Final - Comunidade ${score.community} x ${score.lobby} Executivos`} 
                        buttonText={"Jogar Novamente"} 
                        onSkip={()=>{navigate('/')}} // Dá um refresh elegante na página pra reiniciar o app inteiro
                    />
                </div>
            );
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
                        {stateOfGame == 'waitingRoom' ? (
                            <LogoType localOfUse="offlinePage" />
                        ) : (
                            <HeaderGamingPoints
                                pointsCommunity={score.community}
                                pointsLobby={score.lobby}
                                idSession={roomId && roomId}
                            />
                        )}
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
