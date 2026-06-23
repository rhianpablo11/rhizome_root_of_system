export type MessageType = 
 | "SUBMIT_VOTE"
 | 'CHANGE_SCREEN'
 | 'UPDATE_GAME_STATE'
 | 'ASSIGN_ROLE'
 | 'START_GAME';


export interface GameMessage{
    type: MessageType;
    payload?: any;
    senderId?: string;
}