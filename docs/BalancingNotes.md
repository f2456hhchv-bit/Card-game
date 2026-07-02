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

## Campaign wave rework (2026-07-02)

Every Sector is now a ~5-minute, ten-wave fight ending in a boss (no more
survive-the-timer clears):

- **Waves 1–9**: opening burst (`waveBurstCount = 6 + wave*2`) + director trickle.
  Per-wave multipliers on top of Sector difficulty: HP `1+(w-1)*0.09` (→1.72 at
  wave 9), damage `1+(w-1)*0.05` (milder — sponges, not one-shots), spawn rate
  `1+(w-1)*0.06`. Tuned against in-run levelling (~L8–12 by wave 10 early on).
- **Pacing**: `WAVE_DURATION = 25s` auto-advance, `WAVE_MIN_TIME = 8s` then an
  early advance when the field is (nearly) cleared — strong builds accelerate
  the Sector instead of waiting out timers. Chosen over a flat 20s (too rushed
  when swarmed) and 30s (dead air for strong builds).
- **Wave 10 = the Sector boss.** Every Sector ends with a boss kill. Bosses now
  cycle the Galaxy pool by Sector (variety back-to-back). Milestone Sectors keep
  elite bosses: Sector 5 ×1.2 HP, Sector 10 (Galaxy finale) ×1.5 HP.
- **Reward**: levelReward base raised 30→60 for the longer Sector.

**To watch:** whether wave-9 pressure at G30+ outpaces mid-Sector levelling, and
whether 25s feels long on cleared-but-not-quite fields (the ≤2-enemies early
advance may want loosening to ≤4).

## Wave 7/8 difficulty spike fix (2026-07-02, playtest)

Player report: "gets quite hard at wave 7/8". Root cause: **double ramp** — the
per-wave multipliers stack on the director's elapsed-time scaling, which was
tuned for 10–20-minute survival runs and reaches ~2.1× HP just ~3 minutes into
a Sector. Two changes:

- **Campaign time dilation**: the director's clock runs at 0.55× inside a
  Sector (`World.directorElapsed`), so Sector difficulty comes from the waves,
  not the survival-mode ramp. Applied to trickle, bursts and boss summons;
  boss HP/projectile time factors (small) stay on real time.
- **Gentler wave layer**: HP +9%→+7%/wave, damage +5%→+3.5%/wave (rate kept at
  +6% — pressure via count is fun; deaths came from stat inflation).

Net at wave 8 (~3.2 min in): fodder HP 3.39×→2.31× (−32%), damage 1.95×→1.53×
(−22%). Waves 1–3 nearly unchanged. Other modes untouched (dilation is
campaign-only; wave mults don't apply outside campaign).

## Light Mote field-drop economy (2026-07-02)

Motes now also drop physically in-run (gold octagon pickup): fodder 1.2% × 1,
elites a guaranteed +3, bosses +6 in the loot shower. Collected Motes are added
to the run's payout base (death **and** Sector-clear) so they ride the Fortune
multiplier. Expected extra income: ~1 Mote per ~83 fodder kills + 3/elite +
6/boss ≈ +10–25 per mid-game run — a visible "coins on the floor" reward loop
without inflating the meta-upgrade curve (costs unchanged). To watch: if
Supply-Drop chasing gets too fast late-game, trim the elite purse to +2.
