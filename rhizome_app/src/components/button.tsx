import type { IButton } from "../interfaces/components/IButton";

function Button(props: IButton) {
    const { text, color, onClickButtonChildren } = props;

    return (
        <>
            <button
                onClick={() => onClickButtonChildren()}
                className={`${color == "salmon" ? "bg-[#FF7E67]" : "bg-[#1E293B]"} w-full h-13 rounded-4xl text-white font-semibold text-xl flex items-center justify-center`}>
                {text}
            </button>
        </>
    );
}

export default Button;
