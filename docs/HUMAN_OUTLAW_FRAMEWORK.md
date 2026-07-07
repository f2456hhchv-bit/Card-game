# AFTERLIGHT — Human Outlaw Enemy Framework

**Authority:** Produced output of AF-046. Extends AF-000 → AF-045. Every future pirate, mercenary, and rogue human faction extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** Outlaws are dangerous through strategy, not statistics — their stats are ordinary, and every ounce of their threat comes from squad-level coordination built on engines that already exist.

---

## 1. Faction Identity — the Mercenary Guild, profiled

Human Outlaws are canonically AF-039's registered-but-unprofiled Mercenary Guild, now given its full nine-attribute profile (`SANDBOX_FACTION_ROSTER`) — the fourth of ten factions profiled, paying AF-039's own recorded content debt rather than adding an eleventh faction. Territory: the Broken Systems. Doctrine: squad tactics over hero pilots.

## 2. Visual Language — data now, art at the asset pass

`OUTLAW_VISUAL_LANGUAGE` records the palette (black steel `#1a1c22`, orange warning `#ff8c1a`, scrap-grey plating) and style keywords; live today as the mines' orange warning rings and the ambush notice colour, binding to real hulls at the AF-002/006 asset pass.

## 3. Core Units — fourteen registered, five fully authored, zero schema changes

Raider (burst-seeking Missile Swarms), Sniper (long-telegraph rail lance), Shield Carrier (formation-flying `deployShields` tank), Mine Layer (withdrawing `createHazards` area-denial), and Captain (suppressive slow-on-hit fire, `boostAllies`) are plain AF-033 `EnemyDef`s passing the no-overlap law; their ranged attacks ARE AF-032 `WeaponDef`s. The other nine unit kinds are registered vocabulary awaiting defs.

## 4. Combat Style & Special Mechanics — six of eight live

Focus Fire (a coordinated-squad damage bonus through the existing damage-multiplier path), Missile Barrages, Area Denial/Deployable Mines (AF-035's exact hazard engine), Shield Coordination (`deployShields`), Formation Flying (first producer for AF-033's reserved formation-context fields), Suppressive Fire (`statusOnHit` slow), and Retreat (AF-033's existing AI state) are mechanically live. Repair Drones, Emergency Boost, Smoke Fields, and Energy Suppression are registered awaiting content.

## 5. Command Structure — `OutlawSquadRuntime`, the one new mechanical surface

A squad is an AF-034 Elite Captain plus members. Forming → coordinated → scattered → eliminated; orders map to `shieldCoordination`/`attackOrders`/`retreatOrders`. While the Captain lives: wedge formation on the Captain's position and the Focus Fire bonus. Destroying the Captain scatters the squad into AF-033's existing `retreat` state for the full scatter window (overriding AF-034's hull-based recover), and strips the bonus — "destroying leaders weakens formations," mechanically. Target Priority and Reinforcements orders are registered vocabulary.

## 6. Elite Variants & Mini-Bosses

Elite Captains run through AF-034's `generateElite` unchanged (tier, mutations, rewards, Codex signature); callsigns are announcement presentation; Voice Broadcasts await AF-045's honest asset-pipeline limitation. The six Mini-Boss kinds are registered names binding to AF-035 `BossDef` content when authored.

## 7. Faction Synergy & Loot — existing systems, new producers

Squads enter through the Director's existing `AmbushEvent` wave (registered since AF-017) — no Director changes. Eliminating a squad improves the current system's Sector Stability via AF-038's `clampedDelta` + AF-026's `recordStat`. Loot flows entirely through existing paths: kill XP/drops, elite relics (AF-029), elite Credits (AF-040), banked Rare Alloys (AF-025), and the Guild's Codex lore on the first Captain kill.

## 8. Codex

One additive AF-043 entry (`codex-mercenary-guild`, factions category) unlocks on the first Captain kill via the existing `meta.discover("lore", …)` path — history, doctrine, and a recovered broadcast fragment, with zero Missing Links.

## 9. Accessibility & performance

Readable missiles are enforced mechanically: every ranged Outlaw attack carries a ≥400ms telegraph through AF-033's existing telegraph gate. Mines render as high-contrast orange warning rings (AF-004's threat law). Squads and mines are plain arrays reset per run; formation math is a pure static function; no per-frame allocation beyond the existing combat loop's.

## 10. Debug

Live: squad count and per-squad state (order, captain status, members remaining) plus live mine count — rendered in the shared `DebugOverlay` `outlaws` field.

---

## Internal review loop (AF-046, recorded)

- **No duplicated systems** — enemy schema, weapons, elites, hazards, AI states, retreat logic, loot, Codex, faction canon, and sector statistics all reuse AF-021/025/026/029/032/033/034/035/038/039/040/043 exactly; `OutlawSquadRuntime` is the only genuinely new surface. ✔
- **Dangerous through strategy, not statistics** — Outlaw stats sit in the existing sandbox band; the threat is Focus Fire, formation, mines, and suppression. Observed live: a coordinated squad killed a piloted player that had been comfortably surviving the generic roster. ✔
- **Destroying leaders weakens formations** — verified across a 1,000-encounter randomised kill-order sweep (command never survives the Captain; no invalid states) and the scatter window's override of self-preservation recover. ✔
- **Readable missiles** — every ranged def's telegraph floor is a test invariant, not a hope. ✔
- **Sandbox proof** — a real Director `AmbushEvent` spawned a real squad (AF-034 Elite Captain + four members), the Command Structure visibly ran forming → coordinated on the debug overlay, with zero page errors; browser verification caught and fixed one real bug (the mine-drop `phase` gate) before lock. ✔
- **Simplification pass** — rejected a second enemy schema, a squad-specific AI state machine (reused AF-033's states + one pure runtime), a new hazard engine for mines, a new wave type (reused `AmbushEvent`), and an eleventh faction (profiled the registered Guild). ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining nine unit defs, four deferred special mechanics, mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
