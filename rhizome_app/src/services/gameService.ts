import type { IPlayerData } from "../interfaces/components/IShowPlayerFunction";
import type ICardsData from "../interfaces/game/ICardsData";

// function to generate players with their roles based on the number of players in the game
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

const getCardsIds = (cardsData: ICardsData[]) => {
    // Pega todos os IDs do JSON e embaralha com Fisher-Yates
    const allIds = cardsData.map((c) => c.id);
    for (let i = allIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
    }
    return allIds;
};

const ChoiceGovernament = (playersData: IPlayerData[], currentLeaderIndex: number) => {
    const currentLeader = playersData[currentLeaderIndex];
    const availableAdvisors = playersData.filter((player) => player.id !== currentLeader?.id);
    return availableAdvisors;
};

export { generatePlayersFunction, getCardsIds, ChoiceGovernament };
