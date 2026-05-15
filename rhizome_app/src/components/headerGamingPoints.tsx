import type { IHeaderGamingPoints } from "../interfaces/components/IHeaderGamingPoints";
import LogoType from "./logoType";

function HeaderGamingPoints(props: IHeaderGamingPoints) {
    const { pointsCommunity, pointsLobby, idSession } = props;

    const renderDots = (points: number, team: "community" | "lobby") => {
        return Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index < points;

            const fillColor = isFilled ? (team === "community" ? "bg-[#1E293B]" : "bg-[#1E293B]") : "";

            return (
                <div
                    key={index}
                    className={`w-3.5 h-3.5 border-2 border-[#1E293B] rounded-full ${fillColor} transition-colors duration-300`}></div>
            );
        });
    };

    return (
        <>
            <div className="flex flex-col w-full items-center justify-center pb-1">
                <LogoType localOfUse="headerGamingRunning" />
                <div className="flex items-center justify-baseline">
                    <h1 className="text-[#1E293B] text-lg font-normal leading-none">Partida -</h1>
                    <h1 className="text-[#1E293B] text-sm font-extralight pl-1 leading-none">{idSession}</h1>
                </div>
                <div className="flex">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="font-medium text-xl text-[#1E293B] leading-none pb-1">Comunidade</h1>
                        <div className="flex gap-x-2">{renderDots(pointsCommunity, "community")}</div>
                    </div>
                    <h1 className="font-medium text-xl text-[#1E293B] px-4 leading-none">x</h1>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="font-medium text-xl text-[#1E293B] leading-none pb-1">Lobbystas</h1>
                        <div className="flex gap-x-2">{renderDots(pointsLobby, "lobby")}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeaderGamingPoints;
