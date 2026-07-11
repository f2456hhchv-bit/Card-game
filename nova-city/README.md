# NOVA CITY

A space-themed, real-multiplayer, Torn-style stat RPG. **NOVA CITY** is a
lawless orbital sprawl: train your stats in the Training Bay, run space-flavored
Ops (crimes) for credits, gear up at the Trade Hub, attack other real players in
Combat, get thrown in the Brig or the Medbay and get sprung/healed by fleet-mates,
travel between stations and planets for exclusive Ops and gear, and found or join
a Fleet (faction) with a shared bank, live chat, and Fleet Wars.

This is a **sibling project to AFTERLIGHT** (the rest of this repository) — a
completely separate, unrelated codebase and game. AFTERLIGHT is untouched.

## Play online with friends

NOVA CITY ships as one deployable service: the Node server serves both the API/
WebSocket **and** the built client, so one deploy gives you one shareable URL.

### Fly.io (recommended)

Fly.io's free allowance covers a small always-available app, has solid
WebSocket support, and its free volumes let save data survive redeploys
(unlike most free tiers). Setup is a few CLI commands rather than a pure
click-a-button flow:

```bash
# 1. Install the Fly CLI (see https://fly.io/docs/flyctl/install/ for other OSes)
curl -L https://fly.io/install.sh | sh

# 2. Log in — opens a browser to sign up/sign in. A card is required for
#    identity verification but you won't be charged within the free allowance.
fly auth login

# 3. From nova-city/, register + deploy the app using the checked-in fly.toml.
#    If "nova-city" is taken (app names are global), edit `app =` in fly.toml first.
cd nova-city
fly launch --copy-config --now

# 4. Set a real JWT secret (fly launch does not do this for you):
fly secrets set NOVA_CITY_JWT_SECRET=$(openssl rand -hex 32)
fly deploy
```

Fly prints your live URL at the end (`https://<app-name>.fly.dev`) — send that
to your friends.

**Optional: persist save data across deploys.** By default the JSON save data
lives on the container's disk and resets on redeploy, same as any free tier.
Fly's free allowance includes up to 3GB of volume storage, so you can avoid
that:

```bash
fly volumes create nova_city_data --region iad --size 1
```

Then uncomment the `NOVA_CITY_DATA_DIR` env var and the `[[mounts]]` block in
`nova-city/fly.toml` and redeploy (`fly deploy`).

**Known limit:** on the free allowance, Fly stops the machine after a period of
no traffic and restarts it on the next request (`auto_stop_machines` in
`fly.toml`) — the first request after a lull takes a few seconds while it wakes
up, similar to other free tiers.

### Alternative: Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/f2456hhchv-bit/Card-game/tree/claude/space-torn-game-5qlu8q)

Click the button (reads `render.yaml` at the repo root, auto-generates a real
`NOVA_CITY_JWT_SECRET`). Render's free tier spins down after ~15 minutes of
inactivity (30–60s to wake back up) and doesn't offer a free persistent disk —
Fly.io above is the better free option if persistence matters to you.

### Alternative: any Docker host

`nova-city/Dockerfile` builds and runs the same single-process app and works on
Railway, Koyeb, a VPS, or anywhere else that runs containers:

```bash
cd nova-city
docker build -t nova-city .
docker run -p 4000:4000 -e NOVA_CITY_JWT_SECRET=<a-real-secret> nova-city
```

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
multiplayer features (Combat, Factions, Mail), register a second pilot in
another browser profile/incognito window.

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

For actually playing with friends over the internet, see "Play online with
friends" above.

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
- **Combat** — attack other players at your location (loser goes to the
  Medbay, winner takes a salvage cut) **or** fight persistent NPC hostiles
  seeded at every location, so there's always something to fight even solo —
  each respawns a few minutes after being defeated
- **Trade Hub / Inventory** — buy/sell/equip weapons, armor, consumables, and
  decaying contraband
- **Travel** — 12 stations/planets with travel time and location-exclusive Ops
  and gear
- **Factions** — create/join, shared bank, live chat, simplified Faction Wars
  (declare → contribute Fuel → payout)
- **Mail** — player-to-player inbox
- **Leaderboard** — by level, net worth, Combat Rating
- **Derelict Salvage** — a shared world event anyone can trigger; players commit
  Fuel and split a fixed credit pool by contribution
- **Galaxy Command** — the bigger "space frontier" layer, in AFTERLIGHT's
  spirit (a universe that lost its light and is rebuilding):
  - **Fleet** — every pilot starts with one Scout Skiff; buy from 8 ships
    across 4 hull classes (Scout, Frigate, Cruiser, Dreadnought — each with a
    second, differently-statted variant) at the Shipyard to grow your fleet
    power. Higher hull classes are gated behind Training Bay progress (total
    trained stats: 80 / 200 / 400), so ship access tiers with active play the
    same way Torn's education/certification gates do — not idle waiting,
    since stats only grow by actually training
  - **Sectors** — 15 shared sectors, tiers 1-5, with Hollow-touched hostile
    presence that grows over real time the longer it goes unchecked
    (fog-of-war until scouted); tier 5 stations require a Sovereign License
  - **Fighting the Hollow** — your fleet (plus a small personal-command
    assist) chips away at a sector's alien strength; badly-outmatched
    attacks cost you Health instead
  - **The choice** — once a sector is cleared, **build a station** there
    (steady income, raises your standing) or **plunder it** (an immediate
    payout that costs your standing) — permanent, one-time, per sector
  - **Alignment & Command Rank** — a −100..100 alignment score and a derived
    rank (Drifter → Ship Captain → Squadron Leader → Fleet Commander →
    Sector Warlord/Steward → Galactic Commander) track your growth from one
    ship to commanding the frontier
- **Certifications** — Torn-style, tied to active play rather than idle
  waiting; every gate is unlocked by *doing*, not by a timer:
  - **Combat License** — Journeyman/Veteran/Elite tiers of weapons and armor
    are gated behind total trained stats, same as the Shipyard
  - **Trade License** — Novice → Licensed → Black Market Contact → Master
    Trader ranks up from lifetime completed trades; higher ranks earn a sell
    bonus and Black Market Contact+ unlocks contraband
  - **Command License** — Garrison/Fortress/Bastion licenses gate higher
    station tiers behind fleet firepower — your fleet garrisons what it builds
  - **Navigator Rating** — Novice → Charted → Veteran → Master Navigator
    ranks up from sectors scouted, discounting future scouting Fuel cost
- **Casino** — Reels of the Hollow (a 3-reel slot pull) and Double or Nothing
  (a coin flip), pure games of chance for burning spare credits — no
  progression gated behind them
- **Bounty Board** — place a credit bounty on any pilot; whoever beats them
  in Combat collects every active bounty on that target automatically, on
  top of the normal salvage cut
- **Achievements** — 15 one-time milestones spanning every system (training,
  trading, exploring, building, fighting, alignment), each claimable once for
  a credit reward
- **Daily Bonus** — a small credits/Fuel/Resolve gift claimable once per UTC
  calendar day — a reason to check back in, not a timer to wait out
- All of the above push **real-time WebSocket notifications** (attacked,
  sprung, mail, faction chat, war updates, salvage events)

## Project layout

```
nova-city/
  server/        Express + ws API, JSON-file store, domain logic, tests
  client/        Vite + React SPA
  Dockerfile     Multi-stage build: server + client into one runnable image
  fly.toml       Fly.io app config
render.yaml      Render Blueprint (repo root) — one-click deploy config
```

See `server/src/domain/` for the pure, unit-tested game-logic functions (regen,
training, crime odds, combat resolution, leveling, market decay, faction wars,
salvage payouts) and `server/src/routes/` for how they're wired to the API.
