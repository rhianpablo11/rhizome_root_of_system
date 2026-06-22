import Button from "./button"
import Input from "./input"
import VotingInfo from "./votingInfo";


function ShowPlayersConected(){
    const playersName = ["Jogador 01", "Jogador 02", "Jogador 03", "Jogador 04", "Jogador 05"];
    return(
        <>
            <div className="w-full flex flex-col mt-2 pb-42 h-full relative items-center justify-center">
                <VotingInfo />
                <div className='w-full flex m-0 pb-1 items-center justify-center'>
                    <h1 className='text-[#1e293b] font-medium text-xl leading-0'>
                        ID da partida:
                    </h1>
                    <h1 className='text-[#1e293b] font-thin text-xl leading-0'>
                        ux901i
                    </h1>
                </div>
                <h1 className='text-[#1e293b] font-medium text-2xl pb-3'>
                    Jogadores Conectados
                </h1>
                <div className="flex flex-col overflow-y-auto gap-y-3">
                    {playersName.map((name, index) => (
                        <Input
                            key={index}
                            usesOn="showPlayersConected"
                            placeholder={`Jogador ${index + 1}`}
                            value={name}
                            onChangeText={()=>{}}
                        />
                    ))}
                </div>
                <div className="flex flex-col w-full gap-y-2 fixed bottom-4 left-0 px-10">
                    <Button
                        usesOn="commonGame"
                        onClickButtonChildren={()=>{}}
                        color="darkBlue"
                        text="Adicionar Jogador"
                        disable={false}
                    />
                    
                </div>
            </div>
        </>
    )
}

export default ShowPlayersConected