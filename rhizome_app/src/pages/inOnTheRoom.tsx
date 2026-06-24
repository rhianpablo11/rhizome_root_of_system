import { useState } from "react";
import bg from "../assets/bg.webp";
import Button from "../components/button";
import GetDataOnlineRoom from "../components/getDataOnlineRoom";
import LogoType from "../components/logoType";
import { useNavigate } from "react-router";
import { usePeer } from "../contexts/PeerContext";

function InOnTheRoom() {
    const [playerName, setPlayerName] = useState<string>("");
    const [roomID, setRoomID] = useState<string>("");
    const navigate = useNavigate();
    const { joinRoom } = usePeer();

    // Transformamos a função em async para esperar o PeerJS conectar
    const handleOnClickFatherSetPlayerName = async () => {
        // Trava se o cara não preencher os dois campos
        if (playerName.trim() === "" || roomID.trim() === "") {
            alert("Preencha o seu nome e o código da sala!");
            return;
        }

        try {
            console.log(`⏳ Tentando conectar na sala ${roomID}...`);
            
            // Dispara o pedido de conexão P2P passando o código da sala e o nome
            await joinRoom(roomID, playerName);
            
            console.log("✅ Conectado com sucesso na sala!");
            // Se a promessa resolver (conectar), ele navega pra sala!
            navigate(`/room/${roomID}`);
            
        } catch (error) {
            console.error("🚨 ERRO AO ENTRAR NA SALA:", error);
            alert("Falha ao entrar! Verifique se o código da sala está correto e se o Host ainda está conectado.");
        }
    };
    return (
        <>
            <div
                className="w-full h-dvh flex flex-col items-center overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${bg}")`,
                }}>
                <div className="w-full h-full flex flex-col justify-between backdrop-blur-[3px]">
                    <div className="w-full flex items-center justify-center mt-4">
                        <LogoType localOfUse="offlinePage" />
                    </div>
                    <div className="w-full  flex mt-30 justify-center px-4">
                        <GetDataOnlineRoom
                            useOn="getInRoom"
                            setplayerName={setPlayerName}
                            playerName={playerName}
                            setroomID={setRoomID}
                            roomId={roomID}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-y-3 mb-5 px-6">
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
    );
}

export default InOnTheRoom;
