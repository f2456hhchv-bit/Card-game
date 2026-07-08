# AF-071 — COMMANDER FRAMEWORK

**Module status:** Complete (framework layered over AF-030's unchanged commander system; three fully profiled commanders; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-070 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/COMMANDER_ARCHITECTURE.md` + implementation (`src/game/commanders/commanderFrameworkData.ts`, `CommanderProgressionRuntime.ts`)

---

*(Module catalogued verbatim below.)*

71

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-070 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Commander Framework.

Commanders are not simply playable characters.

They define entire playstyles.

Every Commander should dramatically change how the player approaches combat, progression, exploration and build creation.

Changing Commander should feel as significant as changing class in a major RPG.

No Commander should ever become obsolete.

==================================================
CORE PHILOSOPHY
==================================================

Identity.

Mastery.

Replayability.

Build Diversity.

Meaningful Choice.

Every Commander must feel unforgettable.

==================================================
COMMANDER ARCHITECTURE
==================================================

Every Commander contains:

Identity

Background

Visual Design

Voice

Passive Trait

Primary Ability

Secondary Ability

Ultimate Ability

Commander Trait

Talent Tree

Mastery Track

Personal Missions

Lore

Relationships

Statistics

Cosmetics

Future Expansion Hooks

Nothing is left undefined.

==================================================
COMMANDER CLASSES
==================================================

Support:

Assault

Defender

Engineer

Scientist

Recon

Support

Hybrid

Experimental

Future archetypes extend naturally.

==================================================
PLAYSTYLE DESIGN
==================================================

Every Commander has:

Unique combat rhythm

Unique economy

Unique progression

Unique synergies

Unique weaknesses

Unique strengths

Unique build opportunities

No two Commanders should overlap excessively.

==================================================
ABILITY STRUCTURE
==================================================

Every Commander possesses:

Passive

↓

Ability One

↓

Ability Two

↓

Ultimate

↓

Signature Mechanic

↓

Mastery Passive

↓

Ascension Upgrade

Abilities interact with every gameplay system.

==================================================
TALENT TREES
==================================================

Each Commander receives:

Three Major Branches

Each branch contains:

Combat

Utility

Economy

Mobility

Specialisation

Endgame Node

Branches support hybrid builds.

==================================================
MASTERY
==================================================

Commander Mastery tracks:

Level

Challenges

Achievements

Statistics

Titles

Cosmetics

Lore

Historical Records

Mastery remains permanent.

==================================================
PERSONAL MISSIONS
==================================================

Every Commander includes:

Origin Story

Recruitment

Personal Objectives

Companion Missions

Legendary Mission

Final Resolution

Narrative strengthens attachment.

==================================================
COMMANDER PROGRESSION
==================================================

Unlock:

Talents

Voice Lines

Lore

Portraits

Cosmetics

Mastery Rewards

Legendary Variants

Progression remains meaningful.

==================================================
COMMANDER RELATIONSHIPS
==================================================

Support relationships with:

Other Commanders

Major Factions

Civilisations

Research

Story Events

Galaxy History

Relationships influence dialogue.

Not gameplay balance.

==================================================
STARTING ROSTER
==================================================

Initial release includes approximately:

12-16 fully unique Commanders.

Future expansions naturally increase roster size.

==================================================
COSMETICS
==================================================

Support:

Armour Variants

Portraits

Voice Packs

Colour Themes

Animations

Victory Poses

Ship Interiors

Cosmetics remain gameplay neutral.

==================================================
ACCESSIBILITY
==================================================

Support:

Ability previews

Talent recommendations

Large UI

Controller navigation

Touch navigation

Colour-blind support

Subtitle support

==================================================
PERFORMANCE
==================================================

Pool Commander effects.

Reuse shared animation systems.

Optimise ability logic.

Cache talent calculations.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Commander

Mastery

Talents

Abilities

Cooldowns

Statistics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Commander Framework.

Every future Commander extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every Commander.

Review uniqueness.

Review build diversity.

Review talent trees.

Review abilities.

Review progression.

Review cosmetics.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-070.

Remove overlapping mechanics.

Strengthen class identity.

Ensure every Commander feels capable of supporting hundreds of hours of experimentation while remaining balanced, memorable and mechanically distinct.

Repeat until the Commander Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-071.

---

## Foundation / AF-000–070 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-030's locked commander system is EXTENDED, byte-for-byte untouched:** its `CommanderDef`, ten-archetype shelf, four-hook ability signature, charge-gated ultimate, and fingerprint no-overlap law all stand. AF-071 layers `CommanderProfileDef` around each def BY ID — the wrapping pattern AF-056/057 used for the directors — and the eight spec classes map TOTALLY onto the locked archetype shelf (a naming layer, asserted). The roster extends additively: AF-030's sandbox pair remains the unmodified head of `FRAMEWORK_COMMANDERS` (asserted equal), joined by AF-071's scientist — Dr. Sen Vael, "Meridian", authored through AF-030's unchanged def shape — and all three pass AF-030's OWN `findOverlap` law with distinct fingerprints ("no two Commanders should overlap excessively", enforced by the code AF-030 shipped for exactly this).
- **"Nothing is left undefined" is a FUNCTION:** `architectureFor(def, profile)` returns a boolean per architecture part, and all SEVENTEEN are asserted true for every profiled commander — identity through future expansion hooks. The seven-stage ability structure is complete per commander: AF-030's four hooks are stages 1–5 (its signature mechanic IS the fifth), plus the new secondary ability (a plain AF-028 `ActiveModule`), mastery passive (a plain `CommanderPassive`), and the ASCENSION UPGRADE — stage seven — which unlocks a designated talent node FREE when AF-069's ascension level reaches the commander's gate, exactly once (tested below, at, and beyond the gate). Cross-module reuse, zero new stat systems.
- **Talent trees are AF-028 vocabulary:** three branches per commander, each carrying ALL SIX node kinds (asserted per branch), every node a real `EquipmentBonus` with a nonzero value (no dead nodes). "Branches support hybrid builds" is the DEFAULT: nodes unlock from any branch in any order (three-branch spread tested), and only the endgame node has a prerequisite — three owned nodes in its own branch — so specialisation is earned, never forced. "Cache talent calculations" (§Performance) is reference-equality tested: the aggregate is cached until the build changes and invalidates exactly then.
- **Mastery reuses AF-026's engine** (`commander:{id}` track IDs — and the composition root's `commander:placeholder` mastery feed became the REAL track, the placeholder finally paid off), personal missions advance strictly through the six registered beats then complete, and progression is append-only — no remove/respec operation exists (prototype-asserted, the AF-068/069/070 pattern; respec is a future Project-Owner decision, not an accidental capability).
- **"Relationships influence dialogue. Not gameplay balance." is unrepresentable:** a relationship is a subject (six registered) + a target id + a dialogue hint — key-inspection asserted, no bonus field exists. Every target resolves against REAL content (codex entries and commanders, resolution-tested — one authoring error, a nonexistent `codex-the-collapse`, was caught by exactly this test and corrected to the real `codex-galaxy-history`). Cosmetics are a kind (seven registered) + an id, gameplay-neutral by the same construction.
- **The 12–16 release roster is a registered TARGET** (`ROSTER_TARGET`), honestly distinguished from what ships: the framework proves the architecture on three fully profiled commanders (assault/defender/scientist — three different classes, three different ascension gates, fifty-four authored talent nodes); roster modules fill the target.
- **Self-review executed:** 13 new tests — all eight shelves plus the roster target, the total class→archetype mapping, the seventeen-part completeness function per commander, the seven-stage ability structure per commander, the extended-roster overlap law, the three-branch/six-kind/no-dead-node tree validation, hybrid-build and earned-specialisation behaviour, the bonus cache's reference semantics, strict six-beat mission ordering, dialogue-only relationships with full target resolution, the once-only AF-069-gated ascension upgrade with the no-removal prototype assertion, and a **1,000-career seeded sweep** of random grants and spends across all three commanders — the point ledger never drifts and every spent point is a live AF-028 bonus. **Live in the browser:** launched, and the extended commander line ran on the overlay — `Longlight (assault) · ability cd 0ms · ult 0/100 · talents 0/18 (0 pts) · mission originStory` — zero page errors.

**Review verdict:** ALIGNED (AF-030 unchanged; one profile layer + one pure progression runtime in the established wrapping class; AF-026's placeholder mastery track given its real producer; AF-069's ascension level given its first cross-module consumer; one roster addition in the standard additive class). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/COMMANDER_ARCHITECTURE.md`, `src/game/commanders/commanderFrameworkData.ts` + `CommanderProgressionRuntime.ts`.
