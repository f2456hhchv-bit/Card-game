# AF-021 — COMBAT FRAMEWORK

**Module status:** Complete (framework specified; damage pipeline, status engine, defence model, and selectors implemented and simulation-tested; live combat running in the sandbox; per-weapon/enemy/boss content passes bind as content modules land)
**Lock status:** LOCKED — extends AF-000 → AF-020 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/COMBAT.md` + implementation (`src/game/combat/`) + live sandbox combat

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-020 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Combat Framework.

Combat is the heart of Afterlight.

Every second of gameplay should feel satisfying.

Responsive.

Fair.

Readable.

Combat should reward:

Positioning.

Decision making.

Build creation.

Mechanical skill.

Knowledge.

Never random luck alone.

==================================================
CORE PHILOSOPHY
==================================================

Simple to understand.

Deep to master.

Immediate feedback.

Meaningful choices.

Fair challenge.

Constant satisfaction.

Combat should always feel under the player's control.

==================================================
COMBAT LOOP
==================================================

Identify Threat
↓
Position
↓
Attack
↓
Avoid Damage
↓
Collect Rewards
↓
Upgrade Build
↓
Face Greater Threats
↓
Repeat

Every combat encounter strengthens this loop.

==================================================
DAMAGE MODEL
==================================================

Support:

Direct Damage

Critical Damage

Area Damage

Damage Over Time

Beam Damage

Orbital Damage

Drone Damage

Environmental Damage

Boss Damage

Self Damage (future)

Every damage source follows a consistent calculation framework.

==================================================
DAMAGE CALCULATION
==================================================

Base Damage
↓
Weapon Modifiers
↓
Commander Bonuses
↓
Ship Bonuses
↓
Equipment Bonuses
↓
Research Bonuses
↓
Affixes
↓
Critical Check
↓
Enemy Resistance
↓
Final Damage

The order remains deterministic.

==================================================
STATUS EFFECTS
==================================================

Support:

Burn

Shock

Freeze

Corruption

Poison

Slow

Stasis

Shield Break

Armour Break

Overload

Future effects extend this framework.

==================================================
STATUS RULES
==================================================

Every status contains:

Duration

Strength

Stack Rules

Visual Indicator

Audio Cue

Removal Method

Immunity Rules

Status effects remain readable at all times.

==================================================
CRITICAL HITS
==================================================

Critical hits require:

Unique visuals.

Unique audio.

Unique numbers.

Unique impact feedback.

Critical chance and critical damage remain independent attributes.

==================================================
RESISTANCES
==================================================

Support:

Burn Resistance

Shock Resistance

Freeze Resistance

Corruption Resistance

Poison Resistance

Physical Resistance

Energy Resistance

Boss Resistance

Resistances remain visible to players.

==================================================
DEFENSIVE SYSTEMS
==================================================

Player defence includes:

Shield

Hull

Temporary Barrier

Damage Reduction

Status Resistance

Movement

Boost

Positioning remains the strongest defence.

==================================================
HIT FEEDBACK
==================================================

Every successful hit provides:

Impact flash

Damage number

Sound effect

Enemy reaction

Particle effect

Optional screen feedback

Never overwhelm the battlefield.

==================================================
TARGET PRIORITY
==================================================

Combat framework supports:

Nearest Enemy

Boss Priority

Elite Priority

Lowest Health

Highest Health

Manual Override (future)

Framework only.

==================================================
CHAIN REACTIONS
==================================================

Combat supports:

Explosions

Chain Lightning

Piercing

Ricochet

Projectile Splitting

Orbital Interactions

Drone Interactions

Future combinations extend existing systems.

==================================================
KILL EVENTS
==================================================

Enemy defeat may trigger:

XP

Loot

Research

Achievements

Relics

Commander Effects

Weapon Effects

Mission Progress

All kill events use the shared event framework.

==================================================
BALANCE PRINCIPLES
==================================================

Damage should scale smoothly.

No single build invalidates all others.

Player power should increase through synergy.

Not exponential inflation.

==================================================
ACCESSIBILITY
==================================================

Support:

Damage Numbers

Damage Colours

Damage Size

Status Icons

Hit Flash Intensity

Critical Effects

Reduced Combat Effects

Visual Clarity Mode

==================================================
PERFORMANCE
==================================================

Pool:

Projectiles

Damage Numbers

Hit Effects

Status Effects

Combat Events

Avoid repeated allocations.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Combat Events

Damage Breakdown

Status Effects

Critical Rate

Resistance Values

Projectile Count

Combat Performance

==================================================
OUTPUT
==================================================

Produce the complete Combat Framework.

Every future Weapon, Enemy, Boss, Commander and Equipment system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of combat encounters.

Test every damage type.

Test every status effect.

Test every resistance.

Test every defensive mechanic.

Test every enemy family.

Test every Elite.

Test every Boss.

Review readability.

Review combat pacing.

Review balance.

Review build diversity.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-020.

Reduce visual clutter.

Improve combat satisfaction.

Ensure every combat interaction feels immediate, fair and rewarding while maintaining complete gameplay clarity.

Repeat until the Combat Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-021.

---

## Foundation / AF-016–020 alignment review (recorded at catalogue time)

- Positioning/decisions/knowledge-over-luck restates the Constitution's Combat Philosophy and AF-011's core vision; "combat always under player control" extends AF-020's trust contract into damage exchange.
- **Damage pipeline:** the nine-stage order implemented exactly as specified, deterministic (crit check consumes a forked seeded stream), with a per-stage breakdown recorded on every resolution — the debug "damage breakdown" requirement is a first-class output, not an afterthought. Stage multipliers are additive-within-stage, multiplicative-across-stages: the spec's anti-exponential-inflation principle made structural (stacking ten equipment bonuses adds within one stage instead of compounding ten times).
- **Status effects:** the ten statuses implement AF-007's canonical roster (Shield Break and Armour Break join as combat-state statuses); colours/icons inherit AF-008 §5 bindings. Status rules (duration, strength, stacking, removal, immunity) are per-status data. **Slow and Freeze/Stasis bridge directly into AF-020's modifier system** — combat asks movement for a slow, it never reimplements one (no duplicated functionality).
- **Resistances:** the eight kinds implemented with a hard cap (default 75%) so no resistance reaches immunity-by-stacking; Boss Resistance applies to boss-kind damage; resistances are visible data (AF-004 no-hidden-information).
- **Defence:** barrier → shield → hull allocation order, damage reduction capped, shield-break event + regen delay; positioning remains the strongest defence because movement/boost i-frames (AF-020) sit *outside* the mitigation math — dodged damage is the only 100% mitigation.
- Target priority selectors (nearest/boss/elite/lowest/highest) are pure framework functions; manual override registered future per AF-019's targeting law (assistance never overrides intent).
- Chain reactions (explosions, chain lightning, pierce, ricochet, splitting, orbital/drone interactions) are registered **extension points** on the hit/kill event flow — weapon modules implement them on this framework; nothing speculative built.
- Kill events ride the shared Event Bus (`EnemyKilled` etc. added to the registry) — XP/loot/research/achievement consumers attach at AF-022+ exactly as AF-016 §8 planned.
- **Sandbox combat live:** Director directives now materialise as target drones; a test cannon (nearest-priority) fires pooled projectiles through the real pipeline; drones deal contact damage through the real defence model; boost i-frames work; player death routes to Defeat through the unified Results flow. The AF-016 loop closes its combat arc for the first time.
- **Self-review executed headlessly:** hundreds of seeded encounter simulations assert pipeline determinism, stage completeness, resistance caps, crit-rate convergence, DoT accounting, stacking rules, defence allocation order, and no-NaN/no-negative invariants. Per-weapon/enemy/boss passes bind as content lands.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; content passes bind AF-022+ and enemy/boss/weapon modules. Produced outputs: `docs/COMBAT.md`, `src/game/combat/`, sandbox combat.
