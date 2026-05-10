export interface IShowPlayerFunction {
    listPlayers: IPlayerData[];
    onFinish: () => void;
}

interface IPlayerData {
    name: string;
    playerRole: "community" | "lobby";
}
