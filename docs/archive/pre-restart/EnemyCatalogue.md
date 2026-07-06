# AFTERLIGHT — Enemy Catalogue

**Last updated:** 2026-06-28 · Source of truth: `src/game/data/enemyDefs.ts`

The Hollow: things born of the Umbral Tide, drawn to the Warden's light. All
stats below are at **reference difficulty (run start)**; the Spawn Director
scales HP and damage upward over time (see `docs/BalancingNotes.md`).

## Scaling formulas (`SpawnDirector`)
- **HP scale** = `1 + min·0.28 + min²·0.018` (≈1× at 0m, ≈2.5× at 5m, ≈6× at 12m)
- **Damage scale** = `1 + min·0.12`
- **Elite modifiers** = ×6 HP, ×1.8 damage, ×1.7 size, ×8 XP

## Behaviours
| Behaviour | Description |
| --- | --- |
| `chase` | Moves directly toward the Warden. The baseline threat. |
| `charger` | Drifts slowly, then periodically winds up and lunges fast. |
| `orbiter` | Circles the Warden while slowly closing — hard to corner. |
| `shooter` | ✅ Maintains a firing range, strafes, and looses aimed bolts. |

## Roster

| Id | Name | Behaviour | HP | Speed | Dmg | Radius | XP | Hue | Weight | Unlocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `drifter` | Drifter | chase | 10 | 58 | 6 | 13 | 1 | 280 | 100 | 0:00 |
| `mote` | Mote | chase | 5 | 84 | 4 | 9 | 1 | 200 | 60 | 0:30 |
| `husk` | Husk | chase | 34 | 44 | 12 | 18 | 3 | 24 | 45 | 2:00 |
| `lunger` | Lunger | charger | 22 | 70 | 14 | 14 | 3 | 340 | 35 | 3:30 |
| `wisp` | Wisp | orbiter | 16 | 96 | 8 | 11 | 2 | 160 | 30 | 5:00 |
| `caster` | Caster | shooter | 20 | 70 | 10 | 13 | 4 | 320 | 28 | 4:00 |
| `spore` | Spore | chase | 30 | 50 | 10 | 17 | 3 | 95 | 32 | 2:30 |
| `sporeling` | Sporeling | chase | 5 | 118 | 6 | 8 | 1 | 85 | — | split-only |
| `cinder` | Cinder | chase | 16 | 104 | 8 | 11 | 2 | 18 | 70 | 0:00 † |
| `revenant` | Revenant | shooter | 42 | 60 | 15 | 16 | 5 | 6 | 24 | 2:00 † |
| `shard` | Shard | chase | 18 | 110 | 9 | 11 | 2 | 195 | 70 | 0:00 ‡ |
| `colossus` | Colossus | charger | 52 | 74 | 18 | 19 | 6 | 210 | 22 | 2:00 ‡ |

- **Weight** = relative spawn frequency among currently-unlocked types.
- **Unlocks** = run-time minute the type begins appearing.
- **†** Ember Wastes (stage 2) · **‡** Hollow Deep (stage 3) natives — only spawn
  when that stage's enemy pool is active (`stageDefs.ts`). The roster a run draws
  from is the **stage pool** intersected with the time-unlock above, then scaled
  by the stage's **difficulty** multiplier (Ember ×1.35, Deep ×1.80).

### Design intent
- **Drifter / Mote:** early fodder; Mote is faster but frail, teaching dodging.
- **Husk:** first "tank" — forces the player to commit damage, not just graze.
- **Lunger:** punishes standing still; introduces telegraph-reading.
- **Wisp:** punishes tunnel vision; can't be out-run in a straight line.
- **Caster:** the first *ranged* threat — adds bullets to dodge, so the player
  can no longer treat empty space as safe. Strafes and keeps its distance.
- **Spore:** a slow lumpy sac that **bursts into 3 fast Sporelings** when killed
  (`splitInto`/`splitCount` in the def). Punishes ignoring it and creates sudden
  swarm pressure — killing it without AoE just trades one threat for three
  faster ones. Elite Spores don't split (avoids run-away counts). Sporelings are
  `summonOnly`, so the spawn director never spawns them directly.
- **Cinder (Ember Wastes):** fast, fragile hot-rusher — the Ember stage's fodder,
  quicker than a Drifter so the warm stage reads as more frantic.
- **Revenant (Ember Wastes):** a tanky ranged caster that keeps the player honest
  about cover on the open red plains.

## Elites
Any archetype can spawn as an **elite**: larger, glowing, with a shadowed
outline and a health bar. Tanky, hit hard, and drop generous loot (heal/magnet/
bomb chances plus an 8× XP shard). Scheduled by the director roughly every
12–26s after the first minute.

## Bosses ✅

Bosses are marquee, multi-phase encounters realised as a special `Enemy`
(`isBoss = true`) driven by the `BossController` state machine
(`src/game/systems/BossController.ts`). They are **immovable** (immune to
knockback and separation), wear a dedicated HUD health bar, and **telegraph**
every attack with a glowing wind-up ring so volleys are readable and fair.

- **Spawn cadence:** first boss at **3:00**, then every **3:00**. While a boss
  is alive, no new boss is scheduled. HP scales with encounter index and time.
- **On defeat:** a generous loot shower (14 XP shards + heal + magnet), big
  screen shake, and a triumphant audio flourish.

### The Maw — *Devourer of Light* (`theMaw`)
A slow, relentless mass of dark that spits hostile light. Three escalating
phases gated by HP:

| Phase | HP band | Attacks | On entry |
| --- | --- | --- | --- |
| 1 | 100–66% | Aimed spread, radial burst (cadence 2.6s) | — |
| 2 | 66–33% | + Spiral; faster bolts (cadence 2.0s) | Summons 4 Husks |
| 3 | 33–0% | Bigger bursts & spirals; fastest (cadence 1.5s) | Summons 6 Husks |

Base 1600 HP, contact damage 22, projectile damage 12 (all scale up). Tuning in
`src/game/data/bossDefs.ts`.

### The Choir — *Hollow Chorus* (`theChoir`)
A fast, hovering ring studded with glowing eyes (a visually distinct cyan
sprite). Where the Maw is a melee bruiser, the Choir is a **ranged terror**:
faster bullets (×1.3 speed), a tighter attack cadence (×0.82), and it summons
**Casters** (which themselves fire) on phase entry instead of melee Husks — a
very different, bullet-dense fight. Base 1450 HP, contact 18, projectiles 11.

### The Pyre — *Heart of Cinders* (`thePyre`) — Ember Wastes
The Ember stage's opening boss: aggressive and fast. Floods the arena with quick
**Cinders** (5 then 8 on phase entry) and the fastest bullets in the game
(×1.45 speed, cadence ×0.8). Base 1750 HP, contact 22, projectiles 13, hue 18.

### The Forge — *Anvil of the Dark* (`theForge`) — Ember Wastes
A slow, hulking siege engine (the tankiest boss, 2150 HP). Summons tanky ranged
**Revenants** and grinds the player down with heavy contact (26) and steady
fire. Hue 6 (deep red).

### The Rime / The Nadir — Hollow Deep (`theRime`, `theNadir`)
The frozen stage's bosses. **The Rime — Glacier Heart** is a fast cold front
(2600 HP) flooding the field with dense Shard swarms and the quickest ice bolts
(×1.5). **The Nadir — The Frozen Depth** is the tankiest encounter yet (3100 HP),
slow and dreadful, calving tanky Colossus titans.

Each **stage headlines its own bosses** via `StageDef.bossPool`, cycled by
encounter index (`bossForEncounter(index, pool)`): The Fade alternates The Maw /
The Choir; Ember Wastes alternates The Pyre / The Forge; Hollow Deep alternates
The Rime / The Nadir. Stage `difficulty` further scales boss HP/damage.

> The data/controller split (`bossDefs` tuning + shared `BossController`) plus
> per-stage `bossPool` lets new bosses be added with only new data + a sprite.

## Enemy projectiles ✅
Hostile projectiles (`EnemyProjectile`) are pooled and tested against the
Warden. Fired by Casters and bosses, they render as dark-cored hostile orbs to
read clearly against the Warden's bright light. See `World.fireEnemyProjectile`.
