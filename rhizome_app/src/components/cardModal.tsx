import { motion } from "framer-motion";
import cardInfo from "../assets/card_info.png"
import type { ICardModal } from "../interfaces/components/ICardModal";

function CardModal(props: ICardModal) {
    const { title, description, children } = props;

    return (
        <>
            <motion.div
                className="absolute z-1000 inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            />

            <div className="absolute z-1001 flex justify-center items-center w-full h-full px-8 ">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative flex flex-col justify-center items-center w-full max-w-[400px]"
                >
                    <img src={cardInfo} alt=""/>
                    <div className="absolute flex flex-col items-center h-[41%] top-[40%] w-[90%] mx-16 ">
                        <h1 className="text-[#1E293B] font-medium text-2xl [@media(min-width:400px)]:text-4xl pt-5">{title}</h1>
                        <div className="relative px-2 overflow-y-auto h-[75%]">
                            <p className="text-[#1E293B] font-medium text-sm [@media(min-width:400px)]:text-base pt-1">
                                {description}
                            </p>
                        </div>

                    </div>

                    <div className="absolute flex items-center justify-center gap-2 top-[84%] px-4 w-[90%] h-[13.5%]">
                        {children} 
                    </div>
                </motion.div>   
            </div>
        </>
    );
}

export default CardModal;
