export type MessageType = 
 | 'START_GAME' //fala para os outros players as suas funções e inicia o game
 | 'LEADER_CHOICE_ADVISOR' //permite o leader escolher quem será o seu conselheiro
 | 'SHOW_PLAYER_FUNCTION' //apresenta para o player sua função no jogo
 | 'VOTING_ON_GOVERNMENT' //para que os jogadores possam votar naquele governo
 | 'ALERT_REPROVED_3_GOVERNMENT'
 | 'LEADER_CHOICE_CARD'
 | 'ADVISOR_CHOICE_CARD'
 | 'SHOW_CHAOS_CARD'
 | 'LEADER_DEFENSE'
 | 'ADVISOR_DEFENSE'
 | 'PLENARY_DEFENSE'
 | 'WAITING_FOR_GOVERNMENT_ACTION' //fica esperando a proxima ação q ele possa fazer;


export interface GameMessage{
    type: MessageType;
    payload?: any;
    senderId?: string;
}