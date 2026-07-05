# AF-004 — GAMEPLAY READABILITY FRAMEWORK

**Module status:** Complete (specification produced; live-content review loop binds all future content modules)
**Lock status:** LOCKED — extends AF-000 → AF-003 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/READABILITY_FRAMEWORK.md` (the binding gameplay readability framework of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-003 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Gameplay Readability Framework.

This document governs every visual, audio and gameplay communication system.

Players must always understand:

• What is happening.
• Why it happened.
• What will happen next.
• What action they should take.

Gameplay clarity is the highest priority.

Spectacle never overrides readability.

==================================================
CORE PHILOSOPHY
==================================================

Readable.

Immediate.

Predictable.

Fair.

Consistent.

Every gameplay event must communicate itself clearly.

If a mechanic cannot be understood quickly, redesign it.

==================================================
PLAYER PRIORITY
==================================================

At every moment the player should instantly identify:

Own Ship
↓
Enemies
↓
Enemy Attacks
↓
Boss Mechanics
↓
Hazards
↓
Loot
↓
Objectives
↓
Visual Effects

Everything else is secondary.

==================================================
VISUAL COMMUNICATION
==================================================

Every gameplay object requires:

Unique silhouette.

Unique colour language.

Unique animation.

Unique sound.

Unique behaviour.

Unique purpose.

Objects should remain recognisable while moving at high speed.

==================================================
COLOUR LANGUAGE
==================================================

Green

Healing

Blue

Shield

Red

Immediate danger

Orange

Warning

Yellow

Loot

Purple

Void

Cyan

Technology

White

Neutral information

Colours remain consistent throughout the game.

==================================================
SHAPE LANGUAGE
==================================================

Friendly

Angular

Clean

Symmetrical

Enemy

Distinct silhouettes

Boss

Largest silhouette

Highest contrast

Loot

Simple glowing shapes

Hazards

Animated warning zones

==================================================
COMBAT FEEDBACK
==================================================

Every successful action produces feedback.

Examples

Weapon fired

Enemy hit

Critical hit

Shield damaged

Shield broken

Enemy defeated

Elite defeated

Boss damaged

Boss staggered

XP collected

Loot collected

Level Up

Ultimate ready

Every event should feel satisfying.

==================================================
BOSS TELEGRAPHING
==================================================

Every dangerous attack provides:

Animation.

Audio cue.

Ground indicator.

Charge timing.

Recovery window.

The player should understand every hit they receive.

==================================================
HUD COMMUNICATION
==================================================

Never duplicate information.

Only display information useful to the current moment.

Hide unnecessary UI.

Reveal contextual information automatically.

==================================================
NOTIFICATION RULES
==================================================

Short.

Clear.

Immediate.

Non-intrusive.

Stack intelligently.

Disappear automatically.

==================================================
ACCESSIBILITY
==================================================

Support

High Contrast

Reduced Effects

Reduced Flashing

Reduced Shake

Photosensitivity Mode

Colour Blind Modes

Visual Clarity Mode

Every gameplay mechanic must remain understandable.

==================================================
QUALITY CONTROL
==================================================

Every new gameplay feature must answer:

Can players identify it instantly?

Does it improve readability?

Does it support gameplay?

Does it remain visible during intense combat?

Does it follow Afterlight's visual language?

If any answer is "No"

Redesign it.

==================================================
PERFORMANCE
==================================================

Readability should not require expensive rendering.

Prioritise:

Simple effects.

Strong silhouettes.

Clear contrast.

Minimal overdraw.

Maintain:

60 FPS Desktop.

60 FPS Mobile.

==================================================
DEBUG
==================================================

Display

Combat Events

Visual Priority

Warning Queue

Danger Indicators

HUD Visibility

Performance

==================================================
OUTPUT
==================================================

Produce the complete Gameplay Readability Framework.

Every future gameplay mechanic, enemy, boss, weapon, HUD element, particle and visual effect extends this framework.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every gameplay mechanic.

Review every HUD element.

Review every visual effect.

Review every enemy.

Review every Boss.

Review every weapon.

Review every loot rarity.

Review colour language.

Review silhouettes.

Review combat readability.

Review accessibility.

Review performance.

Remove unnecessary visual noise.

Increase gameplay clarity.

Ensure every combat decision can be understood within two seconds.

Repeat until the entire game remains instantly readable during the most chaotic encounters.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-003 alignment review (recorded at catalogue time)

- Clarity-over-spectacle, telegraphed attacks, "understand every hit": direct extensions of the Constitution's Combat Philosophy (no cheap deaths, no hidden information) and AF-002's renderer-enforced rules. No contradictions.
- Player priority stack is compatible with AF-002 §6.5's fixed draw-layer order and AF-003 §2's information hierarchy; the framework document unifies all three into one attention model.
- **Colour reconciliation — RESOLVED by Project Owner ruling, 2026-07-05:** AF-004 names colour *families*; locked AF-002 assigned exact tokens. The initial reconciliation mapped healing → `crystal.teal` and shield → `plasma.cyan` within their families. The Project Owner overruled and authorised a palette extension instead: new tokens `vitality.green` `#4DE868` (healing) and `shield.blue` `#4D7CFF` (shields) added to AF-002's output. Remaining mappings stand: Loot = `solar.gold`; Void = `energy.violet`; Danger = `danger.red`; Warning = `warning.orange`; Technology = `plasma.cyan`/`energy.white`; Neutral = `energy.white`. Shape-pairing cues retained per the colour-blind law.
- Boss telegraph anatomy extends AF-002's two-phase grammar (orange windup → red commit) with audio cue, charge timing, and recovery window — extension, not redesign.
- Accessibility list restates the Constitution set; "every mechanic must remain understandable in every accessibility mode" recorded as a hard QA gate.
- Self-review loop items requiring live content (every enemy, boss, weapon, rarity) recorded as standing obligations binding every future content module at its QA stage, plus the global two-second rule.

**Review verdict:** ALIGNED (one documented reconciliation, owner-overridable). Internal quality score 9.5/10 — approved. Produced output: `docs/READABILITY_FRAMEWORK.md`.
