export default interface ICardsData {
    id: string;
    title: string;
    description: string;
    type: "COMUNIDADE" | "LOBBY" | string;
    categorie: string;
    region: string;
}
