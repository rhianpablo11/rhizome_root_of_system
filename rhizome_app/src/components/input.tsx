import type { IInput } from "../interfaces/components/IInput";

function Input(props: IInput) {
    const { placeholder, usesOn } =
        props;
    if (
        usesOn == "selectNameOfPlayers"
    ) {
        return (
            <div className="flex w-full items-center justify-center gap-x-3">
                <div className="w-13 h-13 rounded-full bg-[#1E293B] shrink-0 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-7 text-white">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                    </svg>
                </div>
                <input
                    className="w-full h-14 rounded-2xl bg-[#1E293B] text-white px-4 outline-none font-light text-xl placeholder:text-[#64748B]"
                    placeholder={
                        placeholder
                    }
                />
            </div>
        );
    }
}

export default Input;
