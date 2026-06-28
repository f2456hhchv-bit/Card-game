# AFTERLIGHT — Balancing Notes

**Last updated:** 2026-06-28

Tuning rationale and target curves. Numbers here mirror the data files; when you
change a constant, update both and note why below.

## Target run shape (M1)
- **0–2 min — Footing:** sparse Drifters/Motes. Player learns movement, gets
  first 3–5 levels and a second weapon. Death here should feel like a mistake.
- **2–5 min — Pressure builds:** Husks (tanks) and Lungers (telegraphs) arrive;
  first elites. First real power spike as a weapon hits L4–5.
- **5–8 min — The swarm:** Wisps join; surges become dangerous; screen fills.
  Build identity matters now.
- **8 min+ — Attrition:** HP scaling outpaces a thin build; survival is about
  positioning and a coherent build. Strong reference target: ~10 min.

A skilled run reaching ~10 minutes and an unskilled one ending ~2–3 minutes is
the intended spread for M1.

## Difficulty scaling (`SpawnDirector`)
| Lever | Formula | Rationale |
| --- | --- | --- |
| HP scale | `1 + m·0.28 + m²·0.018` | Gentle early, accelerating late so mastered weapons stay meaningful but can't trivialise minute 10. |
| Damage scale | `1 + m·0.12` | Linear; contact stays survivable with armor/positioning. |
| Spawn interval | `max(0.12, 0.72 − m·0.05)` s | Density rises smoothly to a floor that respects the cap. |
| Enemy cap | `min(900, 120 + m·70)` | Protects frame budget; 900 is the perf ceiling (see PerformanceLog). |
| Surge | every ~50s, 6s of ×2.6 rate | Punctuation — spikes that reward burst clear tools. |
| Elite cadence | every `max(12, 26−m)`s after 1 min | Steady elite pressure & loop of loot rewards. |

## Player baseline (`Player.base`)
- 100 HP, 175 move speed, 5% crit / ×1.5 crit dmg, 64 pickup radius.
- Move speed vs. enemy speeds: most enemies are slower (44–96) than the Warden
  (175) so you can *always* kite — the genre's core promise — but Wisps (96) +
  surges close the gap enough to threaten.

## Weapon philosophy
- Every weapon must be a *viable* primary on its own to L8, not just filler.
- Cooldowns shorten and counts rise with level so the *feel* escalates, not just
  the numbers.
- `attackSpeedMult` divides cooldown with a floor of 0.05s to prevent
  degenerate fire rates.

## XP curve
`round(5 + L·4 + L²·0.7)` — frequent early dopamine, gradual slow-down. If runs
feel too "drafty" late, raise the quadratic term; if power plateaus, lower it.

## Known tuning risks / to-watch
- Radiance + Resonator (Area) may over-scale; watch once evolutions land.
- Bomb drops from elites could trivialise surges if elite density gets high —
  revisit drop rates in M2.
- Orbit re-hit timer (0.35s) is a DPS lever that interacts with enemy density;
  validate at the enemy cap.

## Change log
- **2026-06-28** — Initial M1 tuning pass established (this document).
