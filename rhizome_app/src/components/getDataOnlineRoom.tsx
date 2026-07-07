import type { IGetDataOnlineRoom } from "../interfaces/components/IGetDataOnlineRoom";
import Input from "./input";

function GetDataOnlineRoom(props: IGetDataOnlineRoom) {
    const { useOn, setplayerName, setroomID, playerName, roomId } = props;

    if (useOn == "getNamePlayer") {
        return (
            <>
                <div className="bg-[#F6F7EF] flex flex-col w-full rounded-3xl justify-center items-center shadow-2xl ">
                    <h1 className="text-[#1E293B] font-semibold text-3xl pt-5">Insira seu nome:</h1>
                    <div className="pb-3 w-full px-5 pt-4">
                        <Input
                            value={playerName}
                            onChangeText={setplayerName}
                            usesOn="getNamePlayer"
                            placeholder="Jogador 01"
                            maxLength={15}
                        />
                    </div>
                    <h1 className="text-[#1E293B] font-medium text-xl text-center px-4 pb-4">
                        Seu nome será visivel para os outros jogadores.
                    </h1>
                </div>
            </>
        );
    } else if (useOn == "showIdOfRoom") {
        return (
            <>
                <div className="bg-[#F6F7EF] flex flex-col w-full rounded-3xl justify-center items-center shadow-2xl ">
                    <h1 className="text-[#1E293B] font-semibold text-3xl pt-5">O ID da partida é:</h1>
                    <h1 className="text-[#1E293B] font-thin pt-2 text-5xl text-center">{roomId}</h1>
                    <h1 className="text-[#1E293B] font-medium text-base text-center px-8 pt-4 leading-4">
                        Compartilhe com seus amigos para entrar na sessão
                    </h1>
                    <h1 className="text-[#1E293B] font-light text-sm text-center px-6 pb-2 pt-2 leading-4">
                        Assim que um jogador se conectar a gente avança para ver os outros.
                    </h1>
                </div>
            </>
        );
    } else if (useOn == "getInRoom") {
        return (
            <>
                <div className="bg-[#F6F7EF] flex flex-col w-full rounded-3xl justify-center items-center shadow-2xl ">
                    <h1 className="text-[#1E293B] font-semibold text-2xl pt-5">Insira o ID da partida:</h1>
                    <div className="pb-1 w-full px-5 pt-2">
                        <Input value={roomId} 
                        onChangeText={setroomID}
                        usesOn="getNamePlayer" 
                        placeholder="ux901i" 
                        isUpper={true} 
                        maxLength={4} />
                    </div>
                    <h1 className="text-[#1E293B] font-semibold text-2xl ">Insira seu nome:</h1>
                    <div className="pb-4 w-full px-5 pt-2">
                        <Input
                            value={playerName}
                            onChangeText={setplayerName}
                            usesOn="getNamePlayer"
                            placeholder="ux901i"
                            maxLength={15}
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default GetDataOnlineRoom;
