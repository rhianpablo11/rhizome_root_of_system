import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/button";
import cardBg from "../assets/card_show_player_function.png";
import type { IShowPlayerFunction } from "../interfaces/components/IShowPlayerFunction";

function ShowPlayerFunction(props: IShowPlayerFunction) {
    const { listPlayers } = props;

    // Estado para controlar se a carta já foi arrastada/revelada
    const [isRevealed, setIsRevealed] = useState(false);

    // Variáveis mockadas por enquanto (depois você puxa da lógica do listPlayers)
    const playerName = "Jogador 1";
    const playerRole = "Comunidade";

    const handleOnClickFatherNextPlayer = () => {
        console.log("Indo para o próximo jogador...");
        // Reseta o estado pra carta descer de novo pro próximo jogador
        setIsRevealed(false);
    };

    return (
        <div className="w-full flex flex-col items-center h-full">
            <div className="relative w-full h-112.5 flex justify-center items-center">
                <div className="absolute bottom-0 w-full h-full rounded-xl bg-[#F8FAFC] rounded-b-2xl shadow-xl flex items-end justify-center pb-6 transition-all">
                    <h2 className="text-3xl font-bold text-[#1E293B]">{playerRole}</h2>
                </div>

                <motion.div
                    className="absolute top-0 w-full h-full bg-[#F8FAFC] rounded-xl shadow-2xl flex flex-col items-center bg-cover bg-center cursor-grab active:cursor-grabbing border-4 border-white"
                    style={{ backgroundImage: `url(${cardBg})` }}
                    // CONFIGURAÇÕES DE FÍSICA DO ARRASTE
                    drag="y" // Permite arrastar apenas para cima e para baixo
                    dragConstraints={{ top: -120, bottom: 0 }} // Limita pra não voar da tela
                    dragElastic={0.1} // Dá aquela resistência de "borracha" no final
                    // 🧠 LÓGICA: Se arrastar mais que 50px pra cima, revela a carta
                    onDragEnd={(event, info) => {
                        if (info.offset.y < -50) {
                            setIsRevealed(true);
                        } else if (info.offset.y > -50) {
                            setIsRevealed(false);
                        }
                    }}
                    // 🎬 ANIMAÇÃO: Controla a posição Y baseada no estado isRevealed
                    animate={{ y: isRevealed ? -100 : 0 }}
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
                {/* Dica: Você pode fazer o botão só ficar clicável ou só aparecer SE isRevealed for true */}
                <Button onClickButtonChildren={handleOnClickFatherNextPlayer} color="salmon" text="Próximo jogador" />
            </div>
        </div>
    );
}

export default ShowPlayerFunction;
