import type { ICard } from "../components/ICard";

export interface IPlayer {
    id: string;
    nome: string;
    isLobby: boolean; // O app sorteia isso no Setup
}

export type GamePhase =
    | "SETUP"
    | "ELEICAO"
    | "BASTIDORES"
    | "PLENARIA"
    | "FIM";

export interface IGameState {
    gamers: IPlayer[];
    indexActualLider: number; // Indica de quem é a vez de segurar o celular
    comunityPoints: number;
    pointsLobby: number;
    actualFase: GamePhase;
    historicProjects: ICard[]; // Guarda os projetos aprovados para a tela de final de jogo
}
