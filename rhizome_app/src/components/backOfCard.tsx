import backOfCard from "../assets/bg_back_card.png";

function BackOfCard() {
    return (
        <>
            <div
                className="absolute w-full h-full rounded-2xl bg-cover bg-center bg-no-repeat shadow-white/20 shadow-2xl"
                style={{
                    backgroundImage: `url("${backOfCard}")`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden", // Essencial pro iOS/Safari
                }}></div>
        </>
    );
}

export default BackOfCard;
