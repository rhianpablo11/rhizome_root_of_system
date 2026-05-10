import { Outlet } from "react-router";
import bg from "../../assets/bg.png";
import LogoType from "../../components/logoType";

function BaseLayout() {
    return (
        <>
            <div
                className="w-full h-dvh overflow-hidden bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url("${bg}")`,
                }}>
                <div className="w-full h-full flex flex-col backdrop-blur-[3px]">
                    <div className="shrink-0">
                        <LogoType localOfUse="offlinePage" />
                    </div>
                    <Outlet />
                </div>
            </div>
        </>

    );
}

export default BaseLayout;
