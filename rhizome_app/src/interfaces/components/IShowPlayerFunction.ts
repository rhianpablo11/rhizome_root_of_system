export interface IShowPlayerFunction {
    listPlayers: IPlayerData[];
    onFinish: () => void;
    onlineGame: boolean;
}

export interface IPlayerData {
    name: string;
    playerRole: "community" | "lobby";
    id?: string;
}
