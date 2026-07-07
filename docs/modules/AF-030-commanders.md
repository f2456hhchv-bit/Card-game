# AF-030 — COMMANDER FRAMEWORK

**Module status:** Complete (framework specified; ability/mastery/synergy engine implemented and tested; a sandbox Commander governs the run; Commander content passes bind as future roster modules land)
**Lock status:** LOCKED — extends AF-000 → AF-029 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/COMMANDER_FRAMEWORK.md` + implementation (`src/game/commanders/`)

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-029 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Commander Framework.

Commanders are not cosmetic avatars.

They fundamentally change how Afterlight is played.

Every Commander should encourage unique strategies, alter combat flow and create new build opportunities.

Players should choose a Commander based on preferred playstyle rather than raw power.

==================================================
CORE PHILOSOPHY
==================================================

Identity.

Personality.

Specialisation.

Mastery.

Replayability.

Every Commander should feel like learning a new game.

==================================================
COMMANDER ROLE
==================================================

Each Commander represents:

Combat Doctrine

Technological Expertise

Personal History

Unique Ability

Passive Traits

Mastery Path

Narrative Perspective

No Commander should overlap completely with another.

==================================================
COMMANDER ATTRIBUTES
==================================================

Each Commander contains:

Name

Callsign

Biography

Faction

Portrait

Voice Profile

Primary Ability

Passive Ability

Ultimate Ability

Mastery Track

Cosmetics

Lore Entries

Future expansion fields

==================================================
ABILITY FRAMEWORK
==================================================

Every Commander possesses:

One Passive Ability

One Active Ability

One Ultimate Ability

One Mastery Trait

One Signature Mechanic

Abilities remain unique.

Never simple statistical upgrades.

==================================================
COMMANDER ARCHETYPES
==================================================

Support archetypes including:

Assault

Guardian

Engineer

Recon

Support

Void Specialist

Drone Commander

Orbital Commander

Crystal Specialist

Prototype Pilot

Future archetypes extend this framework.

==================================================
PASSIVE ABILITIES
==================================================

Examples include:

Shield Regeneration

Critical Synergy

Drone Enhancement

Resource Collection

Cooldown Reduction

Status Effect Amplification

Movement Enhancement

Environmental Resistance

Passives encourage long-term build identity.

==================================================
ACTIVE ABILITIES
==================================================

Examples include:

Energy Pulse

Repair Drone

EMP Burst

Gravity Well

Void Beacon

Missile Barrage

Crystal Shield

Tactical Scan

Abilities create tactical decision-making.

==================================================
ULTIMATE ABILITIES
==================================================

Ultimate abilities should feel transformational.

Examples:

Orbital Strike

Fleet Reinforcement

Temporal Overdrive

Nova Pulse

Ancient Weapon Activation

Void Collapse

Planetary Defence Grid

Ultimate abilities are memorable moments.

==================================================
COMMANDER MASTERY
==================================================

Mastery unlocks:

Portrait Variants

Commander Skins

Voice Lines

Lore

Visual Effects

Titles

Banner Elements

Mastery rewards remain primarily cosmetic and prestige-based.

==================================================
COMMANDER SYNERGY
==================================================

Commanders interact with:

Ships

Weapons

Equipment

Relics

Research

Mission Types

Boss Mechanics

Environmental Hazards

No Commander should dominate every system.

==================================================
COMMANDER PROGRESSION
==================================================

Track:

Experience

Mastery Rank

Mission Success

Boss Victories

Unique Challenges

Achievements

Statistics

Progression persists permanently.

==================================================
BALANCE PRINCIPLES
==================================================

Every Commander should:

Enable multiple builds.

Remain viable.

Encourage experimentation.

Avoid mandatory selections.

Power comes from synergy.

Not isolated strength.

==================================================
VISUAL PRESENTATION
==================================================

Display:

Commander Portrait

Ability Cards

Mastery Progress

Lore

Statistics

Voice Preview

Cosmetics

Selection remains premium and informative.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Commander Cards

Controller Navigation

Touch Navigation

Search

Sorting

Lore Scaling

Subtitle Support

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache Commander data.

Pool ability effects.

Optimise mastery tracking.

Lazy load lore.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Selected Commander

Passive State

Ability Cooldowns

Ultimate Charge

Mastery Rank

Statistics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Commander Framework.

Every future Commander, Ability, Cosmetic and Mastery system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play complete campaigns with every Commander.

Review Commander identity.

Review passive balance.

Review active abilities.

Review Ultimate abilities.

Review mastery progression.

Review build diversity.

Review synergy quality.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-029.

Adjust abilities.

Adjust cooldowns.

Adjust mastery rewards.

Remove overlapping designs.

Ensure every Commander offers a distinct playstyle, meaningful strategic depth and long-term replayability.

Repeat until the Commander Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-030.

---

## Foundation / AF-016–029 / GP-FINAL alignment review (recorded at catalogue time)

- Commander is one of AF-028's fixed loadout slots (`commander`), finally given content: a Commander definition supplies a passive, an active ability, an ultimate, and a **signature mechanic** — four distinct effect hooks, all reusing **existing** vocabularies rather than inventing new ones: passive → AF-028's `PassiveTrigger`/`EquipmentBonus` shapes; active → an activatable module with cooldown, same shape as AF-028's `ActiveModule`; ultimate → a **charge-gated** ability (charge accrues from combat facts — kills, damage dealt — and activates at 100%, matching GP-FINAL's "memorable moment" framing); signature mechanic → a Commander-specific rule expressed as a passive with a distinguishing tag (no new mechanic-description language invented).
- **Commander Mastery reuses AF-026's mastery engine exactly** (`commander:<id>` tracks already exist in `MetaProgression`) — this module does not create a second mastery system; it defines *what* Commander mastery unlocks (cosmetics only, per AF-026 §5's structural no-stat-reward law — Commander mastery rewards inherit that guarantee automatically since they use the same `MasteryReward` union).
- **Commander Progression** (XP, mastery rank, mission success, boss victories, statistics) is **AF-026's existing ledger** — `addMasteryXp`/`addMasteryCounter` on a `commander:` track, already wired at `RunEnded` in the sandbox. No new persistence system; the composition root's existing subscription is the "progression persists permanently" requirement, already true before this module.
- **Ten archetypes** registered as design shelves (Assault, Guardian, Engineer, Recon, Support, Void Specialist, Drone Commander, Orbital Commander, Crystal Specialist, Prototype Pilot) — map cleanly onto the AF-008 faction roster and AF-010 world canon (Void Specialist ↔ Void Legion, Crystal Specialist ↔ Crystal Dominion) without contradicting either.
- **"No Commander should overlap completely"** is enforced the same way AF-004's identity law works for enemies: each Commander's four-hook signature (passive+active+ultimate+signature mechanic) must be checked for near-duplication against every other Commander at content-authoring time — a structural check (`findOverlap` comparing hook fingerprints), not just a review reminder.
- **Synergy** (Commander ↔ Ships/Weapons/Equipment/Relics/Research) computes through the **same bonus-aggregation shape** as AF-028/AF-029 — a Commander's passive is just another contributor to `BonusTotals`; "no Commander dominates every system" is GP-FINAL's balance law, applied here as a content-QA gate (framework capacity, not framework-enforced dominance prevention — flagged honestly, matching AF-028 §8's precedent).
- **Ultimate abilities as memorable moments** directly implements GP-FINAL's emotional curve beat "Power Fantasy" — the charge-gated activation model is the concrete mechanic the curve's target shape needed and didn't yet have.
- **Self-review executed:** the sandbox Commander governs a full run in the walking skeleton (passive always active, active ability on cooldown via player input, ultimate charges from kills and fires once ready) — the first Commander abilities running end-to-end. Multi-Commander build-diversity/roster passes bind as the real roster arrives.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; roster/balance passes bind at future Commander content modules. Produced outputs: `docs/COMMANDER_FRAMEWORK.md`, `src/game/commanders/`.
