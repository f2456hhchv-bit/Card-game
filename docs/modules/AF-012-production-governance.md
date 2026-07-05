# AF-012 — DEVELOPMENT WORKFLOW & PRODUCTION GOVERNANCE FRAMEWORK

**Module status:** Complete (specification produced; the lifecycle binds every future AF module)
**Lock status:** LOCKED — extends AF-000 → AF-011 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/PRODUCTION_GOVERNANCE.md` (the production lifecycle and governance of Afterlight) + `docs/modules/STATUS.md` (living module registry)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-011 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Development Workflow and Production Governance Framework.

This document defines how Afterlight is designed, built, reviewed, tested, approved and released.

Every feature follows the same production lifecycle.

No feature may bypass this process.

The objective is to maintain AAA production quality throughout development.

==================================================
CORE PHILOSOPHY
==================================================

Plan.

Build.

Review.

Improve.

Approve.

Lock.

Repeat.

Quality is built into the process.

Never added afterwards.

==================================================
PRODUCTION PIPELINE
==================================================

Every feature follows this sequence:

Concept

↓

Technical Design

↓

Implementation Prompt

↓

Visual Design Board

↓

Asset Sheet

↓

Prototype

↓

Internal QA

↓

Performance Testing

↓

Accessibility Testing

↓

Balance Testing

↓

Final Approval

↓

Module Lock

No stage may be skipped.

==================================================
MODULE STRUCTURE
==================================================

Every AF module contains:

Objective

Design Philosophy

System Architecture

Implementation Rules

Performance Rules

Accessibility Rules

Debug Requirements

Output Requirements

Self Review Loop

Quality Score

Module Status

Lock Status

==================================================
PRODUCTION STANDARDS
==================================================

Every feature must be:

Modular

Reusable

Documented

Performant

Readable

Accessible

Scalable

Testable

Future-proof

==================================================
VERSION CONTROL
==================================================

Development Branch

↓

Feature Branch

↓

Internal Review

↓

QA Approval

↓

Release Branch

↓

Production

↓

Locked Module

Every approved version is archived.

==================================================
QUALITY GATES
==================================================

Every feature must pass:

Gameplay

Visual

Audio

Performance

Accessibility

UX

Lore

Technical Stability

Memory Usage

Documentation

Regression Testing

No feature progresses if any gate fails.

==================================================
TESTING REQUIREMENTS
==================================================

Every feature requires:

Unit Testing

Integration Testing

Gameplay Testing

Stress Testing

Performance Testing

Regression Testing

Accessibility Testing

Platform Testing

Save Compatibility Testing

Future Expansion Testing

==================================================
DOCUMENTATION
==================================================

Every feature documents:

Purpose

Dependencies

Data Structures

Events

Future Extensions

Known Limitations

Testing Results

Version History

Review History

==================================================
CODE REVIEW
==================================================

Every implementation must be reviewed for:

Readability

Maintainability

Naming

Architecture

Performance

Memory Allocation

Reuse

Documentation

Security

==================================================
DESIGN REVIEW
==================================================

Every gameplay feature reviewed for:

Fun

Replayability

Clarity

Balance

Visual Identity

Audio Identity

Player Motivation

Long-term Value

==================================================
CONTENT APPROVAL
==================================================

Every asset reviewed for:

Afterlight Identity

Readability

Naming

Organisation

Performance

Accessibility

Reuse

Consistency

==================================================
PERFORMANCE TARGETS
==================================================

Desktop

120 FPS Preferred

60 FPS Minimum

Steam Deck

60 FPS

Mobile

60 FPS Target

Loading

Minimal

Memory

Efficient

Object Pooling

Mandatory

==================================================
RELEASE READINESS
==================================================

Before release verify:

No Critical Bugs

No Save Corruption

No Broken Progression

No Missing Assets

No Blocking Performance Issues

No Accessibility Regressions

No Canon Conflicts

==================================================
MODULE LOCKING
==================================================

Once approved:

Assign Version

Archive Documentation

Lock Module

Future modules may extend.

Never overwrite.

Only unlock by explicit project owner approval.

==================================================
DEBUG
==================================================

Display:

Module Version

Review Status

QA Status

Performance Status

Regression Status

Approval Status

Lock Status

==================================================
OUTPUT
==================================================

Produce the complete Development Workflow and Production Governance Framework.

Every future AF module follows this production lifecycle.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review the entire production pipeline.

Review every quality gate.

Review documentation quality.

Review module consistency.

Review testing coverage.

Review performance standards.

Review accessibility compliance.

Review release readiness.

Review version control.

Review locking procedures.

Remove unnecessary workflow.

Strengthen repeatability.

Ensure every feature can move from concept to production using the exact same repeatable process.

Repeat until the workflow supports years of professional game development without requiring structural changes.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-011 alignment review (recorded at catalogue time)

- The twelve-stage pipeline extends the Constitution's eleven-stage Development Pipeline by naming Technical Design and Balance Testing as explicit stages (both implicit before) — extension, not contradiction; no stage removed, none skippable.
- The eleven quality gates are a production-grade superset of AF-011 §6's seven (adds Audio, Technical Stability, Memory Usage, Documentation, Regression). Reconciliation: AF-011's seven remain the *design feature* gates; AF-012's eleven are the *production release* gates that contain them. Recorded in output §4.
- Module structure (twelve sections) matches the cataloguing format already in use (status/lock headers, alignment review, self-review with score) — formalised as the template for all future modules.
- Version control workflow mapped onto the project's real git model (feature branches → review → main; release branches at milestones; annotated tags archive locked module versions) consistent with AF-006 §4.
- Testing requirements mapped to the stack: Vitest unit/integration, deterministic headless-sim gameplay/stress/balance runs (enabled by AF-001's architecture), Playwright platform matrix, save-migration round-trip tests (AF-001 §8), CI as the enforcement point (AF-006 §10 pattern).
- Documentation requirements extend AF-001 §13's per-system README standard with testing results, version history, review history.
- Release readiness checklist incorporates canon conflicts (AF-010) and accessibility regressions — first checklist tying release to the ledger.
- Debug requirements realised now as `docs/modules/STATUS.md` (living registry of every module's version/status/lock), and later as a build-info panel in the debug overlay.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved. Produced outputs: `docs/PRODUCTION_GOVERNANCE.md`, `docs/modules/STATUS.md`.
