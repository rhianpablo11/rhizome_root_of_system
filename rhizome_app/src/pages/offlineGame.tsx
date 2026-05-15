import { useState } from "react";
import bg from "../assets/bg.png";
import LogoType from "../components/logoType";
import SelectNameOfPlayers from "./selectNameOfPlayers";
import ShowPlayerFunction from "./showPlayerFunction";
import HeaderGamingPoints from "../components/headerGamingPoints";
import AlertModal from "../components/alertModal";
import PlenaryTimer from "../components/plenaryTimer";
import ShowCardsToChoice from "./showCardsToChoice";
import ChoiceAdvisorForGovernement from "./choiceAdvisorForGovernement";
import type { IPlayerData } from "../interfaces/components/IShowPlayerFunction";
import cardsData from "../database/cards_data.json";

function OfflineGame() {
    const [stateOfGame, setStateOfGame] = useState<
        | "selectPlayers"
        | "showFunctionPlayers"
        | "alert_test_show"
        | "plenary_timer_test_show"
        | "showCardToChoice"
        | "choiceAdvisor"
        | "showChaosCard"
        | "defenseTime"
        | "defenseTimeLeader"
        | "showCardChosen"
        | "endGame"
    >("selectPlayers");
    const [pointsComunity, setPointsComunity] = useState(0);
    const [pointsLobby, setPointsLobby] = useState(0);
    const [winningTeam, setWinningTeam] = useState<string | null>(null);
    const [playersName, setPlayersName] = useState<string[]>([]);
    const [playersData, setPlayersData] = useState<IPlayerData[]>([]);
    const [currentLeaderIndex, setCurrentLeaderIndex] = useState(0);
    const [currentAdvisor, setCurrentAdvisor] = useState<string | null>(null);
    const [rejectionCount, setRejectionCount] = useState(0);
    const [leaderVoted, setLeaderVoted] = useState(false);
    const [defenseLeader, setDefenseLeader] = useState(true);
    const [defenseAdvisor, setDefenseAdvisor] = useState(false);
    const [sessionId] = useState(() => {
        const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
        let sessionId = "";

        for (let i = 0; i < 5; i++) {
            sessionId += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return sessionId;
    });
    const [deck, setDeck] = useState<string[]>(() => {
        // Pega todos os IDs do JSON e embaralha com Fisher-Yates
        const allIds = cardsData.map((c) => c.id);
        for (let i = allIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
        }
        return allIds;
    });
    const [currentDrawnCards, setCurrentDrawnCards] = useState<string[]>([]);
    const [approvedCardId, setApprovedCardId] = useState<string | null>(null);

    const generatePlayersFunction = (playersName: string[]): IPlayerData[] => {
        const totalPlayers = playersName.length;

        let lobbyCount = 2;
        if (totalPlayers >= 7) lobbyCount = 3;
        if (totalPlayers >= 9) lobbyCount = 4;

        const communityCount = totalPlayers - lobbyCount;

        const roles: Array<"community" | "lobby"> = [
            ...Array(communityCount).fill("community"),
            ...Array(lobbyCount).fill("lobby"),
        ];

        // algorithm of Fisher-Yates for embaralhar
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        // Distribui as cartas embaralhadas para os nomes e gera um ID único
        return playersName.map((name, index) => {
            return {
                // crypto.randomUUID() nativo do JS
                id: crypto.randomUUID(),
                name: name,
                playerRole: roles[index],
            };
        });
    };

    const finishedChoicesOfNamesPlayers = () => {
        setPlayersData(generatePlayersFunction(playersName));
        setStateOfGame("showFunctionPlayers");
    };

    const handleOnFinishPlayersSeeYoursFunctions = () => {
        setStateOfGame("choiceAdvisor");
    };

    const rotateLeader = () => {
        setCurrentLeaderIndex((prevIndex) => (prevIndex + 1) % playersData.length);
    };

    const ChoiceGovernament = () => {
        const currentLeader = playersData[currentLeaderIndex];
        const availableAdvisors = playersData.filter((player) => player.id !== currentLeader?.id);
        return availableAdvisors;
    };

    // o id ta sendo o proprio nome
    const handleGovernmentApproved = (advisorId: string | null) => {
        // Zera o termômetro do caos
        if (advisorId != null) {
            setRejectionCount(0);
            const drawn = deck.slice(0, 3);
            setCurrentDrawnCards(drawn);
            setDeck(deck.slice(3));
            setLeaderVoted(false);
            setStateOfGame("showCardToChoice");
            setCurrentAdvisor(advisorId);
        }
    };

    const handleGovernmentRejected = () => {
        const newCount = rejectionCount + 1;

        if (newCount >= 3) {
            console.log("O CAOS SE INSTAUROU! 3 reprovações seguidas.");

            setRejectionCount(0);

            rotateLeader();
            const chaosCard = deck[0];
            setCurrentDrawnCards([chaosCard]);
            setDeck(deck.slice(1));
            // TODO: Mudar o estado para abrir o "Componente de Alerta"
            // e depois rodar a função de pegar uma carta aleatória do baralho e aplicar direto!
            setStateOfGame("alert_test_show");

            // Depois de 3.5 segundos lendo o alerta, muda pra tela da carta do caos!
            // setTimeout(() => {
            //     setStateOfGame("showChaosCard");
            // }, 3500);
        } else {
            console.log(`Governo rejeitado. Estamos em ${newCount}/3 pro caos.`);

            setRejectionCount(newCount);

            rotateLeader();
        }
    };

    const skipAlert = () => {
        setStateOfGame("showChaosCard");
    };

    const handleOnFinishPlenaryTimer = () => {
        if (approvedCardId) {
            applyPointsAndCheckWin(approvedCardId);
        }
    };

    const LiderVoted = (remainingCards: string[]) => {
        console.log(remainingCards);
        setCurrentDrawnCards(remainingCards);
        setLeaderVoted(true);
    };

    const initiateTimeForDefenses = () => {
        setDefenseLeader(true);
        setDefenseAdvisor(false);
        setStateOfGame("defenseTimeLeader");
    };

    const AdvisorVoted = (approvedCardId: string) => {
        console.log("Aprovada pelo Conselheiro (ou pelo Caos):", approvedCardId);
        // Após a aprovação final, provavelmente vai pra tela de plenária
        setApprovedCardId(approvedCardId);
        setStateOfGame("showCardChosen");
    };

    const timeLeaderDefenseEnd = () => {
        setDefenseLeader(false);
        setDefenseAdvisor(true);
        setStateOfGame("defenseTime");
    };

    const timeAdvisorDefenseEnd = () => {
        setDefenseAdvisor(false);
        setDefenseLeader(false);
        setStateOfGame("plenary_timer_test_show");
    };

    const applyPointsAndCheckWin = (idCardToEvaluate: string) => {
        // Busca a carta inteira no JSON pra saber o TIPO dela
        const cardInfo = cardsData.find((c) => c.id === idCardToEvaluate);

        let newComPoints = pointsComunity;
        let newLobbyPoints = pointsLobby;

        if (cardInfo?.type === "COMUNIDADE") {
            newComPoints += 1;
            setPointsComunity(newComPoints);
        } else if (cardInfo?.type === "LOBBY") {
            newLobbyPoints += 1;
            setPointsLobby(newLobbyPoints);
        }

        // VERIFICA SE ALGUÉM BATEU 5 PONTOS
        if (newComPoints >= 5) {
            setWinningTeam("A COMUNIDADE");
            setStateOfGame("endGame");
        } else if (newLobbyPoints >= 5) {
            setWinningTeam("O LOBBY (SISTEMA)");
            setStateOfGame("endGame");
        } else {
            // Se ninguém ganhou, roda a mesa e vai pra próxima rodada
            setApprovedCardId(null);
            rotateLeader();
            setLeaderVoted(false);
            setStateOfGame("choiceAdvisor");
        }
    };

    const handleChaosCardVoted = (chaosCardId: string) => {
        applyPointsAndCheckWin(chaosCardId);
    };

    const backToMenu = () => {
        // Dependendo de como vc configurou seu React Router, pode ser:
        // navigate("/")
        window.location.href = "/";
    };

    // logical of showing components in the offline game page, like the game itself, the choices, etc.
    const componentToShow = () => {
        if (stateOfGame == "selectPlayers") {
            return <SelectNameOfPlayers playersNameSet={setPlayersName} startGame={finishedChoicesOfNamesPlayers} />;
        } else if (stateOfGame == "showFunctionPlayers") {
            return <ShowPlayerFunction listPlayers={playersData} onFinish={handleOnFinishPlayersSeeYoursFunctions} />;
        } else if (stateOfGame == "alert_test_show") {
            return (
                <>
                    <div className="w-full h-full -my-15 flex flex-col items-center justify-center">
                        <AlertModal
                            text={"Já ocorreram 3 votações reprovadas! Uma carta aleatoria vai ser aprovada!"}
                            buttonText="Revelar carta"
                            onSkip={skipAlert}
                        />
                    </div>
                </>
            );
        } else if (stateOfGame == "endGame") {
            return (
                <div className="w-full h-full -my-15 flex flex-col items-center justify-center">
                    <AlertModal
                        text={`🔥 Fim de Jogo! ${winningTeam} venceu a partida com 5 projetos aprovados!`}
                        buttonText="Voltar ao inicio"
                        onSkip={backToMenu}
                    />
                </div>
            );
        } else if (stateOfGame == "defenseTime") {
            return (
                <>
                    <div className="w-full h-full flex -my-15 flex-col items-center justify-center">
                        <PlenaryTimer
                            onFinish={timeAdvisorDefenseEnd}
                            advisorDefenseTime={defenseAdvisor}
                            leaderDefenseTime={defenseLeader}
                        />
                    </div>
                </>
            );
        } else if (stateOfGame == "defenseTimeLeader") {
            return (
                <>
                    <div className="w-full h-full flex -my-15 flex-col items-center justify-center">
                        <PlenaryTimer
                            onFinish={timeLeaderDefenseEnd}
                            advisorDefenseTime={defenseAdvisor}
                            leaderDefenseTime={defenseLeader}
                        />
                    </div>
                </>
            );
        } else if (stateOfGame == "plenary_timer_test_show") {
            return (
                <>
                    <div className="w-full h-full flex -my-15 flex-col items-center justify-center">
                        <PlenaryTimer
                            onFinish={handleOnFinishPlenaryTimer}
                            advisorDefenseTime={defenseAdvisor}
                            leaderDefenseTime={defenseLeader}
                        />
                    </div>
                </>
            );
        } else if (stateOfGame == "showCardToChoice") {
            if (currentAdvisor != null) {
                if (leaderVoted) {
                    return (
                        <ShowCardsToChoice
                            key="advisor-turn"
                            nameAdvisor={currentAdvisor}
                            nameLider={playersData[currentLeaderIndex].name}
                            showToLider={!leaderVoted}
                            cardsId={currentDrawnCards}
                            onAdvisorVoted={AdvisorVoted}
                            onLiderVoted={LiderVoted}
                            state="defense"
                        />
                    );
                } else {
                    return (
                        <ShowCardsToChoice
                            key="leader-turn"
                            nameAdvisor={currentAdvisor}
                            nameLider={playersData[currentLeaderIndex].name}
                            showToLider={!leaderVoted}
                            cardsId={currentDrawnCards}
                            onAdvisorVoted={AdvisorVoted}
                            onLiderVoted={LiderVoted}
                            state="defense"
                        />
                    );
                }
            }
        } else if (stateOfGame == "choiceAdvisor") {
            return (
                <ChoiceAdvisorForGovernement
                    nameLider={playersData[currentLeaderIndex].name}
                    playersList={ChoiceGovernament()}
                    aprovedGroup={handleGovernmentApproved}
                    reprovedGroup={handleGovernmentRejected}
                    key={currentLeaderIndex}
                />
            );
        } else if (stateOfGame == "showChaosCard") {
            // 4. A TELA DO CAOS (Aproveita o seu componente passando apenas 1 carta)
            return (
                <ShowCardsToChoice
                    key="chaos-turn"
                    nameAdvisor="Povo"
                    nameLider="Caos"
                    showToLider={false} // Pra ele agir como "conselheiro" e já aprovar a carta direto
                    cardsId={currentDrawnCards} // Puxou só 1 carta do baralho!
                    onAdvisorVoted={handleChaosCardVoted}
                    state="confirm"
                />
            );
        } else if (stateOfGame == "showCardChosen") {
            return (
                <ShowCardsToChoice
                    key={`advisor-choice-${currentLeaderIndex}`}
                    nameAdvisor="Povo"
                    nameLider=""
                    showToLider={false} // Pra ele agir como "conselheiro" e já aprovar a carta direto
                    cardsId={[approvedCardId!]} // Puxou só 1 carta do baralho!
                    onAdvisorVoted={initiateTimeForDefenses}
                    state="confirm"
                />
            );
        }
    };

    return (
        <div
            className="w-full h-dvh overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url("${bg}")`,
            }}>
            <div className="w-full h-full flex flex-col backdrop-blur-[3px]">
                <div className="shrink-0">
                    {stateOfGame == "selectPlayers" ? (
                        <LogoType localOfUse="offlinePage" />
                    ) : (
                        <HeaderGamingPoints
                            pointsCommunity={pointsComunity}
                            pointsLobby={pointsLobby}
                            idSession={sessionId}
                        />
                    )}
                </div>
                <div className="flex-1 overflow-hidden pt-5 px-4 w-full flex flex-col">{componentToShow()}</div>
            </div>
        </div>
    );
}

export default OfflineGame;
