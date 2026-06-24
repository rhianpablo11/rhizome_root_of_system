// src/contexts/PeerContext.tsx
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Peer } from "peerjs";
import type { DataConnection } from "peerjs";
import type { GameMessage } from "../interfaces/game/INetwork";

export interface PlayerInfo {
    peerId: string;
    name: string;
    isHost: boolean;
}

interface PeerContextData {
    peer: Peer | null;
    roomId: string | null;
    isHost: boolean;
    players: PlayerInfo[];
    myPlayerName: string;
    lastMessage: GameMessage | null;
    createRoom: (playerName: string) => Promise<string>;
    joinRoom: (roomId: string, playerName: string) => Promise<boolean>;
    broadcast: (message: GameMessage) => void;
}

const PeerContext = createContext<PeerContextData>({} as PeerContextData);

// 🌐 FORÇANDO O ROTEADOR A COOPERAR COM SERVIDORES DO GOOGLE
const peerConfig = {
    debug: 2,
    config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478" }],
    },
};

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);
    const [players, setPlayers] = useState<PlayerInfo[]>([]);
    const [myPlayerName, setMyPlayerName] = useState<string>("");
    const [lastMessage, setLastMessage] = useState<GameMessage | null>(null);

    const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
    const hostConnectionRef = useRef<DataConnection | null>(null);

    useEffect(() => {
        console.log("🟢 [SISTEMA] Motor P2P Iniciado!");
    }, []);

    const createRoom = (playerName: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setLastMessage(null);
            setMyPlayerName(playerName);
            const newRoomId = Math.random().toString(36).substring(2, 6).toUpperCase();
            const customPeerId = `rhizome-room-${newRoomId}`;

            console.log(`⏳ [HOST] Criando servidor: ${customPeerId}`);
            const newPeer = new Peer(customPeerId, peerConfig); // Injetado a config!

            newPeer.on("open", (id) => {
                console.log(`✅ [HOST] Sala aberta! ID: ${newRoomId}`);
                setPeer(newPeer);
                setRoomId(newRoomId);
                setIsHost(true);
                setPlayers([{ peerId: id, name: playerName, isHost: true }]);
                resolve(newRoomId);
            });

            newPeer.on("connection", (conn) => {
                console.log(`⚠️ [HOST] SINAL DE CONEXÃO RECEBIDO DE: ${conn.peer}`);

                conn.on("open", () => {
                    console.log(`✅ [HOST] TÚNEL DE DADOS ESTABELECIDO COM: ${conn.peer}`);
                });

                conn.on("data", (data: unknown) => {
                    const msg = data as GameMessage;
                    console.log(`📥 [HOST RECEBEU]:`, msg);

                    if (msg.type === "JOIN") {
                        const newPlayer = { peerId: conn.peer, name: msg.payload.name, isHost: false };
                        setPlayers((prev) => {
                            const updatedPlayers = [...prev, newPlayer];
                            connsMapBroadcast(connectionsRef.current, {
                                type: "LOBBY_UPDATE",
                                payload: { players: updatedPlayers },
                                isHost: true,
                            });
                            return updatedPlayers;
                        });
                        connectionsRef.current.set(conn.peer, conn);
                    } else {
                        setLastMessage(msg);
                    }
                });

                conn.on("close", () => {
                    console.log(`❌ [HOST] Jogador saiu: ${conn.peer}`);
                    connectionsRef.current.delete(conn.peer);
                    setPlayers((prev) => {
                        const updated = prev.filter((p) => p.peerId !== conn.peer);
                        connsMapBroadcast(connectionsRef.current, {
                            type: "LOBBY_UPDATE",
                            payload: { players: updated },
                            isHost: true,
                        });
                        return updated;
                    });
                });
            });
            newPeer.on("error", (err) => reject(err));
        });
    };

    const joinRoom = (roomCode: string, playerName: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            setLastMessage(null);
            const cleanRoomCode = roomCode.trim().toUpperCase();
            setMyPlayerName(playerName);

            const newPeer = new Peer(peerConfig); // Injetado a config!

            const timeoutId = setTimeout(() => {
                newPeer.destroy();
                reject(new Error("Tempo esgotado. Verifique se o Host não recarregou a página."));
            }, 10000);

            newPeer.on("open", () => {
                setPeer(newPeer);
                setIsHost(false);
                setRoomId(cleanRoomCode);

                const hostPeerId = `rhizome-room-${cleanRoomCode}`;
                console.log(`⏳ [CLIENTE] Discondo para: ${hostPeerId}...`);

                // Conecta ao Host
                const conn = newPeer.connect(hostPeerId, { reliable: true });

                conn.on("data", (data: unknown) => {
                    const msg = data as GameMessage;
                    console.log(`📥 [CLIENTE RECEBEU]:`, msg);

                    if (msg.type === "LOBBY_UPDATE") {
                        // Atualiza a tela de espera com os nomes que o Host mandou
                        setPlayers(msg.payload.players);
                    } else {
                        // Repassa comandos do jogo (como START_GAME) para o onlineGame.tsx
                        setLastMessage(msg);
                    }
                });

                conn.on("open", () => {
                    console.log(`✅ [CLIENTE] TÚNEL ABERTO! Preparando disparo do nome...`);
                    clearTimeout(timeoutId);
                    hostConnectionRef.current = conn;

                    // 💣 A VACINA DOS APRESSADINHOS: Espera 500ms para garantir que o túnel
                    // do lado do Host terminou de processar a criptografia DTLS.
                    setTimeout(() => {
                        console.log(`🚀 [CLIENTE] Disparando pacote JOIN!`);
                        conn.send({ type: "JOIN", payload: { name: playerName }, isHost: false });
                        resolve(true);
                    }, 500);
                });

                conn.on("error", (err) => {
                    clearTimeout(timeoutId);
                    reject(err);
                });
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newPeer.on("error", (err: any) => {
                clearTimeout(timeoutId);
                if (err.type === "peer-unavailable") {
                    reject(new Error(`A sala ${cleanRoomCode} não existe ou o Host saiu.`));
                } else {
                    reject(err);
                }
            });
        });
    };

    const connsMapBroadcast = (conns: Map<string, DataConnection>, message: GameMessage) => {
        conns.forEach((conn) => conn.send(message));
    };

    const broadcast = (message: GameMessage) => {
        if (isHost) connsMapBroadcast(connectionsRef.current, message);
        else if (hostConnectionRef.current) hostConnectionRef.current.send(message);
    };

    return (
        <PeerContext.Provider
            value={{ peer, roomId, isHost, players, myPlayerName, lastMessage, createRoom, joinRoom, broadcast }}>
            {children}
        </PeerContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePeer = () => useContext(PeerContext);
