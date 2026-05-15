export interface IShowCardsToChoice {
    nameLider: string;
    nameAdvisor: string;
    showToLider: boolean; //false is for show to Advisor
    cardsId: string[];
    onLiderVoted?: (remainingCards: string[]) => void;
    onAdvisorVoted?: (approvedCardId: string) => void;
    state: "defense" | "confirm";
}
