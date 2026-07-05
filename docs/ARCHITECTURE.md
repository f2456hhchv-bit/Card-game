# AFTERLIGHT — Technical Architecture

**Authority:** Produced output of AF-001. Extends AF-000 and the Master Constitution. Every future feature must fit this architecture; it is extended, never replaced.
**Stack:** TypeScript + WebGL web game (see `docs/TECHNOLOGY_DECISION.md`). Offline-first PWA; online is an optional future layer.

---

## 1. Architecture overview

Afterlight is built as **three concentric layers**, with strict one-way dependencies:

```
┌─────────────────────────────────────────────────────┐
│  GAME LAYER        src/game/  src/ui/               │
│  Player, Enemy, Combat, Loot, Crafting, Research,   │
│  Galaxy, Mission, VFX, HUD, Menus                   │
├─────────────────────────────────────────────────────┤
│  ENGINE LAYER      src/engine/                      │
│  Renderer (WebGL), Audio, Input, Camera,            │
│  Scene Manager, Asset Loader                        │
├─────────────────────────────────────────────────────┤
│  CORE LAYER        src/core/                        │
│  Event Bus, Game Loop/Time, Math, RNG, Pooling,     │
│  Save, Data Registry, Logging, Errors               │
└─────────────────────────────────────────────────────┘
```

**Dependency rule (absolute):**
- `core` depends on nothing (no DOM, no WebGL, no network). It is pure, portable TypeScript.
- `engine` depends only on `core` plus the browser platform (DOM, WebGL, Web Audio, Gamepad, Pointer/Touch APIs).
- `game` and `ui` depend on `core` and `engine` interfaces — never on each other's concrete features.
- No gameplay feature imports another gameplay feature directly. Features communicate through the **Event Bus** and shared **interfaces** defined in `core`.

This layering is what makes every AF-001 project goal cheap later: multiplayer, community features, live events, expansions, and console all attach at layer boundaries instead of requiring rewrites. The whole simulation (`core` + `game`) can run headless — in tests, in tooling, or one day on a server.

## 2. Terminology mapping (module spec → this stack)

AF-001 uses engine-generic terms. Their binding equivalents here:

| AF-001 term | Afterlight equivalent |
|---|---|
| Scriptable Objects | Typed data definitions: JSON/TS tables in `src/data/`, validated by schemas |
| Prefabs | Entity **archetypes**: data records composing reusable components |
| Scenes | Managed **game states** (Boot, GalaxyCommand, Expedition, …) owned by the Scene Manager |
| Materials / Shaders | WebGL shader modules in `src/engine/render/shaders/` |
| Editor tools | Node scripts in `tools/` (content validation, asset packing, balance checks) |
| Build/ Generated/ | `dist/` (git-ignored build output) and `src/generated/` (generated code/data, never hand-edited) |

## 3. Systems and ownership

Every system is a class implementing the common `System` interface (`init`, `update(dt)`, `dispose`), registered with the **Game Manager**, and owning exactly one responsibility:

| System | Layer | Owns |
|---|---|---|
| Game Manager | core | System registry, lifecycle, fixed-timestep update order |
| Event Bus | core | All cross-system communication |
| Save System | core | Persistence, versioning, migration, validation |
| Data Registry | core | Loading + schema-validating all content/balance tables |
| Scene Manager | engine | Game state stack, transitions, async load between states |
| Input System | engine | Keyboard, mouse, touch, gamepad → unified **actions** (never raw keys in gameplay code) |
| Audio System | engine | Web Audio graph, buses (master/music/sfx/ui), pooled voices |
| Renderer | engine | WebGL sprite/particle batching, layers, post-effects |
| Camera System | engine | Overhead view (AF-000 perspective lock), follow, shake, zoom |
| UI System | ui | HUD + menus, scaling, accessibility settings surface |
| Player System | game | Commander state, movement, stats |
| Enemy System | game | Spawning, pooled enemy lifecycle, behaviours |
| Combat System | game | Damage resolution, projectiles, status effects |
| Loot System | game | Drops, pickup magnetism, rarity |
| Crafting System | game | Recipes, materials |
| Research System | game | Research tree state and unlocks |
| Galaxy System | game | Sector map, restoration state (the civilisation-rebuilding fantasy) |
| Mission System | game | Mission definitions, objectives, completion |
| VFX System | game | Pooled gameplay-communicating effects |
| Analytics | core | **Local-only** gameplay statistics (fully offline, feeds the Statistics save slice) |
| Networking Framework | net | **Inactive.** Interfaces + no-op offline implementation only |

Adding a future system = new folder + registration with the Game Manager. Removing one = deregistration. Nothing else changes.

## 4. Folder structure

```
/                       repo root
├── docs/               Constitution, modules, this file, boards, asset sheets, QA
├── public/             Static files served as-is (icons, PWA manifest)
├── assets/             Source art / audio / fonts (pre-processing pipeline)
├── src/
│   ├── core/           events/ time/ math/ rng/ pool/ save/ data/ log/
│   ├── engine/         render/ (incl. shaders/) audio/ input/ camera/ scene/ loader/
│   ├── game/           player/ enemy/ combat/ loot/ crafting/ research/
│   │                   galaxy/ mission/ vfx/
│   ├── ui/             hud/ menus/ components/ accessibility/
│   ├── data/           content + balance tables (JSON/TS) and their schemas/
│   ├── net/            inactive networking framework (interfaces + offline no-op)
│   ├── debug/          debug overlay, perf HUD, cheats (dev builds only)
│   ├── generated/      generated code/data — never hand-edited
│   └── main.ts         composition root: builds systems, starts Game Manager
├── tests/              Vitest unit + simulation tests
├── tools/              content validation, asset packing, balance tooling
└── dist/               build output (git-ignored)
```

Predictable rule: **a file's path tells you its layer, and its layer tells you what it may import.** Localization lives in `src/data/localization/`; save data lives on the player's device (see §7), not in the repo.

## 5. Coding standards

- **Single responsibility** — small, focused classes/modules; if a file needs "and" to describe it, split it.
- **No magic numbers** — every gameplay value comes from `src/data/` tables. Code reads configuration; it never embeds balance.
- **Events over polling** — state changes are announced on the Event Bus; systems never reach into each other to check flags.
- **Composition over inheritance** — entities are archetypes composing components; behaviour variety comes from data, not class trees.
- **No duplicated logic** — shared behaviour is promoted into `core`/`engine` utilities, not copied.
- **Allocation discipline** — no per-frame object allocation in hot paths; pools (§9) are mandatory for anything spawned repeatedly (projectiles, enemies, particles, damage numbers, audio voices).
- **Naming** — full words, intent-revealing, no abbreviations (`enemySpawnInterval`, not `eSpwnInt`).
- **Strict TypeScript** — `strict: true`, no `any` in committed code without a documented reason.

## 6. Data architecture

- All content and balance lives in **typed tables** under `src/data/`: weapons, enemies, bosses, biomes, relics, research nodes, missions, sectors, rarity curves, XP curves.
- Every table has a **schema** (`src/data/schemas/`) validated at load by the Data Registry — in dev builds a violation fails loudly; in production it falls back per §8.
- Table shapes are **database-ready**: flat records with stable string IDs, so a future online layer can serve the same definitions from a server without reshaping.
- IDs are permanent once shipped (saves reference them). Renames happen via migration, never in place.

## 7. Event system

A single typed **Event Bus** in `core/events/`:

- Events are plain immutable data objects with a typed payload — e.g. `EnemyKilled`, `PlayerDamaged`, `BossSpawned`, `LootDropped`, `ResearchUnlocked`, `MissionCompleted`, `CommanderLevelUp`.
- Naming convention: **PastTense fact** (something that happened), never an instruction. Systems react to facts; no event knows who is listening.
- All event types are declared in one registry (`core/events/GameEvents.ts`) so the full vocabulary of the game is inspectable in one place — this doubles as system documentation.
- High-frequency events reuse pooled payload objects (allocation discipline applies to the bus itself).
- Debug builds can log/record the event stream — this is the backbone of the debug tooling and, later, of replay and analytics features.

## 8. Save architecture

- The save is partitioned into **independent slices**, each versioned separately: `progress`, `research`, `collections`, `statistics`, `settings`, `galaxy`, `crafting`, `achievements`. Future: `cloud`, `multiplayer` — new slices, no redesign.
- Storage: IndexedDB (primary) via a thin storage interface in `core/save/` — the interface is what a future cloud/Steam-cloud backend implements.
- **Versioning + migration:** every slice carries `{ version, data, checksum }`. Migrations are pure functions `vN → vN+1`, chained; old saves always upgrade, never break.
- **Validation:** checksums + schema validation on load. A corrupted slice is quarantined (kept for diagnosis), the slice falls back to its last good backup (the save system keeps a rolling backup per slice), and only that slice resets if unrecoverable — a corrupted settings file never costs the player their research tree.
- Writes are atomic (write-then-swap) and debounced; the game never blocks a frame on saving.

## 9. Error handling & resilience

- **Missing assets never crash.** The loader returns visible placeholder assets (magenta sprite, silent audio) and logs a structured warning; the game keeps running.
- **Systems fail independently.** A system throwing in `update` is isolated and reported by the Game Manager, not allowed to take down the loop.
- **Structured logging** in `core/log/`: every warning/error carries system, context, and data. Dev builds surface them in the debug overlay; production builds keep a ring buffer attachable to bug reports.
- Corrupted saves: see §8 — quarantine, restore backup, minimal reset, never silent data loss.

## 10. Performance architecture

Targets (binding, from AF-000/Constitution): **120 FPS preferred / 60 minimum desktop, 60 Steam Deck, 60 mobile.**

- **Fixed-timestep simulation** (accumulator pattern) with interpolated rendering — gameplay is deterministic and framerate-independent; 120 Hz displays get smooth rendering without changing the sim.
- **Object pooling mandatory** — generic `Pool<T>` in `core/pool/`; all repeatedly-spawned entities live in pools sized by data.
- **Batched rendering** — one sprite batcher, texture atlases, sorted draw layers; target ≤ a few draw calls per frame for typical combat.
- **Zero steady-state allocation** in the frame path (no GC hitches). Dev builds include an allocation tracker in the perf HUD.
- **Async loading** — assets stream between scenes; expeditions never hitch on loads.
- Performance budgets are checked at QA stage of every module (per the Development Pipeline).

## 11. Security & progression integrity

- Save validation (checksums + schemas) protects against corruption and casual tampering.
- **Local and online data are separated by design:** the offline save slices are the player's own; any future online/community feature (leaderboards, shared discoveries) gets its **own** server-validated data path and never trusts a client save.
- The deterministic fixed-timestep sim makes future server-side verification (replay-based anti-cheat) possible **without redesign** — determinism is architected in now, used later.

## 12. Networking framework (inactive)

- `src/net/` contains **interfaces only** plus a no-op `OfflineBackend` implementation, which is the permanently supported default.
- Gameplay code never talks to the network; it talks to `net` interfaces, which today do nothing. When online features arrive, a real backend implements the same interfaces behind feature flags.
- Constitution guarantee restated: **the offline game is complete**; online is enhancement only.

## 13. System documentation standard

Every system folder contains a `README.md` with exactly these sections — **Purpose, Responsibilities, Dependencies, Events (published + consumed), Data Structures, Extension Points.** A system without its README is not complete. This is enforced as part of every module's QA checklist.

## 14. Extension rules (how the next ten years attach)

- New feature → new system folder + data tables + events. Existing systems are extended through their documented Extension Points, never edited against their contracts.
- New platform (console) → new implementation of `engine` platform interfaces; `core`/`game` untouched.
- Multiplayer / community / live events → real `net` backend + new save slices + server-validated data paths; the offline sim already deterministic and headless-capable.
- Expansions → new data tables and content folders; the Data Registry and pipeline already treat content as data.

---

## Internal review loop (AF-001, recorded)

- **Modularity** — strict layer rule + event-only feature communication; verified no feature-to-feature imports are possible under the dependency rule. ✔
- **Scalability** — systems add/remove independently; data tables are database-ready; content pipeline is data-only. ✔
- **Performance** — fixed timestep, pooling, batching, zero steady-state allocation, budgets at QA. ✔
- **Maintainability** — path-tells-layer folder rule, per-system READMEs, single event registry. ✔
- **Platform compatibility** — browser now; Tauri wrap and console attach at `engine` interfaces only. ✔
- **Future multiplayer compatibility** — headless deterministic core, inactive net interfaces, separated data paths, migration-ready saves. ✔
- **Documentation quality** — §13 standard is mandatory and QA-enforced. ✔
- **Simplification pass** — removed an initially-considered ECS framework dependency (unneeded complexity; archetype composition in plain TS meets the need), and kept the Event Bus as the single communication mechanism rather than adding a second message-queue abstraction. ✔

**Internal quality score: 9.5/10 — approved.**
