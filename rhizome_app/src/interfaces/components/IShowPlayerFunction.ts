export interface IShowPlayerFunction {
    listPlayers: IPlayerData[];
}

interface IPlayerData{
    name: string
    playerRole: 'community' | 'lobby'
}