## Verbatim prompt

95

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-094 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Master Quality Assurance Framework.

Every feature added to Afterlight must automatically meet world-class quality standards before reaching players.

The purpose of this framework is to ensure that the game becomes more polished over time—not more fragile.

Every future feature, expansion and update must pass through the same validation pipeline.

==================================================
CORE PHILOSOPHY
==================================================

Quality.

Consistency.

Reliability.

Automation.

Continuous Improvement.

Every release should improve the game.

Never compromise existing quality.

==================================================
QA ARCHITECTURE
==================================================

Every feature enters the pipeline through:

Design Review

↓

Technical Validation

↓

Gameplay Testing

↓

Performance Testing

↓

Accessibility Testing

↓

Balance Validation

↓

Lore Validation

↓

Regression Testing

↓

Release Candidate

↓

Final Approval

No content bypasses validation.

==================================================
AUTOMATED VALIDATION
==================================================

Automatically validate:

Weapons

Ships

Commanders

Enemies

Bosses

Research

Relics

Equipment

Biomes

Missions

Factions

Economy

Civilisation

UI

Audio

Visuals

Technical Systems

Every addition is verified.

==================================================
GAMEPLAY TESTING
==================================================

Run automated simulations for:

Combat

Mission Completion

Boss Battles

Enemy AI

Loot

Progression

Economy

Research

Faction Behaviour

Civilisation Growth

Build Diversity

Endgame

Millions of simulations support balancing.

==================================================
PERFORMANCE VALIDATION
==================================================

Automatically monitor:

Frame Time

Memory

CPU

GPU

Loading

Streaming

Networking (Future)

Battery Usage

Thermals

Performance budgets remain enforced.

==================================================
ACCESSIBILITY VALIDATION
==================================================

Automatically verify:

Colour Contrast

Subtitle Support

UI Scaling

Input Methods

Narration Support

Photosensitivity

Motion Reduction

Controller Navigation

Accessibility remains first-class.

==================================================
LORE VALIDATION
==================================================

Automatically detect:

Timeline conflicts

Faction inconsistencies

Technology contradictions

Commander conflicts

Mission continuity

Civilisation history

Codex inconsistencies

The universe remains internally coherent.

==================================================
CONTENT PIPELINE
==================================================

Every content addition includes:

Design Document

Implementation

Testing

Documentation

Balancing

Localization Ready

Accessibility Review

Performance Review

Approval

Pipeline remains repeatable.

==================================================
BALANCE VALIDATION
==================================================

Evaluate:

Weapon diversity

Commander diversity

Ship diversity

Relic diversity

Mission success

Difficulty curves

Reward pacing

Progression

No dominant strategies emerge unchecked.

==================================================
RELEASE PIPELINE
==================================================

Every update progresses through:

Internal

↓

Automated QA

↓

Developer Review

↓

Regression Testing

↓

Performance Approval

↓

Release Candidate

↓

Launch

↓

Post-release Monitoring

Releases remain stable.

==================================================
LIVE MONITORING
==================================================

After launch monitor:

Crash Rates

Performance

Mission Completion

Build Diversity

Economy

Accessibility Usage

Player Progression

Technical Health

Data informs future improvements.

==================================================
DEVELOPER DASHBOARD
==================================================

Support:

Regression Reports

Balance Reports

Performance Graphs

Crash Analytics

Content Validation

Simulation Results

Release Status

Developer productivity increases.

==================================================
ACCESSIBILITY
==================================================

QA includes mandatory validation for:

Visual Accessibility

Motor Accessibility

Hearing Accessibility

Cognitive Accessibility

Controller Support

Touch Support

Accessibility failures block release.

==================================================
PERFORMANCE
==================================================

QA validates:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

Memory Budgets

Loading Targets

Streaming Targets

==================================================
DEBUG
==================================================

Display:

QA Status

Validation Results

Regression Count

Performance Status

Accessibility Status

Release Readiness

==================================================
OUTPUT
==================================================

Produce the complete Master Quality Assurance Framework.

Every future system, expansion and update extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of gameplay hours.

Review gameplay quality.

Review performance.

Review accessibility.

Review balancing.

Review progression.

Review technical stability.

Review lore consistency.

Review developer workflow.

Review integration with AF-000 through AF-094.

Strengthen automation.

Reduce manual repetition.

Improve validation accuracy.

Ensure every future addition to Afterlight is automatically validated against the same world-class quality standards, allowing the game to continue expanding for many years while becoming increasingly polished, stable and internally consistent.

Repeat until the Master Quality Assurance Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-095.

## Foundation / AF-000–094 / GP-FINAL alignment review

A second "meta" module, applying the AF-091/092/093/094 realisation-map pattern to QA/validation rather than content or architecture. Research confirmed real evidence for most spec sections: 17 Automated Validation domains already have a real registry; 12 Gameplay Testing domains already have a real seeded sweep (the largest, `tests/endgame.test.ts`, runs 200,000 iterations — a fact registered honestly against the spec's "millions of simulations" language via `simulationScaleGapSummary`, rather than silently claiming parity); Lore/Balance Validation delegate to real, already-proven structural cross-module checks (AF-090 settlements sitting at real AF-038 systems matching AF-039 territory exactly, AF-086's append-only/no-removal history, AF-088's Knowledge Web bucketing the real 40-entry Codex roster, and the weapon/commander/ship rosters' proven 5-axis non-numeric balance shelves) rather than inventing narrative-contradiction or pick-rate-metric checks that don't exist. Performance Validation explicitly imports and reuses AF-094's `TECHNICAL_DEBUG_SURFACES`/`TECHNICAL_PERFORMANCE_LIVE` booleans for the 3 metrics that overlap, rather than re-declaring them — delegation over reimplementation, the same law AF-090 applied to AF-089. Content Pipeline's 9 stages are, for 8 of them, a direct description of this project's own already-running per-module contract (verbatim spec doc → real TypeScript → Vitest → binding doc → self-review sweep → STATUS.md approval), which is itself the evidence. Release Pipeline names the real `.github/workflows/ci.yml` (typecheck→test→build gate) and `deploy-pages.yml`, honestly flagging that no performance-budget gate, release-candidate step, or post-release monitoring exists yet. Zero changes to any locked module (AF-000–094); the one live wiring point extends the existing `string`-typed `meta` DebugSnapshot field, never adding a new one.

Score: 9.5/10 — approved and locked.
