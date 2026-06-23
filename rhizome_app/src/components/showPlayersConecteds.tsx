import { usePeer } from "../contexts/PeerContext";
import type IShowPlayersConected from "../interfaces/components/IShowPlayersConected";
import Button from "./button";
import Input from "./input";
import VotingInfo from "./votingInfo";

function ShowPlayersConected(props: IShowPlayersConected) {
    const { isAdmin, startGame } = props;
    //const playersName = ["Jogador 01", "Jogador 02", "Jogador 03", "Jogador 04", "Jogador 05"];
    const { players, roomId } = usePeer();
    const playersName = players.map(p => p.name);

    return (
        <>
            <div className="w-full flex flex-col mt-2 pb-42 h-full  items-center ">
                <div className="w-full flex pb-1 pt-4 items-center justify-center">
                    <h1 className="text-[#1e293b] font-medium text-xl leading-0">ID da partida:</h1>
                    <h1 className="text-[#1e293b] font-thin text-xl leading-0">{roomId}</h1>
                </div>
                <h1 className="text-[#1e293b] font-medium text-2xl pb-3">Jogadores Conectados</h1>
                <div className="flex flex-col overflow-y-auto gap-y-3">
                    {playersName.map((name, index) => (
                        <Input
                            key={index}
                            usesOn="showPlayersConected"
                            placeholder={`Jogador ${index + 1}`}
                            value={name}
                            onChangeText={() => {}}
                        />
                    ))}
                </div>
                <div className="flex flex-col w-full gap-y-2 fixed bottom-4 left-0 px-10">
                    {isAdmin && (
                        <>
                            <Button
                                usesOn="commonGame"
                                onClickButtonChildren={startGame}
                                color="darkBlue"
                                text="Iniciar o jogo"
                                disable={false}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default ShowPlayersConected;
