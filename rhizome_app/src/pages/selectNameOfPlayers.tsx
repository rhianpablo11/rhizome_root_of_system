import { useState } from "react";
import Button from "../components/button";
import Input from "../components/input";

function SelectNameOfPlayers() {
    const [playersName, setPlayersName] = useState<string[]>(["", "", "", "", ""]);

    const handleOnClickFatherAddPlayer = () => {
        setPlayersName([...playersName, ""]);
    };

    const handleOnClickFatherStartGame = () => {
        console.log("2");
    };

    const handleUpdatePlayerName = (index: number, newName: string) => {
        const newPlayers = [...playersName];
        newPlayers[index] = newName;
        setPlayersName(newPlayers);
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
                    onClickButtonChildren={handleOnClickFatherAddPlayer}
                    color="darkBlue"
                    text="Adicionar Jogador"
                />
                <Button onClickButtonChildren={handleOnClickFatherStartGame} color="salmon" text="Iniciar Batalha" />
            </div>
        </div>
    );
}

export default SelectNameOfPlayers;
