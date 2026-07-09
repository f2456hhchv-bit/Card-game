## Verbatim prompt

97

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-096 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

AF-096 is now the permanent governing constitution for every future decision.

==================================================
OBJECTIVE
==================================================

Implement the complete Content Production Framework.

The architecture is now complete.

From this point onwards, development shifts from designing systems to producing world-class content using those systems.

Every Commander.

Every Ship.

Every Weapon.

Every Mission.

Every Biome.

Every Boss.

Every Relic.

Every line of lore.

Must be produced using one unified production pipeline.

==================================================
CORE PHILOSOPHY
==================================================

Consistency.

Efficiency.

Quality.

Scalability.

No handcrafted content should feel disconnected from the wider universe.

==================================================
MASTER CONTENT PIPELINE
==================================================

Every content asset progresses through:

Concept

↓

Lore

↓

Gameplay Role

↓

Visual Identity

↓

Audio Identity

↓

Mechanical Design

↓

Technical Implementation

↓

Accessibility Review

↓

Performance Validation

↓

Lore Validation

↓

Integration Testing

↓

Final Approval

↓

Production Lock

No content skips stages.

==================================================
SUPPORTED CONTENT
==================================================

Pipeline supports:

Commanders

Ships

Weapons

Enemies

Bosses

Biomes

Planets

Star Systems

Equipment

Relics

Research

Missions

Dialogue

Civilisations

Factions

Species

Resources

Structures

Events

Achievements

Codex Entries

Museum Entries

Future content extends naturally.

==================================================
CONTENT TEMPLATE
==================================================

Every asset contains:

Unique ID

Name

Classification

Purpose

Gameplay Role

Lore

Visual Identity

Audio Identity

Technical Requirements

Accessibility Notes

Performance Budget

Future Expansion Hooks

Relationships

Statistics

Nothing remains incomplete.

==================================================
CONTENT DEPENDENCIES
==================================================

Automatically validate compatibility with:

AF-000 through AF-096

Gameplay Systems

Lore

Timeline

Economy

Research

Build Diversity

Faction Identity

Campaign

Codex

Museum

Everything remains connected.

==================================================
IMPLEMENTATION ORDER
==================================================

Recommended production order:

Commanders

↓

Ships

↓

Weapons

↓

Equipment

↓

Relics

↓

Enemies

↓

Bosses

↓

Biomes

↓

Planets

↓

Civilisations

↓

Campaign Missions

↓

Lore

↓

Codex

↓

Museum

↓

Expansions

Production remains logical.

==================================================
CONTENT SCALE
==================================================

Architecture supports:

100+ Commanders

300+ Ships

1000+ Weapons

5000+ Equipment Modules

2000+ Relics

250+ Bosses

500+ Enemy Types

100+ Biomes

Thousands of Missions

Millions of Procedural Variations

Without redesign.

==================================================
AUTOMATED VALIDATION
==================================================

Every asset automatically checks:

Lore consistency

Faction consistency

Visual consistency

Gameplay uniqueness

Performance

Accessibility

Replayability

Technical compatibility

Failures return to production.

==================================================
QUALITY TARGET
==================================================

Every asset should feel:

Purposeful

Unique

Mechanically interesting

Visually memorable

Lore rich

Technically efficient

Future expandable

==================================================
DEVELOPER OUTPUT
==================================================

When generating content:

Produce complete production-ready assets.

Avoid summaries.

Avoid placeholders.

Avoid incomplete concepts.

Everything should be implementation quality.

==================================================
OUTPUT
==================================================

Produce the complete Content Production Framework.

Every future production module extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review the production pipeline.

Review scalability.

Review validation.

Review implementation quality.

Review accessibility.

Review technical consistency.

Review integration with AF-000 through AF-096.

Strengthen automation.

Reduce duplication.

Increase production efficiency.

Ensure every future asset generated for Afterlight reaches implementation quality while remaining fully consistent with the complete architecture established across all previous modules.

Repeat until the Content Production Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-097.

## Foundation / AF-000–096 / GP-FINAL alignment review

A third "meta" module, applying the AF-094/095 realisation-map pattern to content production rather than engineering or QA. No Debug section exists in this spec (like AF-096), so no `main.ts` wiring was performed — this is a real, tested TypeScript library for future content-authoring work, not a live runtime system. Research confirmed the honest current state: 17 of 22 Supported Content kinds already have a real registry (Planets, Dialogue, Species, item-level Resources, and authored Museum Entries are the 5 genuine gaps — Museum Entries are derived at call time by AF-088's `museumEntryFor`, not independently authored). The Content Template is deliberately a GENERIC 14-field completeness checker rather than 22 hand-authored per-kind profiles — proportionate to the module's own "framework, not content" scope, and the same profile-shape law AF-091/093 already proved for audio cues and UI interfaces. Content Scale reports real, cited current roster counts (verified against each roster's own test assertion, e.g. `tests/commanderRoster.test.ts`'s `LAUNCH_ROSTER.length===14`) against the spec's 8 targets — every count is honestly below target, with bosses (1/250) the furthest behind and enemy types (61/500) the closest. Automated Validation composes with real, imported functions from AF-092 (`colourSignaturesAreDistinct`), AF-094 (`ARCHITECTURE_PRINCIPLES`), and AF-095's lore/balance/accessibility/performance registries — genuine cross-module calls, not copied booleans — leaving only replayability honestly future (no metric exists anywhere in the codebase for it). Zero changes to any locked module (AF-000–096).

Score: 9.5/10 — approved and locked.
