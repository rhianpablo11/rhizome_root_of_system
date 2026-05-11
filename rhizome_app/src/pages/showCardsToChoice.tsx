import { useState } from "react";
import { motion } from "framer-motion";
import type { IShowCardsToChoice } from "../interfaces/components/IShowCardsToChoice";
import BackOfCard from "../components/backOfCard";

function ShowCardsToChoice(props: IShowCardsToChoice) {
    const { nameLider, nameAdvisor, showToLider, cardsId } = props;

    // Estado para rastrear o ID da carta que o jogador clicou
    const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

    const displayName = showToLider ? nameLider : nameAdvisor;
    const totalCards = cardsId.length;

    // Lógica Matemática: Calcula a posição e o ângulo de cada carta para formar um Leque
    const getCardTransform = (index: number) => {
        if (totalCards === 3) {
            if (index === 0) return { rotate: -15, x: -60, y: 20, zIndex: 10 };
            if (index === 1) return { rotate: 0, x: 0, y: 0, zIndex: 20 };
            if (index === 2) return { rotate: 15, x: 60, y: 20, zIndex: 10 };
        }
        if (totalCards === 2) {
            if (index === 0) return { rotate: -10, x: -40, y: 10, zIndex: 10 };
            if (index === 1) return { rotate: 10, x: 40, y: 10, zIndex: 10 };
        }
        // Fallback pra caso venha só 1 carta
        return { rotate: 0, x: 0, y: 0, zIndex: 10 };
    };

    const handleCardClick = (id: string) => {
        // Bloqueia o clique se alguma carta já estiver virada
        if (!flippedCardId) {
            setFlippedCardId(id);
            console.log(`Roteamento: A carta selecionada foi a de ID -> ${id}`);
        }
    };

    return (
        <div className="w-full flex flex-col h-full pb-15 relative">
            <div className="w-full h-full bg-[#F6F7EF] rounded-3xl  shadow-2xl flex items-start pt-6 justify-center relative perspective-[1000px]">
                {cardsId.map((id, index) => {
                    const isFlipped = flippedCardId === id;
                    const isNotSelected = flippedCardId !== null && flippedCardId !== id;
                    const transform = getCardTransform(index);

                    return (
                        <motion.div
                            key={id}
                            // 1. ANIMAÇÃO DE ENTRADA: Cartas vêm lá de baixo
                            initial={{ opacity: 0, y: 300, rotate: 0 }}
                            // 2. LÓGICA DE MOVIMENTO: Decide se vai pro leque ou pro meio
                            animate={{
                                opacity: isNotSelected ? 0 : 1, // Some com as outras
                                y: isFlipped ? 0 : transform.y,
                                x: isFlipped ? 0 : transform.x,
                                rotate: isFlipped ? 0 : transform.rotate,
                                rotateY: isFlipped ? 180 : 0, // O Giro 3D da virada!
                                zIndex: isFlipped ? 50 : transform.zIndex,
                                scale: isFlipped ? 1.4 : 1, // Dá um zoom na carta escolhida
                            }}
                            // 3. FÍSICA: O delay index * 0.15 cria o efeito de escadinha na entrada
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: flippedCardId ? 0 : index * 0.5,
                            }}
                            onClick={() => handleCardClick(id)}
                            className="absolute w-42 h-60 cursor-pointer"
                            // preserve-3d faz a frente e as costas da carta existirem no mesmo espaço 3D
                            style={{ transformStyle: "preserve-3d" }}>
                            {/* ====== COSTAS DA CARTA (O que o jogador vê primeiro) ====== */}
                            <BackOfCard />

                            {/* ====== FRENTE DA CARTA (A Div Genérica da Proposta) ====== */}
                            <div
                                className="absolute w-full h-full rounded-2xl bg-[#F8FAFC] shadow-2xl flex flex-col items-center justify-center p-4 border-4 border-[#78C6A3]"
                                style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)", // Já fica virada de costas esperando o giro do pai
                                }}>
                                <h2 className="text-[#1E293B] font-bold text-center text-xl">Projeto Revelado</h2>
                                <p className="text-xs text-[#64748B] text-center mt-4 font-medium">
                                    ID Capturado:
                                    <br /> {id}
                                </p>
                                <p className="text-[10px] text-[#A9BCCD] text-center mt-6 uppercase tracking-widest">
                                    Componente da
                                    <br />
                                    frente entra aqui
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="fixed bottom-20 pr-10 px-3 flex justify-center items-center w-full">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-[#1E293B] font-semibold text-2xl text-center">
                    {flippedCardId
                        ? "Selecione uma opção para ser realizada"
                        : `${displayName}, clique em uma carta para ver as opções`}
                </motion.h1>
            </div>
        </div>
    );
}

export default ShowCardsToChoice;
