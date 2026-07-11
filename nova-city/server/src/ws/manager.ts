import type { WebSocket } from 'ws';

export type WsEvent =
  | { type: 'attacked'; attackerCallsign: string; won: boolean; log: string[] }
  | { type: 'jail-released' }
  | { type: 'jail-sprung'; byCallsign: string }
  | { type: 'hospital-released' }
  | { type: 'medic-assist'; byCallsign: string; minutesRemoved: number }
  | { type: 'mail'; fromCallsign: string; subject: string }
  | { type: 'faction-message'; factionId: string; authorCallsign: string; body: string }
  | { type: 'faction-war-update'; factionId: string; message: string }
  | { type: 'salvage-event-started'; endsAt: number }
  | { type: 'salvage-event-resolved'; totalFuel: number; payoutPerFuel: number };

const connections = new Map<string, Set<WebSocket>>();

export function registerConnection(userId: string, socket: WebSocket): void {
  if (!connections.has(userId)) connections.set(userId, new Set());
  connections.get(userId)!.add(socket);
  socket.on('close', () => {
    connections.get(userId)?.delete(socket);
    if (connections.get(userId)?.size === 0) connections.delete(userId);
  });
}

export function sendToUser(userId: string, event: WsEvent): void {
  const sockets = connections.get(userId);
  if (!sockets) return;
  const payload = JSON.stringify(event);
  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) socket.send(payload);
  }
}

export function sendToUsers(userIds: string[], event: WsEvent): void {
  for (const userId of userIds) sendToUser(userId, event);
}

export function broadcastAll(event: WsEvent): void {
  const payload = JSON.stringify(event);
  for (const sockets of connections.values()) {
    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) socket.send(payload);
    }
  }
}
