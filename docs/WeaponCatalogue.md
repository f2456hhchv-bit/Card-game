# AFTERLIGHT — Weapon Catalogue

**Last updated:** 2026-06-28 · Source of truth: `src/game/data/weaponDefs.ts`

Weapons fire automatically. Each has **8 levels**. Player stats modify all
weapons: `damageMult`, `attackSpeedMult` (shortens cooldown), `areaMult`,
`projectileSpeedMult`, and `extraProjectiles` (added to count for projectile
weapons). Crit is rolled per hit.

## Firing patterns
| Pattern | Behaviour | Implemented in |
| --- | --- | --- |
| `nearest` | Volley aimed at the nearest enemy; multi-bolt slight fan | `WeaponSystem.fireNearest` |
| `spread` | Fan of projectiles around aim direction | `WeaponSystem.fireSpread` |
| `radial` | Even burst in all directions (nova) | `WeaponSystem.fireRadial` |
| `orbit` | Persistent orbs circling the Warden, re-hit on a timer | `WeaponSystem.updateOrbit` |
| `aura` | Continuous damage field around the Warden | `WeaponSystem.fireAura` |

## Weapons

### Lumen Bolt — `nearest` · *starter*
Seeking bolts of focused light. Scales from a single bolt to a rapid
4-bolt piercing volley. The reliable backbone of any build.
- L1: 9 dmg, 0.85s, 1 bolt, pierce 1 → L8: 27 dmg, 0.44s, 4 bolts, pierce 4

### Prism Shards — `spread`
A widening fan of crystalline shards. Great area denial in front of you;
rewards facing into the swarm.
- L1: 7 dmg, 1.1s, 3 shards → L8: 20 dmg, 0.72s, 9 shards, pierce 3

### Warden's Halo — `orbit`
Orbs of light orbit the Warden, shredding anything that touches them. Pure
defensive zoning; never misses, always on.
- L1: 8 dmg, 2 orbs, r70 → L8: 26 dmg, 6 orbs, r104

### Nova Pulse — `radial`
A radial burst in every direction on a cooldown. Panic-clear and crowd control;
strong knockback buys breathing room.
- L1: 10 dmg, 2.4s, 6 rays → L8: 33 dmg, 1.4s, 18 rays, pierce 3

### Radiance — `aura`
A searing aura that burns all nearby Hollow continuously. Scales hard with Area;
pairs with anything that keeps enemies close.
- L1: 5 dmg/0.5s, r~96 → L8: 18 dmg/0.34s, large corona

> Full per-level tables live in `weaponDefs.ts`; that file is authoritative.

## Mastery
Reaching **level 8** is a weapon's "mastery" tier. In **M2**, a mastered weapon
paired with a specific relic will become eligible to **evolve** into a
signature, dramatically stronger form. Pairings are TBD and will be documented
here when implemented.

## Slots
Max **6 weapon slots** and **6 relic slots** per run. Once full, the draft only
offers upgrades to what you already own.
