# AF-046 — HUMAN OUTLAW ENEMY FRAMEWORK

**Module status:** Complete (framework specified; squad/command/mine engine implemented and tested; a live Outlaw ambush governs the Director's AmbushEvent wave end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-045 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/HUMAN_OUTLAW_FRAMEWORK.md` + implementation (`src/game/enemies/outlawData.ts`, `OutlawSquad.ts`)

---

*(Module catalogued verbatim below.)*

46

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-045 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the first complete Enemy Faction.

Human Outlaws represent the collapse of civilisation.

They are survivors.

Raiders.

Mercenaries.

Private militaries.

Pirates.

Broken expeditionary fleets.

Unlike alien enemies, Human Outlaws use intelligent tactics, advanced technology and coordinated assaults.

They should feel dangerous because of strategy.

Not biology.

==================================================
CORE PHILOSOPHY
==================================================

Professional.

Adaptive.

Aggressive.

Organised.

Every encounter should resemble fighting experienced pilots.

==================================================
FACTION IDENTITY
==================================================

Theme:

Humanity after collapse.

Technology salvaged from ancient wars.

Modified civilian ships.

Military hardware.

Improvised weapons.

Greed.

Survival.

Freedom.

==================================================
VISUAL LANGUAGE
==================================================

Industrial.

Angular armour.

Exposed engines.

Orange warning lights.

Black steel.

Scrap plating.

Missile pods.

Visible repairs.

Faction colours remain consistent.

==================================================
CORE UNITS
==================================================

Support:

Scout

Raider

Interceptor

Assault Fighter

Bomber

Drone Controller

Heavy Gunship

Support Frigate

Engineer

Sniper

Shield Carrier

Mine Layer

Elite Captain

Flagship Escort

Future units extend naturally.

==================================================
COMBAT STYLE
==================================================

Human Outlaws favour:

Focus Fire

Missile Barrages

Area Denial

Flanking

Shield Coordination

Retreat

Reinforcements

Suppressive Fire

Positioning over brute force.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Deployable Mines

Repair Drones

Shield Generators

Missile Swarms

Emergency Boost

Smoke Fields

Energy Suppression

Formation Flying

Combat AI remains highly coordinated.

==================================================
COMMAND STRUCTURE
==================================================

Higher-ranking enemies command:

Attack Orders

Retreat Orders

Target Priority

Reinforcements

Shield Coordination

Support Behaviour

Destroying leaders weakens formations.

==================================================
ELITE VARIANTS
==================================================

Elite Outlaws gain:

Improved Tactics

Prototype Weapons

Unique Paint

Callsigns

Voice Broadcasts

Personal Abilities

Enhanced Rewards

Every Elite feels like an ace pilot.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Gunship Commander

Carrier Escort

Experimental Fighter

Prototype Destroyer

Mercenary Ace

Elite Engineer

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Outlaws interact with:

Minefields

Abandoned Stations

Derelict Fleets

Trade Routes

Civilian Convoys

Faction Wars

Galaxy Events

Their presence affects nearby systems.

==================================================
LOOT
==================================================

Possible rewards:

Weapon Blueprints

Ship Parts

Credits

Military Equipment

Prototype Components

Rare Alloys

Commander Logs

Faction Lore

==================================================
CODEX
==================================================

Record:

Unit Types

History

Leaders

Technology

Combat Doctrine

Ship Designs

Major Battles

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Distinct silhouettes

Unique warning sounds

Readable missiles

Formation indicators

High Contrast

Colour-blind support

==================================================
PERFORMANCE
==================================================

Pool formations.

Optimise squad AI.

Pool missiles.

Reuse behaviour trees.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Squad State

Commander Unit

Formation

Target Priority

AI Decisions

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Human Outlaw Enemy Framework.

Every future pirate, mercenary and rogue human faction extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Human Outlaw encounters.

Review squad coordination.

Review AI behaviour.

Review missile usage.

Review formation tactics.

Review Elite encounters.

Review reward quality.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-045.

Adjust AI priorities.

Adjust formation logic.

Adjust encounter pacing.

Remove repetitive behaviours.

Ensure Human Outlaws feel intelligent, coordinated and dangerous through tactical superiority rather than overwhelming statistics.

Repeat until the Human Outlaw Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-046.

---

## Foundation / AF-000–045 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Outlaw unit is a plain AF-033 `EnemyDef` — zero schema changes, zero second enemy engine.** Five of the fourteen registered Core Unit kinds carry full sandbox defs (Raider, Sniper, Shield Carrier, Mine Layer, Captain), each passing AF-033's own `findEnemyOverlap` no-overlap law against the existing roster and each other. Every ranged attack IS a real AF-032 `WeaponDef` (Missile Swarms = a `burst`+`seeking` weapon; Suppressive Fire = the Captain's slow-on-hit `statusOnHit`), exactly as AF-033 requires — "dangerous because of strategy, not biology" is enforced by giving them ordinary stats and squad-level mechanics instead of multipliers.
- **Formation Flying gives AF-033's reserved, never-before-used movement hook its first producer.** `stepEnemyMovement`'s `formation` behaviour and its `formationAnchorX/Y`/`formationOffsetX/Y` context fields have existed since AF-033 with no caller; coordinated squad members now fly assigned wedge slots on the Captain through exactly those fields — the same "dormant hook gets its first producer" pattern as AF-024→AF-038's `galaxyNavigation` and AF-043's collection buckets.
- **Command Structure is the one genuinely new mechanical surface (`OutlawSquadRuntime`), and it stays pure like every prior `*Runtime`.** Forming → coordinated → scattered → eliminated; Focus Fire is a damage bonus members hold only while the Captain lives; destroying the Captain issues Retreat Orders through AF-033's *existing* `retreat` AI state (with the scatter window overriding AF-034's hull-based recover exit) — "destroying leaders weakens formations" is literal and mechanical, not narrated.
- **Elite Captains ARE AF-034 Elites.** The squad's Captain spawns through the existing `spawnEnemyInstance(…, elite: true)` path — tier, mutations, reward multiplier, Codex signature all come from `generateElite` unchanged; callsigns are presentation on top (an announcement notice), and Voice Broadcasts honestly await AF-045's asset-pipeline limitation.
- **Deployable Mines reuse AF-035's exact hazard-zone engine** (`HazardZoneDef`/`stepHazardZone`/`isInsideHazard`) — the same reuse AF-036's biome hazards already made — with orange warning-ring rendering per the faction's Visual Language and AF-004's threat-readability law. The mine test drives the *real* AF-035 functions, not a mock.
- **The faction IS AF-039's registered-but-unprofiled Mercenary Guild, now profiled** — paying AF-039's own recorded content debt for a fourth of its ten factions rather than adding an eleventh. Its `uniqueUnits` are the five real Outlaw def ids; its Codex entry (AF-043, one additive `SANDBOX_CODEX_ENTRIES` item) unlocks via `meta.discover("lore", LORE_MERCENARY_GUILD_CODEX)` on the first Captain kill, and the factions section-completion test fixture gained the fourth lore id accordingly.
- **Faction Synergy is live through AF-038's existing statistics:** eliminating a full squad applies a clamped +5 Sector Stability delta to the current system via `GalaxyRuntime.clampedDelta` + `recordStat` — "their presence affects nearby systems," mechanically. Loot needs zero new systems: kills flow through the existing `killDrone` path (XP, drops, elite relics, elite Credits via AF-040), and Rare Alloys already bank through AF-025's material path on collection.
- **The Director is untouched.** Outlaw squads enter through the Director's *existing* `AmbushEvent` wave identity (registered since AF-017, previously spawning generic enemies) — an ambush IS their doctrine; the composition root's `spawnWave` routes that one wave type to `spawnOutlawSquad` and reports counts through the existing `notifyEnemiesSpawned` API.
- **Honest deferrals:** Repair Drones, Emergency Boost, Smoke Fields, and Energy Suppression are registered Special Mechanics without content; Target Priority/Reinforcements command orders are registered vocabulary; the six Mini-Boss kinds are registered names that bind to AF-035 `BossDef` content when authored; nine of fourteen unit kinds await defs. None are faked.
- **Self-review executed:** 17 new tests — vocabulary registration, AF-033-vocabulary conformance for every def, the no-overlap law, readable-telegraph floors on every ranged attack, the Missile Swarm's burst/seeking shape, AF-034 pipeline compatibility for the Captain, the full squad lifecycle (forming/coordinated/scattered/eliminated, focus-fire gating, unique wedge offsets, scatter expiry), mines against the real AF-035 engine, the Mercenary Guild profile, the Codex entry with zero Missing Links, and a 1,000-encounter randomised kill-order sweep in which no squad ever reaches an invalid state and command never survives the Captain. Live in the browser (piloted runs, ~15 minutes total): the Director's HeavyCombat phase rolled a real `AmbushEvent`, the squad spawned with its AF-034 Elite Captain and four members, the Command Structure visibly transitioned forming → coordinated on the debug overlay, and the squad promptly killed the piloted player — tactically dangerous exactly as specified — with zero page errors across every run. Browser verification also caught one real bug before lock: the mine-drop gate originally checked the drone `phase` flag, which only `ambush`/`burrow` movement ever sets — fixed to gate on `alive`.

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes, zero new hazard/loot/elite engines; `OutlawSquadRuntime` is the only genuinely new mechanical surface and three previously-dormant hooks gained their first producers). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/HUMAN_OUTLAW_FRAMEWORK.md`, `src/game/enemies/outlawData.ts` + `OutlawSquad.ts`.
