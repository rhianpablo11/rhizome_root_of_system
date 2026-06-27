export interface IInput {
    placeholder: string;
    usesOn: "selectNameOfPlayers" | "getNamePlayer" | "showPlayersConected";
    value?: string;
    isUpper?: Boolean;
    maxLength?: number;
    onChangeText?: (text: string) => void;
}
