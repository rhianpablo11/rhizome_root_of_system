import { useState } from "react";
import Button from "../components/button";
import GetDataOnlineRoom from "../components/getDataOnlineRoom";

import { useNavigate } from "react-router";
import { usePeer } from "../contexts/PeerContext";

function CreateRoomComponent() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState<string>("sfasa");
    const [playerNameIsSet, setPlayerNameIsSet] = useState<boolean>(false);
    const [roomID, setRoomID] = useState<string>("safsfa");
    const { createRoom } = usePeer();
    const handleOnClickFatherSetPlayerName = async () => {
        if (playerName.trim() === "") return;
        try {
            setPlayerNameIsSet(true)
            
            const realRoomId = await createRoom(playerName);
            setRoomID(realRoomId)
            navigate(`/room/${realRoomId}`);
        } catch (error) {
            console.log(error)
            alert("Erro de conexão ao criar a sala.");
        }
        
    };

    return (
        <>
            <div>
                <div className="px-4 w-full h-full items-center justify-center">
                    {playerNameIsSet ? (
                        <GetDataOnlineRoom useOn="showIdOfRoom" roomId={roomID} />
                    ) : (
                        <GetDataOnlineRoom
                            useOn="getNamePlayer"
                            setplayerName={setPlayerName}
                            playerName={playerName}
                        />
                    )}
                </div>
                <div className="w-full px-10 gap-y-2 flex flex-col fixed bottom-4">
                    {!playerNameIsSet ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Button
                                text="Cancelar"
                                usesOn="commonGame"
                                color="darkBlue"
                                onClickButtonChildren={() => {
                                    navigate("/");
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default CreateRoomComponent;
