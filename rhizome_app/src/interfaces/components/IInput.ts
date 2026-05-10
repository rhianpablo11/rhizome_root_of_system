export interface IInput {
    placeholder: string;
    usesOn: "selectNameOfPlayers";
    value?: string;
    onChangeText?: (text: string) => void;
}
