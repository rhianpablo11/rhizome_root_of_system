import bg from "../assets/bg.webp";

import LogoType from "../components/logoType";


import CreateRoomComponent from "./createRoomComponent";

function CreateRoom() {
    return (
        <>
            <div
                className="w-full h-dvh flex flex-col items-center overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${bg}")`,
                }}>
                <div className="w-full h-full flex flex-col backdrop-blur-[3px]">
                    <div className="w-full flex items-center justify-center mt-4">
                        <LogoType localOfUse="offlinePage" />
                    </div>
                    <div className="w-full h-full flex mt-30 justify-center">
                        <CreateRoomComponent />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateRoom;
