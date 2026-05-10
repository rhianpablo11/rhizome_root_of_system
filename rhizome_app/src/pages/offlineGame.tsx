import bg from "../assets/bg.png";
import LogoType from "../components/logoType";
import SelectNameOfPlayers from "./selectNameOfPlayers";

function OfflineGame() {
    // logical of showing components in the offline game page, like the game itself, the choices, etc.
    const componentToShow = () => {
        return (
            <SelectNameOfPlayers />
        )
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
                <div className="flex-1 overflow-hidden pt-4 px-3 w-full flex flex-col">
                    {componentToShow()}
                </div>
            </div>
        </div>
    );
}

export default OfflineGame;
