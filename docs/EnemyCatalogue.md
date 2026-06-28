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

- **Weight** = relative spawn frequency among currently-unlocked types.
- **Unlocks** = run-time minute the type begins appearing.

### Design intent
- **Drifter / Mote:** early fodder; Mote is faster but frail, teaching dodging.
- **Husk:** first "tank" — forces the player to commit damage, not just graze.
- **Lunger:** punishes standing still; introduces telegraph-reading.
- **Wisp:** punishes tunnel vision; can't be out-run in a straight line.
- **Caster:** the first *ranged* threat — adds bullets to dodge, so the player
  can no longer treat empty space as safe. Strafes and keeps its distance.

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

> M2 ships this one fully-realised boss; the data/controller split lets more be
> added with only new tuning. More bosses are tracked in the Roadmap.

## Enemy projectiles ✅
Hostile projectiles (`EnemyProjectile`) are pooled and tested against the
Warden. Fired by Casters and bosses, they render as dark-cored hostile orbs to
read clearly against the Warden's bright light. See `World.fireEnemyProjectile`.
