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
| `shooter` | *(planned M2)* Keeps distance and fires projectiles. |

## Roster

| Id | Name | Behaviour | HP | Speed | Dmg | Radius | XP | Hue | Weight | Unlocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `drifter` | Drifter | chase | 10 | 58 | 6 | 13 | 1 | 280 | 100 | 0:00 |
| `mote` | Mote | chase | 5 | 84 | 4 | 9 | 1 | 200 | 60 | 0:30 |
| `husk` | Husk | chase | 34 | 44 | 12 | 18 | 3 | 24 | 45 | 2:00 |
| `lunger` | Lunger | charger | 22 | 70 | 14 | 14 | 3 | 340 | 35 | 3:30 |
| `wisp` | Wisp | orbiter | 16 | 96 | 8 | 11 | 2 | 160 | 30 | 5:00 |

- **Weight** = relative spawn frequency among currently-unlocked types.
- **Unlocks** = run-time minute the type begins appearing.

### Design intent
- **Drifter / Mote:** early fodder; Mote is faster but frail, teaching dodging.
- **Husk:** first "tank" — forces the player to commit damage, not just graze.
- **Lunger:** punishes standing still; introduces telegraph-reading.
- **Wisp:** punishes tunnel vision; can't be out-run in a straight line.

## Elites
Any archetype can spawn as an **elite**: larger, glowing, with a shadowed
outline and a health bar. Tanky, hit hard, and drop generous loot (heal/magnet/
bomb chances plus an 8× XP shard). Scheduled by the director roughly every
12–26s after the first minute.

## Planned (M2+)
- **Boss — "The Maw":** first scripted encounter with telegraphed attacks and
  phases. (Design TBD; tracked in Milestones M2.)
- **Ranged shooter archetype** with enemy projectiles.
