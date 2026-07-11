# NOVA CITY

A space-themed, real-multiplayer, Torn-style stat RPG. **NOVA CITY** is a
lawless orbital sprawl: train your stats in the Training Bay, run space-flavored
Ops (crimes) for credits, gear up at the Trade Hub, attack other real players in
Combat, get thrown in the Brig or the Medbay and get sprung/healed by fleet-mates,
travel between stations and planets for exclusive Ops and gear, and found or join
a Fleet (faction) with a shared bank, live chat, and Fleet Wars.

This is a **sibling project to AFTERLIGHT** (the rest of this repository) — a
completely separate, unrelated codebase and game. AFTERLIGHT is untouched.

## Why a real backend

Unlike AFTERLIGHT, NOVA CITY is explicitly **real multiplayer**: accounts are
real, other players are real people, and PvP/Fleet/mail/chat all happen against
a live server over HTTP + WebSocket. That means it needs a server and can't be a
single static HTML file — you run a Node server and a web client, both locally
or on a LAN.

## Tech stack

- **Server** (`server/`): Node.js + TypeScript, Express (REST) + `ws`
  (WebSocket) for real-time push, JWT auth with bcrypt password hashing. Data
  is persisted with a small write-through JSON-file-backed store
  (`server/src/store/db.ts`) — no external database to install. All data access
  goes through a repository layer, so swapping in a real SQL database later is a
  localized change.
- **Client** (`client/`): Vite + React + TypeScript SPA, React Router for
  navigation. A ~15-screen, form- and state-heavy menu app — a deliberate
  departure from AFTERLIGHT's no-framework canvas approach.

## Running it

From `nova-city/`:

```bash
npm install        # one-time, installs both server and client workspaces
npm run dev         # runs the server (:4000) and client (:5183) together
```

Then open `http://localhost:5183` — register a pilot and play. To test
multiplayer features (Combat, Fleets, Mail), register a second pilot in another
browser profile/incognito window.

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Server + client together, with hot-reload |
| `npm run dev:server` / `npm run dev:client` | Either half alone |
| `npm run build` | Typecheck + production build of both |
| `npm run typecheck` | TypeScript checking only, both packages |
| `npm test` | Server domain-logic unit tests (Vitest) |

Server-only env vars:

- `PORT` — server port (default `4000`)
- `NOVA_CITY_JWT_SECRET` — JWT signing secret. A dev default is used with a
  console warning if unset; **set a real secret before running anywhere beyond
  localhost.**
- `NOVA_CITY_DATA_DIR` — where the JSON save data lives (default
  `server/.data/`)

This is a real local/LAN multiplayer server. Public hosting (a real domain,
HTTPS, a managed database, process supervision) is a separate follow-up and out
of scope here — everything above is aimed at "run it and play with a friend on
the same network."

## Systems

- **Auth** — register/login, JWT sessions
- **Character** — Strength / Defense / Speed / Dexterity, level & XP, derived
  Combat Rating
- **Resources** — Fuel, Resolve, Morale, Health, all regenerating over real time
- **Training Bay** — spend Fuel to train a stat, diminishing returns
- **Ops** — space-flavored crimes with stat-based success odds; failure risks
  the Brig
- **Brig** — timed jail; other players can spend Resolve + credits to spring you
- **Medbay** — timed recovery after a PvP loss; fleet-mates can speed it up with
  a cooldown-limited Medic Assist
- **Combat** — attack other players at your location; loser goes to the Medbay,
  winner takes a salvage cut
- **Trade Hub / Inventory** — buy/sell/equip weapons, armor, consumables, and
  decaying contraband
- **Travel** — 8 stations/planets with travel time and location-exclusive Ops
  and gear
- **Fleets** — create/join, shared bank, live chat, simplified Fleet Wars
  (declare → contribute Fuel → payout)
- **Mail** — player-to-player inbox
- **Leaderboard** — by level, net worth, Combat Rating
- **Derelict Salvage** — a shared world event anyone can trigger; players commit
  Fuel and split a fixed credit pool by contribution
- All of the above push **real-time WebSocket notifications** (attacked,
  sprung, mail, fleet chat, war updates, salvage events)

## Project layout

```
nova-city/
  server/        Express + ws API, JSON-file store, domain logic, tests
  client/        Vite + React SPA
```

See `server/src/domain/` for the pure, unit-tested game-logic functions (regen,
training, crime odds, combat resolution, leveling, market decay, faction wars,
salvage payouts) and `server/src/routes/` for how they're wired to the API.
