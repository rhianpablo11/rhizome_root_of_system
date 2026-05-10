import Input from "../components/input";

function SelectNameOfPlayers() {
    return (
        <div className="flex flex-col gap-y-3">
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
    );
}

export default SelectNameOfPlayers;
