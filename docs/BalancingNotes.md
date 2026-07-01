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

## Weapon evolution tuning (M2, first pass)
- Evolved forms are roughly **1.5–2× the base L8 damage** at their L1, scaling to
  a strong "Zenith" L5. They reuse base firing patterns, so the jump is in
  damage / count / pierce / area / cadence, plus a bigger visual identity.
- Eligibility = base weapon L8 **and** paired relic L3. The relic gate forces an
  intentional build path rather than an accidental evolution.
- **To watch:** evolved Aegis Corona (orbit) + high Area, and Solaris (aura) +
  Area, are the most likely to over-scale; validate at the enemy cap once boss
  pacing lands. Evolved Cataclysm knockback (200+) may trivialise surges —
  revisit alongside the boss.

## Boss & ranged tuning (M2, first pass)
- **The Maw:** 1600 base HP, ×(1 + encounter·0.85) per recurrence, slight time
  scale. Tuned so the first encounter at 3:00 is a ~20–40s damage check for a
  developing build, not a wall. Contact 22, projectiles 12 (both scale).
- **Telegraphs:** 0.7s → 0.5s wind-up across phases — long enough to read, short
  enough to stay tense. The boss slows to 20% speed while winding up so a volley
  is committed and dodgeable.
- **Boss bomb interaction:** a Bomb only deals 12% of boss max HP (no cheap
  one-shots); it still clears the surrounding swarm.
- **Caster (shooter):** keeps ~280 units range, fires every 1.9s. First ranged
  pressure; weight 28, unlocks at 4:00. **To watch:** Caster density during
  surges could create unfair bullet volume — cap concurrent casters if needed.

## New content tuning (M2, first pass)
- **Arc Coil (chain):** 8 dmg / 3 targets at L1 → 26 dmg / 9 targets at L8, with
  **0.88× damage falloff per jump** so long chains still contribute but aren't
  free. Leap range 180→270. Shines vs. dense crowds, weaker vs. spread-out or
  single targets — a deliberate trade against the single-target weapons.
- **Echo Stone (relic):** +1 projectile/level, **capped at 2** — it adds to
  *every* projectile weapon's count and to chain targets, so it's intentionally
  rare-tier and low-cap to avoid runaway scaling. **To watch:** Echo Stone +
  Prism Shards/Nova Pulse projectile counts at high levels.
- **Tidal Charm (relic):** +12% projectile speed/level — fills a stat that no
  relic previously touched; helps fast-moving targets and projectile uptime.
- **Tempest Coil (evolved chain):** 10→16 targets, fast cadence — strong AoE
  payoff; validate against the enemy cap during surges.

## Change log
- **2026-06-28** — Initial M1 tuning pass established.
- **2026-06-28** — Base pickup radius 64 → 80. Playtest showed XP felt lossy
  when moving in one direction early (you outrun shards before they home). A
  modest, universal generosity that improves early-game feel without
  trivialising Lodestone. Logged from a developer playtest.
- **2026-06-28** — Added first-pass tuning for the 5 evolved weapons (M2).
- **2026-06-28** — Added first boss (The Maw), Caster ranged enemy, and enemy
  projectiles with first-pass tuning (M2).
- **2026-06-28** — Added Arc Coil (chain) + Tempest Coil, and the Tidal Charm &
  Echo Stone relics with first-pass tuning (M2).

## Campaign to Galaxy 100 + rebalance for the three build ecosystems (2026-07-01)

With Commanders (specials), Ships (chassis passives), and 12×6 gear sets (6-piece
capstones), the player's power ceiling rose a lot. Player power is nonetheless
**bounded** (meta + gear grade/rarity/affix/set caps + Commander mastery cap +
one chassis + in-run level), so enemy scaling is tuned to *achievable* strength
rather than allowed to run away.

- **Finite campaign:** the run now ends at **Galaxy 100 · Sector 10** (1000
  Sectors). `GALAXY_COUNT`/`TOTAL_SECTORS`/`MAX_LEVEL` in campaignDefs; the map
  clamps its display, and clearing the finale shows a "Campaign Complete" toast.
- **HP difficulty curve** (`levelDifficulty`): reshaped from the old flat
  `1 + level*0.06` (which reached ~61× at level 999 — an unkillable wall) to
  `1 + level*0.025 + level²*8e-6`. Shape: G1 ≈ 1.0–1.2× · G10 ≈ 3.5× · G50 ≈ 15× ·
  G100 ≈ 33×. Gentle early (approachable for newer players progressing through),
  demanding but beatable at the finale.
- **Damage curve split** (`levelDamageDifficulty`): enemy *damage* now climbs
  **slower** than HP — `1 + level*0.015 + level²*3e-6` (~19× at G100 vs ~33× HP).
  Deep-Galaxy foes are bullet sponges you out-damage, not glass cannons that
  one-shot a maxed hull. Wired via a separate `damageDifficulty` in SpawnDirector
  and used for boss contact damage too.
- **Constants are deliberately easy to retune** from playtest feedback — the two
  curve functions are the single source of truth for campaign difficulty.

**To watch (needs live playtest):** the exact G80–G100 band for a fully-geared
mono-set + best-chassis + Commander build; boss HP totals at G100 (tanky but
should fall inside a Sector's fight, not a stalemate).
