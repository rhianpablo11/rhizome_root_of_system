import { useEffect, useRef } from 'react';
import { usePeer } from '../contexts/PeerContext';
import type { GameMessage } from '../interfaces/game/INetwork';


export const useGameNetwork = (onMessageReceived: (msg: GameMessage) => void) => {
    // Puxa as armas do contexto (seja você Host ou Cliente)
    const { broadcast, peer, isHost } = usePeer();

    // 💡 O PULO DO GATO (useRef): 
    // Guarda a função do OnlineGame numa referência para o React não bugar 
    // e recriar o listener toda vez que uma tela mudar.
    const callbackRef = useRef(onMessageReceived);
    useEffect(() => {
        callbackRef.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        if (!peer) return;

        // O que fazer quando uma mensagem chegar pela rede:
        const handleData = (data: any) => {
            const message = data as GameMessage;
            console.log("📥 Mensagem recebida da rede:", message);
            
            // O Hook não muda a tela. Ele chama a função do OnlineGame!
            callbackRef.current(message); 
        };

        // Atrela o ouvidor (listener) nas conexões do PeerJS
        peer.on('connection', (conn) => {
            conn.on('data', handleData);
        });

        // Limpeza quando o componente morrer
        return () => {
            peer.removeAllListeners('connection');
        };
    }, [peer]);

    // O Hook expõe para o OnlineGame formas fáceis de enviar mensagens
    const sendNetworkMessage = (message: GameMessage) => {
        console.log("📤 Enviando mensagem:", message);
        broadcast(message);
    };

    return { sendNetworkMessage, isHost };
};