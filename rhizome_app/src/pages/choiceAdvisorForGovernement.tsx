import { useState } from "react";
import Button from "../components/button";
import type { IChoiceAdvisorForGovernement } from "../interfaces/components/IChoiceAdvisorForGovernement";
import VotingInfo from "../components/votingInfo";

function ChoiceAdvisorForGovernement(props: IChoiceAdvisorForGovernement) {
    const { nameLider, playersList, aprovedGroup, reprovedGroup, onlineGame, playersVoting, advisorName } = props;
    const [buttonsDisable, setButtonsDisable] = useState(true);
    const [nameAdvisorSelected, setNameAdvisorSelected] = useState<string | null>("");
    const justNames: string[] = playersList.map((player) => player.name);

    const advisorSelected = (name?: string) => {
        console.log(name);

        if (name) {
            if (justNames.includes(name)) {
                setButtonsDisable(false);
                setNameAdvisorSelected(name);
            } else {
                setButtonsDisable(true);
            }
        } else {
            setNameAdvisorSelected(null);
            setButtonsDisable(true);
        }
    };

    if (onlineGame == false && playersVoting == false) {
        return (
            <>
                <div className="flex flex-col w-full h-full pb-35 items-center relative">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-[#1F293B] font-semibold text-3xl leading-none">{nameLider} inicia</h1>
                        <h1 className="text-[#1F293B] text-xl leading-none">Escolha o conselheiro</h1>
                    </div>
                    <div className="w-full flex flex-col mt-3 overflow-y-auto gap-y-2">
                        {justNames.map((name, index) => (
                            <Button
                                key={index}
                                text={name}
                                usesOn="selectAdvisor"
                                onClickButtonChildren={advisorSelected}
                                clicked={nameAdvisorSelected == name ? true : false}
                            />
                        ))}
                    </div>
                    <div className="fixed bottom-3 w-full px-8 flex flex-col gap-y-2">
                        {onlineGame ? (
                            <>
                                <Button
                                    disable={buttonsDisable}
                                    text="Confirmar escolha"
                                    color="darkBlue"
                                    onClickButtonChildren={() => {}}
                                    usesOn="commonGame"
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    disable={buttonsDisable}
                                    text="Governo Aprovado"
                                    color="darkBlue"
                                    onClickButtonChildren={() => {
                                        aprovedGroup(nameAdvisorSelected);
                                    }}
                                    usesOn="commonGame"
                                />
                                <Button
                                    disable={buttonsDisable}
                                    text="Governo Reprovado"
                                    color="salmon"
                                    onClickButtonChildren={reprovedGroup}
                                    usesOn="commonGame"
                                />
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    } else if (onlineGame && playersVoting == false) {
        return (
            <>
                <div className="flex flex-col w-full h-full pb-35 items-center relative">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-[#1F293B] font-semibold text-3xl leading-none">{nameLider} inicia</h1>
                        <h1 className="text-[#1F293B] text-xl leading-none">Escolha o conselheiro</h1>
                    </div>
                    <div className="w-full flex flex-col mt-3 overflow-y-auto gap-y-2">
                        {justNames.map((name, index) => (
                            <Button
                                key={index}
                                text={name}
                                usesOn="selectAdvisor"
                                onClickButtonChildren={advisorSelected}
                                clicked={nameAdvisorSelected == name ? true : false}
                            />
                        ))}
                    </div>
                    <div className="fixed bottom-3 w-full px-8 flex flex-col gap-y-2">
                        {onlineGame ? (
                            <>
                                <Button
                                    disable={buttonsDisable}
                                    text="Confirmar escolha"
                                    color="darkBlue"
                                    onClickButtonChildren={()=>{if(aprovedGroup != undefined ){ aprovedGroup(nameAdvisorSelected)}}}
                                    usesOn="commonGame"
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    disable={buttonsDisable}
                                    text="Governo Aprovado"
                                    color="darkBlue"
                                    onClickButtonChildren={() => {
                                        aprovedGroup(nameAdvisorSelected);
                                    }}
                                    usesOn="commonGame"
                                />
                                <Button
                                    disable={buttonsDisable}
                                    text="Governo Reprovado"
                                    color="salmon"
                                    onClickButtonChildren={reprovedGroup}
                                    usesOn="commonGame"
                                />
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    } else if (onlineGame && playersVoting) {
        return (
            <>
                <div className="flex flex-col w-full h-full pb-35 items-center relative">
                    <div className="w-full px-4 flex flex-col items-center justify-center">
                        <VotingInfo />
                        <h1 className="text-[#1F293B] font-semibold text-3xl leading-none">{nameLider} iniciou</h1>
                        <h1 className="text-[#1F293B] text-xl leading-none">Seu conselheiro escolhido foi:</h1>
                    </div>
                    <div className="px-3 w-full flex">
                        <div className="w-full flex flex-col mt-3 justify-center overflow-y-auto gap-y-2 bg-[#1e293b] h-10 rounded-xl ">
                            <h1 className="text-white font-normal text-lg pl-3">{advisorName}</h1>
                        </div>
                    </div>

                    <div className="fixed bottom-3 w-full px-8 flex flex-col gap-y-2">
                        <Button
                            text="Governo Aprovado"
                            color="darkBlue"
                            onClickButtonChildren={() => {
                                aprovedGroup(nameAdvisorSelected);
                            }}
                            usesOn="commonGame"
                        />
                        <Button
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
}

export default ChoiceAdvisorForGovernement;
