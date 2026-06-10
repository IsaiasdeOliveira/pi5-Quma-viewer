import { API_BASE_URL } from '@core/constants';
import { resolveWebSocketURL } from '@core/helpers';
import { useEffect, useRef, useState } from 'react';

export function useGameSocket(gameId, token) {
  const [connected, setConnected] = useState(false);
  const [currentGameState, setCurrentGameState] = useState(null);
  const [mounted, setMounted] = useState(false);

  const reconnectTimeout = useRef(null);
  const webSocketRef = useRef(null);
  
  // 🔥 NOVO: Controle de tentativas de reconexão
  const retryCount = useRef(0);
  const MAX_RETRIES = 3; 

  useEffect(() => {
    if (!gameId || !token || !mounted) return;

    function connect() {
      const url = new URL(`api/v1/ws/games/${gameId}`, API_BASE_URL);
      url.searchParams.set('token', encodeURIComponent(`${token}`));
      const socketUrl = resolveWebSocketURL(url?.toString());

      const ws = new WebSocket(socketUrl);
      webSocketRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        retryCount.current = 0; // 🔥 Reseta o contador se conectar com sucesso!
      };

      ws.onmessage = (event) => {
        try {
          const dto = JSON.parse(event.data);
          setCurrentGameState(dto);
        } catch (err) {
          console.error(
            `[ERR]: Invalid message received from WebSocket: ${event.data}`,
            err
          );
        }
      };

      ws.onclose = (event) => {
        setConnected(false);
        
        // 🔥 TRAVA 1: Se o servidor encerrou a partida de propósito, não reconecta!
        if (event.code === 1000 || event.code === 1008) {
            console.log("Partida encerrada ou não encontrada. Conexão fechada.");
            return; 
        }

        // 🔥 TRAVA 2: Só reconecta se não estourou o limite de 3 vezes
        if (retryCount.current < MAX_RETRIES) {
            retryCount.current += 1;
            console.warn(`Tentando reconectar... (${retryCount.current}/${MAX_RETRIES})`);
            
            reconnectTimeout.current = setTimeout(() => {
              if (gameId) connect();
            }, 2000);
        } else {
            console.error("Limites de reconexão esgotados. A partida provavelmente não existe mais.");
        }
      };

      ws.onerror = (err) => {
        console.error('Erro no WebSocket:', err);
        ws.close();
      };
    }

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      webSocketRef.current?.close();
    };
  }, [gameId, token, mounted]);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  return {
    connected,
    gameState: currentGameState,
  };
}