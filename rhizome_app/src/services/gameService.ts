import type { IPlayerData } from "../interfaces/components/IShowPlayerFunction";
import type ICardsData from "../interfaces/game/ICardsData";

// function to generate players with their roles based on the number of players in the game
const generatePlayersFunction = (playersName: string[]): IPlayerData[] => {
    const totalPlayers = playersName.length;
    console.log(playersName)
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


const prepareMyPlayerList = (officialList: IPlayerData[], myName: string): IPlayerData[] => {
    // 1. Descobre quem sou eu na lista oficial
    const me = officialList.find((p) => p.name === myName);
    
    if (!me) return []; // Se der erro e não me achar, retorna vazio

    if (me.playerRole === "community") {
        // A Comunidade joga cega. A lista dela só tem ela mesma.
        return [me];
    } else {
        // O Lobby (Executivo) conhece os parceiros. 
        // 2. Filtra todo mundo que é do lobby, EXCETO eu mesmo.
        const allies = officialList.filter((p) => p.playerRole === "lobby" && p.name !== myName);
        
        // 3. Retorna a lista colocando EU na posição 0, seguido dos aliados.
        // Isso garante que o currentIndex do componente caia direto na sua carta!
        return [me, ...allies];
    }
};

export { generatePlayersFunction, getCardsIds, ChoiceGovernament, prepareMyPlayerList };
