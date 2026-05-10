export interface ICard {
    id: string;
    title: string;
    description: string;
    type: "COMUNIDADE" | "LOBBY";
    category: string;
    region: string;
}
