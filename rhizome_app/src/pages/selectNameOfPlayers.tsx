import Button from "../components/button";
import Input from "../components/input";

function SelectNameOfPlayers() {
    return (
        <div className="w-full flex flex-col  mt-7">
            <div className="flex flex-col overflow-y-auto gap-y-3">
                <Input
                    usesOn="selectNameOfPlayers"
                    placeholder="Jogador 1"
                />
                <Input
                    usesOn="selectNameOfPlayers"
                    placeholder="Jogador 2"
                />
                <Input
                    usesOn="selectNameOfPlayers"
                    placeholder="Jogador 3"
                />
                <Input
                    usesOn="selectNameOfPlayers"
                    placeholder="Jogador 4"
                />
                <Input
                    usesOn="selectNameOfPlayers"
                    placeholder="Jogador 5"
                />
                
            </div>
            <div className="flex flex-col w-full gap-y-2 fixed bottom-4 left-0 px-5">
                <Button color="darkBlue" text="Adicionar Jogador" />
                <Button color="salmon" text="Iniciar Batalha" />
            </div>
        </div>
    );
}

export default SelectNameOfPlayers;
