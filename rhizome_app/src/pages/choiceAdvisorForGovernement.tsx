import { useEffect, useState } from "react";
import Button from "../components/button";
import type { IChoiceAdvisorForGovernement } from "../interfaces/components/IChoiceAdvisorForGovernement";

function ChoiceAdvisorForGovernement(props: IChoiceAdvisorForGovernement) {
    const { nameLider, playersList } = props;
    const [buttonsDisable, setButtonsDisable] = useState(true);

    const justNames: string[] = playersList.map((player) => player.name);
    const aprovedGroup = () => {
        console.log("");
    };

    const reprovedGroup = () => {
        console.log("");
    };

    const advisorSelected = (name?: string) => {
        console.log(name);
        if (name) {
            if (justNames.includes(name)) {
                setButtonsDisable(false);
            } else {
                setButtonsDisable(true);
            }
        } else {
            setButtonsDisable(true);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full h-full pb-35 items-center relative">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-[#1F293B] font-semibold text-3xl leading-none">{nameLider} inicia</h1>
                    <h1 className="text-[#1F293B] text-xl leading-none">Escolha o conselheiro</h1>
                </div>
                <div className="w-full flex flex-col mt-3 overflow-y-auto gap-y-2">
                    {justNames.map((name, index) => (
                        <Button text={name} usesOn="selectAdvisor" onClickButtonChildren={advisorSelected} />
                    ))}
                </div>
                <div className="fixed bottom-3 w-full px-8 flex flex-col gap-y-2">
                    <Button
                        disable={buttonsDisable}
                        text="Governo Aprovado"
                        color="darkBlue"
                        onClickButtonChildren={aprovedGroup}
                        usesOn="commonGame"
                    />
                    <Button
                        disable={buttonsDisable}
                        text="Governo Reprovado"
                        color="salmon"
                        onClickButtonChildren={reprovedGroup}
                        usesOn="commonGame"
                    />
                </div>
            </div>
        </>
    );
}

export default ChoiceAdvisorForGovernement;
