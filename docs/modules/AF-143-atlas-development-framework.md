## Verbatim prompt

143

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-142 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Development Framework.

Unlike player-facing systems, this framework exists to ensure Afterlight can continue growing for years without technical debt, inconsistent design or declining quality.

Every feature created after AF-143 must pass through this framework before becoming canonical.

==================================================
CORE PHILOSOPHY
==================================================

Build a development ecosystem.

Not just a game.

Every future addition should become easier to create.

Safer to implement.

More consistent.

Higher quality.

==================================================
FOUNDATION
==================================================

The Atlas Development Framework contains:

Design Standards

Technical Standards

Art Standards

Audio Standards

Narrative Standards

Accessibility Standards

Performance Standards

Testing Standards

Documentation Standards

Expansion Standards

==================================================
DESIGN BIBLE
==================================================

Every feature must define:

Purpose.

Player fantasy.

Primary gameplay loop.

Secondary interactions.

Progression.

Accessibility.

Replayability.

Narrative role.

Visual identity.

Technical dependencies.

No feature enters production without this document.

==================================================
CONTENT VALIDATION
==================================================

Every new feature automatically checks:

Gameplay overlap.

Balance conflicts.

Commander compatibility.

Museum integration.

Legacy integration.

Story compatibility.

Living Galaxy support.

Performance impact.

Accessibility score.

Documentation completeness.

==================================================
COMMANDER VALIDATION
==================================================

Every future Commander must include:

Unique fantasy.

No gameplay duplication.

Bond Network integration.

Living Ship interactions.

Museum contribution.

Chronicle biography.

Personal quests.

Mastery track.

Accessibility review.

Performance validation.

==================================================
WORLD VALIDATION
==================================================

Every new planet must include:

Unique ecology.

Distinct architecture.

Weather profile.

Wildlife.

History.

Economy.

Culture.

Music.

Exploration identity.

Museum compatibility.

==================================================
ART PIPELINE
==================================================

Every asset requires:

Concept.

Orthographic views.

Animation guide.

Material guide.

LOD specifications.

Accessibility review.

Memory budget.

Performance budget.

Museum representation.

==================================================
AUDIO PIPELINE
==================================================

Every sound requires:

Purpose.

Priority.

Variation count.

Accessibility profile.

Environmental mixing.

Music integration.

Subtitle support.

Voice integration.

==================================================
NARRATIVE PIPELINE
==================================================

Every story must define:

Theme.

Conflict.

Resolution.

Character growth.

Historical impact.

Chronicle integration.

Museum integration.

Future references.

==================================================
PERFORMANCE TARGETS
==================================================

Every feature validates:

CPU usage.

GPU usage.

Memory.

Streaming.

Network.

Save size.

Loading time.

Battery impact.

==================================================
ACCESSIBILITY GATE
==================================================

No feature may ship without:

Subtitle support.

Remappable controls.

Colour-safe visuals.

Difficulty compatibility.

Narration compatibility.

Reduced motion support.

High-contrast support.

Input flexibility.

==================================================
DOCUMENTATION
==================================================

Every module generates:

Developer documentation.

Technical diagrams.

Gameplay diagrams.

API references.

Art references.

Narrative references.

QA checklist.

Expansion notes.

==================================================
AUTOMATED QA
==================================================

Every build runs:

Regression tests.

Save compatibility.

Commander interactions.

Dialogue validation.

Chronicle generation.

Museum updates.

Relationship simulations.

Performance benchmarks.

==================================================
DESIGN SCORE
==================================================

Every feature receives:

Originality.

Depth.

Replayability.

Clarity.

Performance.

Accessibility.

Narrative value.

Player delight.

Maintainability.

Only features scoring above 9.5/10 proceed.

==================================================
DEVELOPER TOOLSET
==================================================

Internal tools include:

Commander Builder.

Planet Builder.

Settlement Builder.

Dialogue Validator.

Lore Validator.

Relationship Simulator.

Balance Sandbox.

Performance Analyzer.

Accessibility Preview.

==================================================
POST-LAUNCH SUPPORT
==================================================

Every release tracks:

Player behaviour.

Performance.

Accessibility feedback.

Bug frequency.

Narrative reception.

Balance metrics.

Future improvements.

Nothing is abandoned.

==================================================
KNOWLEDGE BASE
==================================================

Every solved problem becomes reusable knowledge.

Engineering patterns.

UI standards.

Animation libraries.

Dialogue templates.

Audio libraries.

Optimisation guides.

Future teams inherit accumulated experience.

==================================================
OUTPUT
==================================================

Implement the Atlas Development Framework.

Ensure every future addition to Afterlight meets a unified standard of quality, maintainability and scalability.

The framework becomes the invisible production backbone supporting the entire Afterlight universe.

==================================================
SELF REVIEW LOOP
==================================================

Simulate development across twenty years.

Produce hundreds of expansions.

Create thousands of assets.

Validate millions of interactions.

Review documentation.

Review technical debt.

Review accessibility.

Review performance.

Review player experience.

Continuously refine the framework until every future feature can be developed faster, safer and at a higher quality than the last.

Ensure the Atlas Development Framework becomes the production standard upon which the entire Afterlight franchise is built.

Repeat until AF-143 consistently enables sustainable long-term development while preserving the design philosophy established across AF-000 through AF-142.

Only then lock AF-143.

## Foundation / AF-000–142 / GP-FINAL alignment review

A dedicated research pass (the same research-first pattern used for AF-132/133/138/139/140/141/142) found something unusual for this module: its "Design Score" section ("only features scoring above 9.5/10 proceed") is, almost verbatim, this project's own real standing process. `docs/FOUNDATION_LOCK.md:46` already defines the real gate this repository runs on every module — ten categories (Gameplay Quality · Visual Quality · Technical Quality · Performance · Accessibility · Replayability · Scalability · Documentation · Lore Consistency · Integration), overall ≥ 9.5/10 — and AF-095's `qualityAssuranceData.ts` already half-acknowledges this via its `developerReview` field ("each module's own self-review score, gated at ≥9.5/10 before lock"). This module does not mechanically re-derive that real ten-category gate — it builds the spec's own separate nine-category `DESIGN_SCORE_CATEGORIES` rubric (`DesignScoreCard`) as new, distinct, in-universe tooling, documenting the real precedent transparently rather than silently conflating the two.

"Design Bible" needed zero new code — AF-097's real `CONTENT_TEMPLATE_FIELDS`/`contentTemplateCompletenessFor`/`isContentTemplateComplete` already implement exactly "every feature must define X before entering production." `commanderCompletenessFor`/`worldCompletenessFor` are confirmed genuinely new — no completeness checker of this shape exists anywhere for individual Commanders or Worlds — and are built as decoupled pure functions over plain signal values, the same discipline AF-137's `tierWeightsFor` established, so this module has no import-time dependency on AF-130/131/134/135. `PostLaunchSupportTracker`/`KnowledgeBaseRegistry` are confirmed genuinely new: neither AF-070's `LiveOpsRegistry` nor AF-142's `ModuleRegistry` tracks any metric over time. The Accessibility Gate (8 items, spec's own wording) is kept deliberately decoupled from AF-095's differently-named `ACCESSIBILITY_VALIDATION_CHECKS` and AF-093's `accessibilityTags` — same count, different exact vocabulary, so kept separate rather than force-mapped. The Developer Toolset is kept as its own documented list with no new runtime, given its heavy name overlap with AF-142's real `DEVELOPER_TOOLKIT_SURFACES` (Relationship Simulator is an exact duplicate) and AF-094's real `DEVELOPER_TOOLS_KINDS`. Content Validation/Art/Audio/Narrative Pipelines/Performance Targets/Documentation/Automated QA are all kept as pure reference checklists, since they describe human-authorship process steps AF-094/095/097 already conceptually own, and a fourth near-duplicate validator would violate "extend, don't duplicate."

A real bug was caught during browser verification (not a design decision, an actual defect): the debug closure's first draft called `postLaunchSupport.record(...)` on every render frame, unlike every other module's one-time-seed pattern, causing the append-only tracker to grow unbounded (145 entries after a few seconds instead of 1). Fixed by moving the seed call into the one-time instantiation block; re-verified in the browser afterward showing a stable count.

The debug overlay gains a new `atlasFramework` field on `DebugSnapshot`, rendered as `atlas` — the same established extension pattern used by AF-039 through AF-142 before it. Zero changes to any other locked module (AF-000–142).

Score: 9.5/10 — approved and locked.
