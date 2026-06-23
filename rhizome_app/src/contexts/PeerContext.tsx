// src/contexts/PeerContext.tsx
import React, { createContext, useContext, useState, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { GameMessage } from '../interfaces/game/INetwork'; // Usando a sua interface oficial!

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
  lastMessage: GameMessage | null; // <--- A PONTE PARA O JOGO!
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (roomId: string, playerName: string) => Promise<boolean>;
  broadcast: (message: GameMessage) => void;
}

const PeerContext = createContext<PeerContextData>({} as PeerContextData);

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [lastMessage, setLastMessage] = useState<GameMessage | null>(null);
  
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const hostConnectionRef = useRef<DataConnection | null>(null);

  const createRoom = (playerName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const newRoomId = Math.random().toString(36).substring(2, 6).toUpperCase();
      const customPeerId = `rhizome-room-${newRoomId}`;
      const newPeer = new Peer(customPeerId); 

      newPeer.on('open', (id) => {
        setPeer(newPeer);
        setRoomId(newRoomId);
        setIsHost(true);
        setPlayers([{ peerId: id, name: playerName, isHost: true }]);
        resolve(newRoomId);
      });

      newPeer.on('connection', (conn) => {
        conn.on('data', (data: any) => {
          const msg = data as GameMessage;
          
          if (msg.type === 'JOIN') {
            const newPlayer = { peerId: conn.peer, name: msg.payload.name, isHost: false };
            setPlayers((prev) => {
              const updatedPlayers = [...prev, newPlayer];
              broadcastToAll(connectionsRef.current, {
                type: 'LOBBY_UPDATE',
                payload: { players: updatedPlayers }
              });
              return updatedPlayers;
            });
            connectionsRef.current.set(conn.peer, conn);
          } else {
            // Se não for JOIN de lobby, repassa para o jogo!
            setLastMessage(msg);
          }
        });

        conn.on('close', () => {
          connectionsRef.current.delete(conn.peer);
          setPlayers((prev) => prev.filter(p => p.peerId !== conn.peer));
        });
      });
      newPeer.on('error', (err) => reject(err));
    });
  };

  const joinRoom = (roomCode: string, playerName: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const newPeer = new Peer(); 

      newPeer.on('open', (id) => {
        setPeer(newPeer);
        setIsHost(false);
        setRoomId(roomCode);

        const hostPeerId = `rhizome-room-${roomCode.toUpperCase()}`;
        const conn = newPeer.connect(hostPeerId);

        conn.on('open', () => {
          hostConnectionRef.current = conn;
          conn.send({ type: 'JOIN', payload: { name: playerName } } as GameMessage);
          resolve(true);
        });

        conn.on('data', (data: any) => {
          const msg = data as GameMessage;
          if (msg.type === 'LOBBY_UPDATE') {
            setPlayers(msg.payload.players);
          } else {
             // Repassa comandos do Host para a tela do Cliente!
             setLastMessage(msg);
          }
        });
        conn.on('error', (err) => reject(err));
      });
    });
  };

  const broadcastToAll = (conns: Map<string, DataConnection>, message: GameMessage) => {
    conns.forEach((conn) => conn.send(message));
  };

  const broadcast = (message: GameMessage) => {
    if (isHost) broadcastToAll(connectionsRef.current, message);
    else if (hostConnectionRef.current) hostConnectionRef.current.send(message);
  };

  return (
    <PeerContext.Provider value={{ peer, roomId, isHost, players, lastMessage, createRoom, joinRoom, broadcast }}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => useContext(PeerContext);