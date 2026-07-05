# AF-013 — CONTENT GOVERNANCE FRAMEWORK

**Module status:** Complete (specification produced; content governance binds every future addition)
**Lock status:** LOCKED — extends AF-000 → AF-012 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/CONTENT_GOVERNANCE.md` (the content governance and scalability framework of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-012 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Content Governance Framework.

This document governs how Afterlight grows over time.

Every new feature.

Every expansion.

Every season.

Every biome.

Every weapon.

Every Commander.

Every asset.

Every line of code.

Must integrate into the existing architecture without requiring redesign.

The game should remain maintainable after ten years of development.

==================================================
CORE PHILOSOPHY
==================================================

Build once.

Extend forever.

Never replace.

Never duplicate.

Everything should remain modular.

Everything should remain expandable.

Every future addition should feel like it always belonged.

==================================================
MODULAR CONTENT
==================================================

Every content category must support unlimited expansion.

Ships

Weapons

Enemies

Bosses

Biomes

Commanders

Research

Relics

Equipment

Achievements

Lore

Events

Cosmetics

Music

Visual Effects

Audio

UI

Future systems extend existing frameworks.

==================================================
EXPANSION RULES
==================================================

Every new expansion must:

Respect existing canon.

Respect gameplay pillars.

Reuse existing systems.

Avoid feature duplication.

Avoid introducing conflicting mechanics.

Increase replayability.

Support future expansions.

==================================================
SYSTEM DEPENDENCIES
==================================================

Every new system documents:

Purpose

Inputs

Outputs

Dependencies

Events

Data

Extension Points

Performance Impact

Future systems should depend on interfaces.

Never concrete implementations.

==================================================
CONTENT PIPELINE
==================================================

Every new content addition follows:

Concept

↓

Specification

↓

Implementation Prompt

↓

Visual Design Board

↓

Asset Sheet

↓

Prototype

↓

QA

↓

Performance Validation

↓

Accessibility Validation

↓

Module Lock

No exceptions.

==================================================
CONTENT CATEGORIES
==================================================

Foundation

Gameplay

Progression

World

Narrative

Audio

Visual

UI

Technical

Developer

Community

Future expansions inherit this hierarchy.

==================================================
DEPRECATION POLICY
==================================================

Systems should never be removed.

If obsolete:

Archive.

Redirect.

Replace internally.

Maintain backwards compatibility where practical.

==================================================
SCALABILITY TARGETS
==================================================

Support:

500+ Weapons

300+ Enemies

150+ Bosses

100+ Ships

100+ Commanders

1000+ Equipment Items

Thousands of Relics

Unlimited Research Nodes

Unlimited Missions

Unlimited Galaxy Sectors

Architecture must not require redesign.

==================================================
CONTENT VALIDATION
==================================================

Every addition must answer:

Does it extend an existing system?

Does it duplicate another feature?

Does it improve replayability?

Does it respect readability?

Does it maintain performance?

Does it strengthen Afterlight's identity?

If any answer is "No"

Return for redesign.

==================================================
LIVE CONTENT
==================================================

Support:

Expansions

Seasonal Content

Community Events

New Galaxies

New Campaigns

New Civilisations

New Technologies

Offline game remains complete.

==================================================
DOCUMENTATION
==================================================

Every addition stores:

Module Reference

Version

Dependencies

Testing

Future Notes

Known Limitations

Expansion Hooks

Review History

==================================================
PERFORMANCE
==================================================

Every expansion must maintain:

Stable memory usage.

Minimal loading.

Efficient data management.

Object pooling.

Scalable save files.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Module Dependencies

Expansion Count

Unused Systems

Duplicate Content

Growth Metrics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Content Governance and Scalability Framework.

Every future Afterlight feature extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every completed AF module.

Review every dependency.

Review every expansion pathway.

Review every content category.

Review scalability.

Review modularity.

Review maintainability.

Review documentation.

Review performance.

Review future compatibility.

Identify duplicated concepts.

Merge overlapping systems.

Strengthen extension points.

Ensure the architecture can support a decade of expansion without structural redesign.

Repeat until every future feature has a clearly defined place within the Afterlight ecosystem.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-012 alignment review (recorded at catalogue time)

- Build-once/extend-forever restates the Constitution's Implementation Principles and AF-001's extension rules; the content pipeline restates the AF-012 lifecycle (ten stages here are the same sequence with the testing stages grouped — no stage removed). No contradictions.
- **Scalability targets are new binding canon** (500+ weapons, 300+ enemies, 150+ bosses, 100+ ships, 100+ Commanders, 1000+ equipment, thousands of relics, unlimited research/missions/sectors). Audited against AF-001: flat data records with stable IDs, registries, atlas pipeline, virtualised UI (AF-005 §10), lazy loading, and pooled runtime all scale to these numbers; **one gap found and closed** — collection/achievement save slices at thousands of items require compact ID-set representation, recorded in output §6 as a binding save-format rule (extension of AF-001 §8, not a redesign).
- **Live content reconciliation:** seasonal content and community events are supported with the Constitution's anti-FOMO laws applied — recorded in output §7: live content *adds*, never expires into inaccessibility; no mandatory participation windows for gameplay content; the offline game remains permanently complete (technology decision). Community events ride the future online layer (AF-001 §12) and never touch the offline core.
- Content categories (Foundation → Community) adopted as the taxonomy for all future AF modules; deprecation policy (archive/redirect, never remove) is consistent with save compatibility and the never-overwrite law.
- Cosmetics appear in the modular content list — consistent with AF-011 §8's "permitted in principle, not planned" ruling; the category exists structurally, its monetisation (if ever) stays owner-gated.
- **Whole-project duplication audit executed** (per self-review): reviewed AF-000 → AF-012 for overlapping systems — the AF-011 checklist unification already merged the evaluation instruments; single tooltip/notification/focus components (AF-003/AF-005), single palette registry (AF-008), single naming grammar (AF-006) hold; no duplicated concepts found requiring merge. Recorded in output review.

**Review verdict:** ALIGNED (one save-format rule added; live-content anti-FOMO reconciliation recorded). Internal quality score 9.5/10 — approved. Produced output: `docs/CONTENT_GOVERNANCE.md`.
