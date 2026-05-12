import { useState } from "react";
import type { IButton } from "../interfaces/components/IButton";

function Button(props: IButton) {
    const { text, color, onClickButtonChildren, usesOn, disable } = props;
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked);
        if (!clicked) {
            onClickButtonChildren(text);
        } else {
            onClickButtonChildren("");
        }
    };

    if (usesOn == "commonGame") {
        if(disable){
            return (
            <>
                <button
                    onClick={() => onClickButtonChildren()}
                    disabled={disable}
                    className={`${color == "salmon" ? "bg-[#FF7E67]" : "bg-[#1E293B]"} w-full h-13 rounded-4xl  ${disable ? 'text-white/50' : 'text-white'} font-semibold text-xl flex items-center justify-center`}>
                    {text}
                </button>
            </>
        );
        }else{
            return (
            <>
                <button
                    onClick={() => onClickButtonChildren()}
                    disabled={disable}
                    className={`${color == "salmon" ? "bg-[#FF7E67]" : "bg-[#1E293B]"} w-full h-13 rounded-4xl text-white font-semibold text-xl flex items-center justify-center`}>
                    {text}
                </button>
            </>
        );
        }
        
    } else {
        return (
            <>
                <button
                    onClick={() => {
                        handleClick();
                    }}
                    className={`${clicked ? "text-white" : "text-white/50"} bg-[#1E293B] shrink-0 w-full h-10 rounded-xl  font-normal text-lg flex items-center justify-start pl-3`}>
                    {text}
                </button>
            </>
        );
    }
}

export default Button;
