import Button from "./button";
import cardInfo from "../assets/card_info.png"
import type { ICardModal } from "../interfaces/components/ICardModal";

function CardModal(props: ICardModal) {
    const { title, description, children } = props;

    return (
        <>
            <div className="absolute z-1000 inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="absolute z-1001 flex justify-center items-center w-full h-full px-4">
                <div className="relative flex flex-col justify-center items-center w-full max-w-100">
                    <img src={cardInfo} alt=""/>
                    <div className="absolute flex flex-col items-center h-[56%] top-[26%] w-[90%] mx-16 ">
                        <h1 className="text-[#1E293B] font-semibold text-2xl text-center leading-none [@media(min-width:400px)]:text-4xl pt-5">{title}</h1>
                        <div className="relative px-2 overflow-y-auto h-[90%] pt-1">
                            <p className="text-[#1E293B] text-justify leading-5 font-medium text-base [@media(min-width:400px)]:text-base pt-1">
                                {description}
                            </p>
                        </div>

                    </div>

                    <div className="absolute flex items-center justify-center gap-x-2 top-[84%]  px-1  w-[90%] h-[13.5%]">
                        {children} 
                    </div>
                </div>   
            </div>
        </>
    );
}

export default CardModal;
