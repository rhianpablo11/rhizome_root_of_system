import Button from "./button";
import cardInfo from "../assets/card_info.png"
import type { ICardModal } from "../interfaces/components/ICardModal";

function CardModal(props: ICardModal) {
    const { title, description, children } = props;

    const handleButtonClickFather = () => {
        console.log("clicado");
    };

    return (
        <>
            <div className="absolute z-1000 inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="absolute z-1001 flex justify-center items-center w-full h-full px-8">
                <div className="relative flex flex-col justify-center items-center w-full max-w-[400px]">
                    <img src={cardInfo} alt=""/>
                    <div className="absolute flex flex-col items-center h-[40%] top-[40%] w-[90%] mx-16 ">
                        <h1 className="text-[#1E293B] font-medium text-2xl [@media(min-width:400px)]:text-4xl pt-5">{title}</h1>
                        <p className="text-[#1E293B] font-medium text-sm [@media(min-width:400px)]:text-base pt-1 px-2 overflow-y-auto">{description}</p>
                    </div>

                    <div className="absolute flex items-center justify-center gap-2 top-[83%] px-4 w-[90%] h-[15%]">
                        {children} 
                    </div>
                </div>   
            </div>
        </>
    );
}

export default CardModal;
