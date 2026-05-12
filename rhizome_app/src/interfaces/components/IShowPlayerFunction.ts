export interface IShowPlayerFunction {
    listPlayers: IPlayerData[];
    onFinish: () => void;
}

export interface IPlayerData {
    name: string;
    playerRole: "community" | "lobby";
}
