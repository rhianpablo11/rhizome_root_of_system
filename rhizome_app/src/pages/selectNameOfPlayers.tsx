import { useState } from "react";
import Button from "../components/button";
import Input from "../components/input";
import type { ISelectNameOfPlayers } from "../interfaces/components/ISelectNameOfPlayers";

function SelectNameOfPlayers(props: ISelectNameOfPlayers) {
    const { playersNameSet, startGame } = props;
    const [playersName, setPlayersName] = useState<string[]>(["", "", "", "", ""]);

    const handleOnClickFatherAddPlayer = () => {
        setPlayersName([...playersName, ""]);
    };

    const handleOnClickFatherStartGame = () => {
        startGame();
    };

    const handleUpdatePlayerName = (index: number, newName: string) => {
        const newPlayers = [...playersName];
        newPlayers[index] = newName;
        setPlayersName(newPlayers);
        playersNameSet(newPlayers);
    };

    return (
        <div className="w-full flex flex-col mt-7 pb-42 h-full relative">
            <div className="flex flex-col overflow-y-auto gap-y-3">
                {playersName.map((name, index) => (
                    <Input
                        key={index}
                        usesOn="selectNameOfPlayers"
                        placeholder={`Jogador ${index + 1}`}
                        value={name}
                        onChangeText={(text) => handleUpdatePlayerName(index, text)}
                    />
                ))}
            </div>
            <div className="flex flex-col w-full gap-y-2 fixed bottom-4 left-0 px-10">
                <Button
                    usesOn="commonGame"
                    onClickButtonChildren={handleOnClickFatherAddPlayer}
                    color="darkBlue"
                    text="Adicionar Jogador"
                />
                <Button
                    usesOn="commonGame"
                    onClickButtonChildren={handleOnClickFatherStartGame}
                    color="salmon"
                    text="Iniciar Batalha"
                />
            </div>
        </div>
    );
}

export default SelectNameOfPlayers;
