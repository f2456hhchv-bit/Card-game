# AF-009 — TYPOGRAPHY, WRITING & COMMUNICATION FRAMEWORK

**Module status:** Complete (specification produced; live text review binds every future content module)
**Lock status:** LOCKED — extends AF-000 → AF-008 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/TYPOGRAPHY_WRITING.md` (the binding typography, writing and communication framework of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-008 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Typography, Writing and Communication Framework.

Every written word in Afterlight should reinforce the identity of the universe.

Players should immediately recognise the tone of Afterlight.

Text should be concise.

Elegant.

Meaningful.

Never unnecessarily verbose.

Gameplay always takes priority over lore.

==================================================
CORE PHILOSOPHY
==================================================

Clear.

Premium.

Immersive.

Respectful of the player's time.

Every sentence has purpose.

Information should be layered.

Players seeking deeper lore can always discover more.

==================================================
TYPOGRAPHY SYSTEM
==================================================

Primary Typeface

Modern Sans Serif

High readability

Supports Unicode

Secondary Typeface

Display Font

Titles only

Never used for body text

Monospace Typeface

Developer tools

Debug

Terminal interfaces

Future hacking systems

==================================================
TYPOGRAPHY HIERARCHY
==================================================

Display Title

Main Heading

Section Heading

Subheading

Body

Caption

Tooltip

Micro Text

Statistics

Numbers

Every size has fixed spacing rules.

==================================================
WRITING STYLE
==================================================

Gameplay

Short.

Direct.

Action-focused.

Examples

Shield Offline

Mission Complete

Research Ready

Boss Incoming

Lore

Hopeful.

Mysterious.

Scientific.

Melancholic.

Never melodramatic.

System Messages

Precise.

Neutral.

Professional.

==================================================
VOICE OF THE UNIVERSE
==================================================

The universe feels:

Ancient.

Beautiful.

Dangerous.

Recoverable.

The writing should communicate optimism despite overwhelming odds.

Technology feels rediscovered.

Never magical.

Always scientifically plausible.

==================================================
NAMING CONVENTIONS
==================================================

Weapons

Short memorable names.

Ships

Military or exploratory designations.

Commanders

Human names plus callsigns.

Research

Scientific terminology.

Biomes

Astronomical terminology.

Bosses

Mythic yet believable.

No joke names.

No internet slang.

==================================================
LORE STRUCTURE
==================================================

Layer One

Gameplay Summary

Layer Two

Short Description

Layer Three

Detailed Archive

Layer Four

Recovered Historical Records

Players choose their depth of engagement.

==================================================
TOOLTIPS
==================================================

Every tooltip contains:

Name

Purpose

Effect

Statistics

Synergies

Lore (optional)

Upgrade Information

Keep tooltips concise.

==================================================
MISSION TEXT
==================================================

Briefing

Objective

Threat Assessment

Expected Rewards

Mission Summary

Completion Report

Never exceed necessary length.

==================================================
ACHIEVEMENTS
==================================================

Title

Short Description

Completion Criteria

Lore (optional)

Clear.

Memorable.

==================================================
NUMERICAL PRESENTATION
==================================================

Always format consistently.

Examples

1,250

24%

+15%

1.25x

Use icons where helpful.

Never clutter interfaces.

==================================================
LOCALISATION
==================================================

Every string stored separately.

Support:

Pluralisation

Gender-neutral grammar where appropriate

Date formatting

Number formatting

Future voice localisation

Never hardcode text.

==================================================
ACCESSIBILITY
==================================================

Support:

Font Scaling

Line Spacing

Letter Spacing

Dyslexia-friendly fonts (future)

Subtitle scaling

Tooltip scaling

High readability at every size.

==================================================
DOCUMENTATION
==================================================

Every text element stores:

Unique ID

Category

Source

Translation Key

Version

Usage

Dependencies

==================================================
PERFORMANCE
==================================================

Cache localisation tables.

Lazy load lore.

Reuse text components.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Missing Strings

Translation Coverage

Text Overflow

Font Fallback

Localisation Status

Performance

==================================================
OUTPUT
==================================================

Produce the complete Typography, Writing and Communication Framework.

Every future piece of text extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every menu.

Review every tooltip.

Review every mission briefing.

Review every Codex entry.

Review every achievement.

Review every notification.

Review typography hierarchy.

Review readability.

Review localisation readiness.

Review accessibility.

Review consistency.

Review performance.

Remove unnecessary words.

Strengthen clarity.

Ensure every sentence contributes to gameplay, immersion or progression.

Repeat until the entire game speaks with one unified voice that is unmistakably Afterlight.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-008 alignment review (recorded at catalogue time)

- Concise, layered, player-time-respecting text restates the Constitution's Player Promise and AF-003's minimal-UX laws. Gameplay-over-lore priority consistent throughout. No conflicts with the world philosophy: "never magical, always scientifically plausible" restates the Constitution's World Philosophy verbatim.
- **Authorised amendment:** locked AF-002 §9 mandated one sans-serif family and "no decorative fonts anywhere". AF-009 (Project Owner authority) introduces a **secondary display typeface** — amendment applied to `docs/VISUAL_LANGUAGE.md` §9 with constraints preserving AF-002's intent: the display face must remain a modern sans in character (distinct weight/width, not decorative), used for Display Title / brand lockups only, never body text. Monospace added for dev/debug/terminal surfaces (player-facing only in future diegetic terminal interfaces).
- Typography hierarchy extends AF-002's five-level scale to ten named levels; existing levels keep their locked sizes (Main Heading 32 = former Title; Section Heading 24 = former Header; Body 16; Tooltip 14), new levels slot around them. Tabular numerals law (AF-002) now owns two dedicated levels (Statistics, Numbers).
- Tooltip content list adds Purpose + Effect to AF-003 §6's anatomy — superset of the locked component, same single component.
- Localisation architecture realises AF-001 §4's `src/data/localization/` placeholder: string IDs, ICU-style plural/gender support, locale-aware number/date formatting. "Never hardcode text" is the no-magic-numbers law applied to words.
- Naming conventions extend AF-006 §2 (asset IDs) with player-facing naming style per category; "no joke names, no internet slang" recorded as a hard content review rule.
- New canon: four-layer lore structure; mission text six-part structure; future systems referenced — Codex (AF-003 P4 reference class) and **future hacking/terminal interfaces** (monospace reserved for them; catalogued as future-flag, not committed content).

**Review verdict:** ALIGNED (one authorised amendment, recorded and constrained). Internal quality score 9.5/10 — approved. Produced output: `docs/TYPOGRAPHY_WRITING.md`.
