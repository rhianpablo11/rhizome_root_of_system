// src/hooks/useGameNetwork.ts
import { useEffect, useRef } from 'react';
import { usePeer } from '../contexts/PeerContext';
import type { GameMessage } from '../interfaces/game/INetwork';

export const useGameNetwork = (onMessageReceived: (msg: GameMessage) => void) => {
    // Puxa as funções da rede e a "última mensagem" recebida
    const { broadcast, isHost, lastMessage } = usePeer();

    // Protege a função de callback para o React não renderizar infinitamente
    const callbackRef = useRef(onMessageReceived);
    useEffect(() => {
        callbackRef.current = onMessageReceived;
    }, [onMessageReceived]);

    // O ouvido biônico! Toda vez que a rede cuspir uma mensagem nova, ele roda a lógica.
    useEffect(() => {
        if (lastMessage) {
            console.log("📥 [Rede Recebeu]:", lastMessage);
            callbackRef.current(lastMessage);
        }
    }, [lastMessage]);

    // Função mastigada pro OnlineGame usar quando alguém apertar um botão
    const sendNetworkMessage = (message: GameMessage) => {
        console.log("📤 [Rede Enviou]:", message);
        broadcast(message);
    };

    return { sendNetworkMessage, isHost };
};