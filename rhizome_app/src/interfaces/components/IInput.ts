export interface IInput {
    placeholder: string;
    usesOn: "selectNameOfPlayers" | "getNamePlayer" | "showPlayersConected";
    value?: string;
    isUpper?: Boolean;
    onChangeText?: (text: string) => void;
}
