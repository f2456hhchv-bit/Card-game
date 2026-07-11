import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { verifyToken } from './auth/jwt.js';
import { registerConnection } from './ws/manager.js';
import { authRouter } from './routes/auth.js';
import { characterRouter } from './routes/character.js';
import { gymRouter } from './routes/gym.js';
import { crimesRouter } from './routes/crimes.js';
import { jailRouter } from './routes/jail.js';
import { hospitalRouter } from './routes/hospital.js';
import { combatRouter } from './routes/combat.js';
import { marketRouter } from './routes/market.js';
import { travelRouter } from './routes/travel.js';
import { factionRouter } from './routes/faction.js';
import { mailRouter } from './routes/mail.js';
import { leaderboardRouter } from './routes/leaderboard.js';
import { salvageRouter } from './routes/salvage.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'NOVA CITY' }));

app.use('/api/auth', authRouter);
app.use('/api/character', characterRouter);
app.use('/api/gym', gymRouter);
app.use('/api/crimes', crimesRouter);
app.use('/api/jail', jailRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/combat', combatRouter);
app.use('/api/market', marketRouter);
app.use('/api/travel', travelRouter);
app.use('/api/faction', factionRouter);
app.use('/api/mail', mailRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/salvage', salvageRouter);

// If a built client (client/dist) is present alongside this checkout, serve it —
// this lets a single deployed process host both the API/WebSocket and the SPA
// behind one URL. In local dev the Vite dev server handles the client instead,
// so this is a no-op unless `npm run build` has produced client/dist.
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(moduleDir, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api|\/ws).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url ?? '', `http://${request.headers.host}`);
  if (url.pathname !== '/ws') {
    socket.destroy();
    return;
  }
  const token = url.searchParams.get('token');
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  wss.handleUpgrade(request, socket, head, (ws) => {
    registerConnection(payload.userId, ws);
    ws.send(JSON.stringify({ type: 'connected' }));
  });
});

const PORT = Number(process.env.PORT ?? 4000);
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[nova-city] server listening on http://localhost:${PORT}`);
});
