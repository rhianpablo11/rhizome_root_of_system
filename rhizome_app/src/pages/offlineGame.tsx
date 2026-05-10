import { useState } from "react";
import bg from "../assets/bg.png";
import LogoType from "../components/logoType";
import SelectNameOfPlayers from "./selectNameOfPlayers";
import ShowPlayerFunction from "./showPlayerFunction";

function OfflineGame() {
    const [stateOfGame, setStateOfGame] = useState<"selectPlayers" | "showFunctionPlayers">("showFunctionPlayers");
    // logical of showing components in the offline game page, like the game itself, the choices, etc.
    const componentToShow = () => {
        if (stateOfGame == "selectPlayers") {
            return <SelectNameOfPlayers />;
        } else if (stateOfGame == "showFunctionPlayers") {
            return <ShowPlayerFunction />;
        }
    };

    return (
        <div
            className="w-full h-dvh overflow-hidden bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url("${bg}")`,
            }}>
            <div className="w-full h-full flex flex-col backdrop-blur-[3px]">
                <div className="shrink-0">
                    <LogoType localOfUse="offlinePage" />
                </div>
                <div className="flex-1 overflow-hidden pt-4 px-4 w-full flex flex-col">{componentToShow()}</div>
            </div>
        </div>
    );
}

export default OfflineGame;
