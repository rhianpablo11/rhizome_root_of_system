import type { IPlayerData } from "./IShowPlayerFunction";

export interface IChoiceAdvisorForGovernement {
    nameLider: string;
    playersList: IPlayerData[];
    aprovedGroup: (id: string)=> void
    reprovedGroup: ()=> void
}
