import { useEffect, useRef } from 'react';
import type { WsEvent } from '../types';

export function useNovaSocket(token: string | null, onEvent: (event: WsEvent) => void): void {
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    if (!token) return;
    let closedByCleanup = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      socket = new WebSocket(`${protocol}://${window.location.host}/ws?token=${encodeURIComponent(token)}`);
      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as WsEvent;
          handlerRef.current(parsed);
        } catch {
          // ignore malformed frames
        }
      };
      socket.onclose = () => {
        if (!closedByCleanup) reconnectTimer = setTimeout(connect, 3000);
      };
    };
    connect();

    return () => {
      closedByCleanup = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [token]);
}
