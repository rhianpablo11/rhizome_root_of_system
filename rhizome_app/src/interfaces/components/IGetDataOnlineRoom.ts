export interface IGetDataOnlineRoom {
    useOn: 'getNamePlayer' | 'getInRoom' | 'showIdOfRoom'
    setplayerName?: (name: string) => void;
    setroomID?: (id: string) => void;
    playerName?: string;
    roomId?: string;
}