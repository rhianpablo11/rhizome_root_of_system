import { useState } from "react";
import bg from "../assets/bg.webp";
import Button from "../components/button";
import GetDataOnlineRoom from "../components/getDataOnlineRoom";
import LogoType from "../components/logoType";
import CreateRoomComponent from "./createRoomComponent";
import { useNavigate } from "react-router";

function InOnTheRoom() {
    const [playerName, setPlayerName] = useState<string>("");
    const [playerNameIsSet, setPlayerNameIsSet] = useState<boolean>(false);
    const [roomID, setRoomID] = useState<string>("");
    const navigate = useNavigate();
    const handleOnClickFatherSetPlayerName = () => {
        if(playerName.trim() === "") return;
        navigate(`/room/${roomID}`);
    };
    return(
        <>
        <div
            className="w-full h-dvh flex flex-col items-center overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url("${bg}")`,
            }}>
                <div className='w-full h-full flex flex-col justify-between backdrop-blur-[3px]'>
                    <div className='w-full flex items-center justify-center mt-4'>
                        <LogoType localOfUse="offlinePage" />
                    </div>
                    <div className='w-full  flex mt-30 justify-center px-4'>
                        <GetDataOnlineRoom useOn="getInRoom" setplayerName={setPlayerName} playerName={playerName} setroomID={setRoomID} roomId={roomID} />
                    </div>
                    <div className='w-full flex flex-col gap-y-3 mb-5 px-6'>
                        <Button
                                text="Continuar"
                                usesOn="commonGame"
                                color="salmon"
                                onClickButtonChildren={() => {
                                    handleOnClickFatherSetPlayerName();
                                }}
                            />
                            <Button
                                text="Cancelar"
                                usesOn="commonGame"
                                color="darkBlue"
                                onClickButtonChildren={() => {
                                    navigate("/");
                                }}
                            />
                    </div>
                </div>
        </div>
        </>
    )
}

export default InOnTheRoom;