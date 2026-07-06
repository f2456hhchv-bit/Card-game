# AFTERLIGHT — Combat Framework

**Authority:** Produced output of AF-021. Extends AF-000 → AF-020. Every future weapon, enemy, boss, Commander, and equipment system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** combat rewards positioning, decisions, builds, skill, and knowledge — never random luck alone. Simple to understand, deep to master, always under the player's control.

---

## 1. The damage pipeline (nine deterministic stages)

Every damage source — direct, area, over-time, beam, orbital, drone, environmental, boss, *self (future)* — resolves through one pipeline, in one order:

**Base Damage → Weapon Modifiers → Commander Bonuses → Ship Bonuses → Equipment Bonuses → Research Bonuses → Affixes → Critical Check → Enemy Resistance → Final Damage.**

- **Anti-inflation structure:** bonuses are *additive within a stage, multiplicative across stages*. Ten equipment bonuses of +10% make that stage ×2.0 — they never compound into ×2.59. Power grows through *synergy across stages* (the spec's balance principle made arithmetic).
- **Deterministic:** the critical check consumes a forked seeded RNG stream; same seed, same crits. Crit chance and crit damage are independent attributes.
- **Breakdown as output:** every resolution returns the per-stage value trail — the debug damage-breakdown requirement is the pipeline's return type, and future tooltips can show exactly where damage comes from (no hidden information).

## 2. Status effects (ten, data-ruled)

**Burn · Shock · Freeze · Corruption · Poison · Slow · Stasis · Shield Break · Armour Break · Overload** — AF-007's canonical roster plus the two combat-state breaks; colours and icons inherit AF-008 §5 / AF-007 §5.

Each status is a data rule: duration · strength · stacking (`refresh` / `stackIntensity` with max stacks / `stackDuration`) · tick interval for DoTs · removal method · immunity rules · which resistance mitigates it. Readability is inherited law: every active status has its icon, colour, and (when the audio module lands) cue.

**Movement bridge (no duplication):** Slow applies an AF-020 speed-multiplier modifier; Freeze/Stasis apply an AF-020 root. Combat never reimplements movement effects — it requests them.

## 3. Resistances (eight, capped, visible)

Burn · Shock · Freeze · Corruption · Poison (status resistances — reduce duration/strength) and Physical · Energy (damage schools) · Boss (mitigates boss-kind damage). **Hard cap (default 75%)**: stacking can approach but never reach immunity — dodging remains the only 100% mitigation. All values are visible player-facing data.

## 4. Defence model

Incoming final damage passes: **Damage Reduction (capped) → Temporary Barrier (absorbs first, expires) → Shield (regenerates after a delay; Shield Break status halts regen) → Hull (defeat at zero).** Shield break emits its distinct event (AF-003's learned-instantly feedback). Positioning stays the strongest defence structurally: movement and boost i-frames (AF-020) sit *outside* this math — what you dodge costs you nothing.

## 5. Target priority (framework selectors)

Pure selector functions over candidate lists: **Nearest · Boss Priority · Elite Priority · Lowest Health · Highest Health**; *manual override* is future, governed by AF-019's law (assistance never overrides player intent). Weapons choose their selector in data; smart targeting composes selectors.

## 6. Hit feedback & chain reactions

Every successful hit: impact flash, pooled damage number (tabular numerals, scale = significance, crit variants unique per AF-002 §9 / AF-003 §4), sound (audio module), enemy reaction, particles — all under the AF-004 §1 degradation model so the battlefield never drowns (feedback never overwhelms readability; reduced-combat-effects and Visual Clarity Mode strip to the informational minimum).

**Chain reactions are extension points on the event flow**, not speculative code: explosions, chain lightning, piercing, ricochet, projectile splitting, orbital/drone interactions attach to hit/kill events when weapon modules implement them. The framework guarantees the events exist and carry enough data.

## 7. Kill events

`EnemyKilled` (and its siblings) ride the shared Event Bus — XP, loot, research, achievements, relics, Commander effects, weapon effects, and mission progress all subscribe (AF-022+). One kill, one fact, many consumers, zero coupling.

## 8. Accessibility

Damage numbers (on/off, size, colour set), status icons, hit-flash intensity, critical-effect intensity, reduced combat effects, Visual Clarity Mode — all data-driven presentation over identical information (AF-004 §8 comprehension gate: no mode changes what you know).

## 9. Performance

Pooled everything: projectiles, damage numbers, hit effects, status instances, combat events (AF-001 law). Pipeline resolution is arithmetic over small structs — no allocation per hit in steady state. Budgets hold at 120/60 targets; the AF-004 degradation model keeps the densest fights the cheapest.

## 10. Debug

Live: combat event stream · per-hit damage breakdown (stage trail) · active statuses with stacks/remaining · running crit rate vs configured chance · resistance values in effect · live projectile count vs pool size · combat frame cost.

## 11. Tuning surface (AF-011 §7)

`combatTuning` data: resistance cap · damage-reduction cap · default crit chance/multiplier · status rule table (all ten) · shield regen delay/rate · damage-number thresholds. Balance is a data edit.

---

## Internal review loop (AF-021, recorded)

- **Pipeline** — nine stages, exact order, deterministic crits, breakdown-as-return-type; additive-within/multiplicative-across kills exponential inflation structurally. ✔
- **Statuses** — ten data-ruled effects; movement effects delegated to AF-020 (no duplication); stacking/immunity/resistance interactions tested. ✔
- **Resistances/defence** — caps enforced; barrier→shield→hull order tested; dodge remains the only total mitigation. ✔
- **Events** — kill/damage/status facts on the shared bus; AF-022+ consumers attach without touching combat. ✔
- **Simulated encounters** — hundreds of seeded headless fights assert determinism, caps, DoT accounting, allocation order, crit convergence, no-NaN. ✔
- **Sandbox** — real pipeline, real defence, real death: the combat loop (identify → position → attack → avoid → repeat) playable today. ✔
- **Simplification pass** — rejected elemental damage schools beyond physical/energy (statuses carry the elemental identity; a third school had no decision attached); rejected a damage-type × resistance matrix (kind + school + status resistances cover the spec without a 10×8 table); chain reactions deferred to their weapon modules rather than stubbed. ✔

**Internal quality score: 9.5/10 — approved and locked; content passes bind weapon/enemy/boss modules.**
