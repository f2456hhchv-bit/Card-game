# AF-072 — COMMANDER ROSTER

**Module status:** Complete (fourteen-commander launch roster on unchanged AF-030/071 shapes; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-071 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/COMMANDER_ROSTER.md` + implementation (`src/game/commanders/rosterData.ts`, `RosterRuntime.ts`)

---

*(Module catalogued verbatim below.)*

72

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-071 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Commander Roster.

This module defines how every Commander fits into the overall game ecosystem.

The goal is not simply to create many characters.

The goal is to create a roster where every Commander offers a fundamentally different way to play Afterlight.

No Commander should ever become a "beginner" or "late game" character.

Every Commander should remain viable forever.

==================================================
CORE PHILOSOPHY
==================================================

Identity.

Variety.

Replayability.

Expression.

Mastery.

The roster should encourage players to continually experiment.

==================================================
INITIAL ROSTER
==================================================

Launch with approximately:

14 Commanders

Each represents a different gameplay philosophy.

Suggested archetypes include:

Vanguard

Guardian

Engineer

Scientist

Scout

Hunter

Artillery

Technomancer

Drone Commander

Gravity Specialist

Crystal Resonator

Void Researcher

Prototype Pilot

Afterlight Operative

Every Commander remains unique.

==================================================
LONG-TERM ROSTER
==================================================

Architecture supports:

25+

50+

100+

Commanders

Future additions never require redesign.

==================================================
DESIGN RULES
==================================================

Every Commander must possess:

Unique Economy

Unique Combat Loop

Unique Scaling

Unique Synergies

Unique Weaknesses

Unique Progression

Unique Mastery

Players instantly recognise the difference.

==================================================
BUILD PHILOSOPHY
==================================================

Each Commander supports:

Multiple Weapon Types

Multiple Ship Types

Multiple Relic Paths

Multiple Talent Builds

Multiple Research Routes

Multiple Ascension Strategies

Build diversity remains extremely high.

==================================================
CLASS OVERLAP
==================================================

Avoid:

Duplicate abilities

Duplicate identities

Reskinned mechanics

Artificial complexity

Each Commander should solve problems differently.

==================================================
TEAM SYNERGY
==================================================

Future multiplayer compatibility supports:

Commander Roles

Support Bonuses

Ability Synergy

Team Composition

Revival Mechanics

Shared Objectives

Framework remains future-proof.

==================================================
AI COMMANDERS
==================================================

Support AI-controlled Commanders for:

Story Missions

Escort Missions

Simulation Battles

Future Co-op

AI follows the same rules as players.

==================================================
RECRUITMENT
==================================================

Commanders unlock through:

Campaign

Exploration

Story

Research

Legendary Missions

Hidden Discoveries

Faction Reputation

Recruitment feels meaningful.

==================================================
COMMANDER CUSTOMISATION
==================================================

Support:

Colour Schemes

Portrait Variants

Voice Packs

Animations

Ship Decorations

Callsigns

Background Stories

Victory Poses

Customisation never changes gameplay.

==================================================
COMMANDER STATISTICS
==================================================

Track:

Usage

Win Rate

Build Diversity

Favourite Weapons

Favourite Ships

Mission Success

Mastery Progress

Historical Records

Statistics inform future balancing.

==================================================
BALANCE PRINCIPLES
==================================================

Balance around:

Decision making.

Positioning.

Synergy.

Timing.

Knowledge.

Never raw damage alone.

Every Commander remains competitive.

==================================================
ACCESSIBILITY
==================================================

Support:

Recommended Builds

Beginner Guides

Ability Videos

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Subtitles

==================================================
PERFORMANCE
==================================================

Optimise ability systems.

Pool Commander assets.

Cache talent calculations.

Reuse shared animation graphs.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Commander Balance

Usage

Win Rate

Ability Statistics

Mastery

Performance

==================================================
OUTPUT
==================================================

Produce the complete Commander Roster Framework.

Every future Commander extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of hours with every Commander.

Review uniqueness.

Review balance.

Review build diversity.

Review talent choices.

Review progression.

Review recruitment.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-071.

Reduce overlap.

Improve identity.

Strengthen replayability.

Ensure every Commander feels capable of becoming a player's lifelong favourite while remaining balanced and offering genuinely different ways to experience Afterlight.

Repeat until the Commander Roster Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-072.

---

## Foundation / AF-000–071 / GP-FINAL alignment review (recorded at catalogue time)

- **The roster is DATA on unchanged shapes:** all fourteen commanders are AF-030 `CommanderDef`s with AF-071 `CommanderProfileDef`s — no type changed, no locked file touched. The AF-030/071 trio takes the first three seats (Longlight the VANGUARD, Ironhull the GUARDIAN, Meridian the SCIENTIST) and eleven new commanders fill the rest, one per remaining spec philosophy: Torque (engineer), Whisper (scout), Longfang (hunter), Thunderline (artillery), Cipher (technomancer), Aviary (drone commander), Keystone (gravity specialist), Chord (crystal resonator), Nadir (void researcher), Redline (prototype pilot), Relay (Afterlight operative). Philosophy assignment is a BIJECTION (asserted — fourteen commanders, fourteen philosophies, each taken once), and the philosophy shelf maps totally onto AF-030's locked archetypes.
- **"Every Commander remains unique" is asserted three ways:** AF-030's own `findOverlap` law across the full roster, fourteen distinct fingerprints, and a STRONGER roster rule — no two commanders share a (passive trigger, passive bonus kind) pair. "Duplicate abilities / duplicate identities / reskinned mechanics" are excluded by the strictest distinctness test in the codebase.
- **Every commander is COMPLETE and PLAYABLE:** all fourteen pass AF-071's seventeen-part `architectureFor` completeness function, and each one drives AF-071's unchanged `CommanderProgressionRuntime` in tests — a talent unlocks, its AF-028 bonus goes live, and the ascension upgrade fires at its gate (gates spread across Ascensions I–III).
- **Two AF-028 debts paid:** `droneEffectiveness` and `orbitalPower` were registered at AF-028 as "future — no producer". Aviary's flock and Thunderline's orbital batteries give them their FIRST producers (asserted by id), flowing through the same bonus aggregation as every other kind.
- **Recruitment is meaningful and TOTAL:** seven registered sources, every source recruiting at least one commander (asserted), the starting trio arriving with the campaign's opening, and every other requirement naming real content — AF-068 chapters, Hollow Crown, Prismheart's resonance well, the Mercenary Guild, legendary expeditions. `RosterRuntime` gates recruitment on reached sources, recruits append-only, and records usage/victories with win rate DERIVED, never stored (§Commander Statistics — "statistics inform future balancing" gets its inputs). The prototype exposes no remove/retire/nerf/buff operation: "every Commander remains viable forever" is a property of what the code cannot do.
- **"Never raw damage alone" is a shelf rule:** the five balance axes are decision making, positioning, synergy, timing, knowledge — and the test asserts raw damage is NOT on the shelf. Each commander's signature doctrine names its axis.
- **Future-proof registers:** six team-synergy kinds and four AI-commander contexts registered FUTURE (online/co-op stays the Constitution's optional later layer; the AI consumes the SAME def/profile shapes — no AI-specific stat type exists in the module), eight gameplay-neutral customisation kinds, eight statistic kinds on AF-026's vocabulary.
- **"25+/50+/100+ without redesign" is EXECUTED, not promised:** `syntheticCommanderFor(n)` deterministically generates roster entries on the same shapes forever; one hundred synthetics plus the launch roster produce 114 distinct fingerprints and 100 complete seventeen-part architectures through AF-030's and AF-071's unchanged functions.
- **Self-review executed:** 12 new tests — all seven shelves, the raw-damage exclusion, the total philosophy→archetype map, the fourteen-seat bijection, the triple-distinctness battery, per-commander completeness AND per-commander progression-runtime playability, the first-producer assertions, total recruitment with the append-only/no-retire runtime, the hundred-synthetic scalability proof, and a **1,000-season seeded sweep** of recruitment and play — the usage ledger never drifts, recruitment stays within bounds, and the starting trio never leaves. **Live in the browser:** launched, and the roster ran on the extended commander line — `Longlight (assault/vanguard) · talents 0/18 (0 pts) · mission originStory · roster 3/14 · uses 0 (0% wr)` — zero page errors.

**Review verdict:** ALIGNED (zero shape changes; fourteen commanders as pure data on AF-030/071's unchanged types; one pure recruitment/usage runtime in the ledger discipline; two dormant AF-028 bonus kinds given first producers; recruitment gated on real AF-068/exploration/faction content). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/COMMANDER_ROSTER.md`, `src/game/commanders/rosterData.ts` + `RosterRuntime.ts`.
