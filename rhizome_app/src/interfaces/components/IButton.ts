export interface IButton {
    text: string;
    color?: "salmon" | "darkBlue";
    usesOn: "commonGame" | "selectAdvisor";
    onClickButtonChildren: (name?: string) => void;
    disable?: boolean;
    clicked?: boolean;
}
