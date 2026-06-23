// src/contexts/PeerContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';

// Tipagem das mensagens que vão trafegar na rede
export interface P2PMessage {
  type: 'JOIN' | 'LOBBY_UPDATE' | 'START_GAME' | 'VOTE';
  payload: any;
}

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
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (roomId: string, playerName: string) => Promise<boolean>;
  broadcast: (message: P2PMessage) => void;
}

const PeerContext = createContext<PeerContextData>({} as PeerContextData);

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  
  // O Host guarda a conexão com todos os clientes
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  // O Cliente guarda a conexão apenas com o Host
  const hostConnectionRef = useRef<DataConnection | null>(null);

  // ==========================================
  // LÓGICA DO HOST (Criar Sala)
  // ==========================================
  const createRoom = (playerName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Gera um ID aleatório de 4 caracteres para a sala
      const newRoomId = Math.random().toString(36).substring(2, 6).toUpperCase();
      const customPeerId = `rhizome-room-${newRoomId}`;
      
      const newPeer = new Peer(customPeerId); // Conecta no servidor gratuito do PeerJS

      newPeer.on('open', (id) => {
        setPeer(newPeer);
        setRoomId(newRoomId);
        setIsHost(true);
        setPlayers([{ peerId: id, name: playerName, isHost: true }]);
        resolve(newRoomId);
      });

      // Host escutando novas conexões
      newPeer.on('connection', (conn) => {
        conn.on('data', (data: any) => {
          const msg = data as P2PMessage;
          
          if (msg.type === 'JOIN') {
            // Um novo jogador entrou!
            const newPlayer = { peerId: conn.peer, name: msg.payload.name, isHost: false };
            setPlayers((prev) => {
              const updatedPlayers = [...prev, newPlayer];
              // O Host avisa todo mundo que a lista atualizou
              broadcastToAll(connectionsRef.current, {
                type: 'LOBBY_UPDATE',
                payload: { players: updatedPlayers }
              });
              return updatedPlayers;
            });
            connectionsRef.current.set(conn.peer, conn);
          }
        });

        conn.on('close', () => {
          // Lógica para quando alguém cai da sala (remover da lista)
          connectionsRef.current.delete(conn.peer);
          setPlayers((prev) => prev.filter(p => p.peerId !== conn.peer));
        });
      });

      newPeer.on('error', (err) => reject(err));
    });
  };

  // ==========================================
  // LÓGICA DO CLIENTE (Entrar na Sala)
  // ==========================================
  const joinRoom = (roomCode: string, playerName: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const newPeer = new Peer(); // Cliente ganha um ID dinâmico

      newPeer.on('open', (id) => {
        setPeer(newPeer);
        setIsHost(false);
        setRoomId(roomCode);

        // Disca para o Host
        const hostPeerId = `rhizome-room-${roomCode.toUpperCase()}`;
        const conn = newPeer.connect(hostPeerId);

        conn.on('open', () => {
          hostConnectionRef.current = conn;
          // Manda o nome para o Host
          conn.send({ type: 'JOIN', payload: { name: playerName } } as P2PMessage);
          resolve(true);
        });

        // Cliente escutando os comandos do Host
        conn.on('data', (data: any) => {
          const msg = data as P2PMessage;
          if (msg.type === 'LOBBY_UPDATE') {
            // Atualiza a tela de lobby do cliente com a lista que o Host mandou
            setPlayers(msg.payload.players);
          }
        });

        conn.on('error', (err) => reject(err));
      });
    });
  };

  // Função interna para o Host disparar mensagem para todos
  const broadcastToAll = (conns: Map<string, DataConnection>, message: P2PMessage) => {
    conns.forEach((conn) => conn.send(message));
  };

  // Função genérica de disparo (se for host manda pra todos, se for cliente manda pro host)
  const broadcast = (message: P2PMessage) => {
    if (isHost) {
      broadcastToAll(connectionsRef.current, message);
    } else if (hostConnectionRef.current) {
      hostConnectionRef.current.send(message);
    }
  };

  return (
    <PeerContext.Provider value={{ peer, roomId, isHost, players, createRoom, joinRoom, broadcast }}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => useContext(PeerContext);