import card from "../assets/card_show_player_function.png";

function RoleReveal() {
    return (
        <div>
            <h1>Teste</h1>
            <div className="w-[360px] h-[540px] rounded-2xl overflow-hidden">
                <img src={card} alt="" className="w-full h-full object-cover"/>
            </div>
        </div>
    );
}

export default RoleReveal;
