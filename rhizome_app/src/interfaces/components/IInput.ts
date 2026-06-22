export interface IInput {
    placeholder: string;
    usesOn: "selectNameOfPlayers" | "getNamePlayer" | "showPlayersConected";
    value?: string;
    onChangeText?: (text: string) => void;
}
