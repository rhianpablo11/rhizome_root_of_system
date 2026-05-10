import card from "../assets/card_show_player_function.png";
import Button from "../components/button";

function RoleReveal() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-between py-4">
             <div /> {/* pra o card ficar centralizado verticalmente */}

            <div className=" w-[min(80vw,50vh)] max-h-[960px] rounded-2xl overflow-hidden">
                <img src={card} alt="" className="w-full h-full object-cover"/>
            </div>

            <div className="flex w-full gap-y-2 bottom-4 left-0 px-10">
                <Button 
                    onClickButtonChildren={() => {}}
                    color="salmon"
                    text="Próximo jogador"
                />
            </div>
        </div>
    );
}

export default RoleReveal;
