import Button from "../components/button";
import type { IChoiceAdvisorForGovernement } from "../interfaces/components/IChoiceAdvisorForGovernement";

function ChoiceAdvisorForGovernement(props: IChoiceAdvisorForGovernement) {
    const { nameLider, playersList } = props;

    const aprovedGroup = () => {
        console.log("");
    };

    const reprovedGroup = () => {
        console.log("");
    };

    return (
        <>
            <div className="flex flex-col w-full h-full items-center">
                <div className="">
                    <h1 className="text-[#1F293B] font-semibold text-3xl">{nameLider} inicia</h1>
                    <h1 className="text-[#1F293B] text-2xl">Escolha o conselheiro</h1>
                </div>
                <div></div>
                <div className="fixed bottom-3 w-full px-8 flex flex-col gap-y-2">
                    <Button text="Governo Aprovado" color="darkBlue" onClickButtonChildren={aprovedGroup} />
                    <Button text="Governo Reprovado" color="salmon" onClickButtonChildren={reprovedGroup} />
                </div>
            </div>
        </>
    );
}

export default ChoiceAdvisorForGovernement;
