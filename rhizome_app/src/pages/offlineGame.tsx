import { useState } from "react";
import bg from "../assets/bg.png";
import LogoType from "../components/logoType";
import SelectNameOfPlayers from "./selectNameOfPlayers";
import ShowPlayerFunction from "./showPlayerFunction";
import HeaderGamingPoints from "../components/headerGamingPoints";

function OfflineGame() {
    const [stateOfGame, setStateOfGame] = useState<"selectPlayers" | "showFunctionPlayers">("showFunctionPlayers");

    const listPlayersMock = [
        {
            name: "Rhian Pablo",
            playerRole: "community",
        },
        {
            name: "marcio Roberto",
            playerRole: "lobby",
        },
        {
            name: "Gabriel Santos",
            playerRole: "community",
        },
        {
            name: "Viviane",
            playerRole: "lobby",
        },
        {
            name: "Pedro Joaquim",
            playerRole: "community",
        },
        {
            name: "Pedro Ricardo",
            playerRole: "lobby",
        },
        {
            name: "Roberto Fernandez",
            playerRole: "lobby",
        },
        {
            name: "Julio Balestrin",
            playerRole: "community",
        },
        {
            name: "Renato Cariani",
            playerRole: "lobby",
        },
        {
            name: "Igor Fina",
            playerRole: "lobby",
        },
    ];

    const handleOnFinishPlayersSeeYoursFunctions = () => {
        console.log("ola terminei");
    };

    // logical of showing components in the offline game page, like the game itself, the choices, etc.
    const componentToShow = () => {
        if (stateOfGame == "selectPlayers") {
            return <SelectNameOfPlayers />;
        } else if (stateOfGame == "showFunctionPlayers") {
            return (
                <ShowPlayerFunction listPlayers={listPlayersMock} onFinish={handleOnFinishPlayersSeeYoursFunctions} />
            );
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
                    {/* <LogoType localOfUse="offlinePage" />  */}
                    <HeaderGamingPoints pointsCommunity={1} pointsLobby={5} idSession="920x" />
                </div>
                <div className="flex-1 overflow-hidden pt-5 px-4 w-full flex flex-col">{componentToShow()}</div>
            </div>
        </div>
    );
}

export default OfflineGame;
