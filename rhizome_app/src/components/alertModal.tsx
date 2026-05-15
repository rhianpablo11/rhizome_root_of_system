import type { IAlertModal } from "../interfaces/components/IAlertModal";
import Button from "./button";

function AlertModal(props: IAlertModal) {
    const { text, onSkip, buttonText } = props;

    const handleButtonClickFather = () => {
        console.log("clicado");
        onSkip();
    };

    return (
        <>
            <div className="bg-[#F6F7EF] flex flex-col w-full rounded-3xl justify-center items-center shadow-2xl ">
                <h1 className="text-[#1E293B] font-semibold text-4xl pt-5">Alerta</h1>
                <h1 className="text-[#1E293B] font-medium text-xl pt-1 px-5">{text}</h1>
                <div className="pb-5 w-full px-11 pt-4">
                    <Button
                        usesOn="commonGame"
                        text={buttonText}
                        color={"darkBlue"}
                        onClickButtonChildren={handleButtonClickFather}
                    />
                </div>
            </div>
        </>
    );
}

export default AlertModal;
