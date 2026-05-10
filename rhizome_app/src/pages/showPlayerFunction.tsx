import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/button";
import cardBg from "../assets/card_show_player_function.png";
import type { IShowPlayerFunction } from "../interfaces/components/IShowPlayerFunction";

function ShowPlayerFunction(props: IShowPlayerFunction) {
    const { listPlayers, onFinish } = props;

    const [isRevealed, setIsRevealed] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentPlayer = listPlayers[currentIndex];
    const playerName = currentPlayer.name;
    const playerRoleText = currentPlayer.playerRole == "community" ? "Comunidade" : "Lobby";
    const lobbyAllies = listPlayers
        .filter((player) => player.playerRole == "lobby" && player.name != currentPlayer.name)
        .map((player) => player.name);

    const handleOnClickFatherNextPlayer = () => {
        console.log("Indo para o próximo jogador...");
        setIsRevealed(false);
        if (currentIndex < listPlayers.length - 1) {
            setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 300);
        } else {
            setTimeout(() => {
                onFinish();
            }, 300);
        }
    };

    return (
        <div className="w-full flex flex-col items-center h-full">
            <div className="relative w-full h-112.5 flex justify-center items-center">
                <div className="absolute bottom-0 w-full h-full rounded-xl bg-[#F8FAFC] rounded-b-2xl shadow-xl flex flex-col items-center px-3 justify-end pb-2 transition-all">
                    <h2 className="text-3xl font-bold text-[#1E293B]">{playerRoleText}</h2>
                    {isRevealed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-center px-4">
                            {currentPlayer.playerRole === "lobby" ? (
                                <>
                                    <p className="text-sm font-bold text-[#E05A3D] uppercase tracking-wider mt-1">
                                        Seus Aliados:
                                    </p>
                                    <p className="text-md font-medium text-[#64748B]">
                                        {lobbyAllies.length > 0 ? lobbyAllies.join(", ") : "Você está sozinho."}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-[#78C6A3] uppercase tracking-wider mb-1">
                                        Seu Objetivo:
                                    </p>
                                    <p className="text-md font-medium text-[#64748B]">
                                        Descubra o Lobby e proteja o projeto.
                                    </p>
                                </>
                            )}
                        </motion.div>
                    )}
                </div>

                <motion.div
                    className="absolute top-0 w-full h-full bg-[#F8FAFC] rounded-xl shadow-2xl flex flex-col items-center bg-cover bg-center cursor-grab active:cursor-grabbing border-4 border-white"
                    style={{ backgroundImage: `url(${cardBg})` }}
                    // CONFIGURAÇÕES DE FÍSICA DO ARRASTE
                    drag="y" // Permite arrastar apenas para cima e para baixo
                    dragConstraints={{ top: -150, bottom: 0 }} // Limita pra não voar da tela
                    dragElastic={0.1} // Dá aquela resistência de "borracha" no final
                    // LÓGICA: Se arrastar mais que 50px pra cima, revela a carta
                    onDragEnd={(event, info) => {
                        if (info.offset.y < -50) {
                            setIsRevealed(true);
                        }
                    }}
                    // ANIMAÇÃO: Controla a posição Y baseada no estado isRevealed
                    animate={{ y: isRevealed ? -150 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    {/* Nome do Jogador escrito em cima do background */}
                    <h1 className="text-3xl font-bold text-[#1E293B] mt-16 z-10">{playerName}</h1>

                    {!isRevealed && (
                        <div className="absolute -bottom-1 flex flex-col items-center text-[#78C6A3] animate-bounce pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[#1E293B]">
                                Deslize
                            </span>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="w-full px-10 fixed bottom-8">
                {isRevealed && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Button
                            onClickButtonChildren={handleOnClickFatherNextPlayer}
                            color="salmon"
                            text={currentIndex === listPlayers.length - 1 ? "Iniciar Batalha" : "Próximo jogador"}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default ShowPlayerFunction;
