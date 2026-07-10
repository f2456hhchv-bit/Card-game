# The Atlas Development Framework (AF-143)

Built entirely under `src/game/atlasFramework/`. Unlike prior modules, this one describes the development *process* itself — and a research pass before implementation found something unusual: its "Design Score" section ("only features scoring above 9.5/10 proceed") is, almost verbatim, this project's own real standing process.

## The recursive finding

`docs/FOUNDATION_LOCK.md:46` already defines the real gate this project runs on every module: ten categories (Gameplay Quality · Visual Quality · Technical Quality · Performance · Accessibility · Replayability · Scalability · Documentation · Lore Consistency · Integration), overall ≥ 9.5/10. AF-095's `qualityAssuranceData.ts` already half-acknowledges this via its `developerReview` field ("each module's own self-review score, gated at ≥9.5/10 before lock"). This module does **not** mechanically re-derive that real ten-category gate — it builds the spec's own separate nine-category `DESIGN_SCORE_CATEGORIES` rubric as new, distinct, in-universe tooling (`DesignScoreCard`), while documenting the real precedent honestly rather than silently claiming the two are identical.

## What's new (and what deliberately isn't)

- **"Design Bible"** — needed zero new code. AF-097's real `CONTENT_TEMPLATE_FIELDS` (14 fields including `purpose`/`gameplayRole`/`visualIdentity`/`accessibilityNotes`) and its real `contentTemplateCompletenessFor`/`isContentTemplateComplete` already implement exactly this requirement.
- **`commanderCompletenessFor`/`worldCompletenessFor`** — genuinely new. Confirmed no completeness checker of this shape exists anywhere for individual Commanders or Worlds. Both are decoupled pure functions taking plain signal values a caller extracts from real systems (AF-130's bond network, AF-131's ship rooms, AF-134's museum, AF-135's chronicle) — the same discipline AF-137's `tierWeightsFor` established.
- **`DesignScoreCard`** — the spec's own 9-category rubric, clamped 0-10, gated at the real 9.5 threshold, requiring every category scored before the gate can pass.
- **`PostLaunchSupportTracker`** and **`KnowledgeBaseRegistry`** — confirmed genuinely new. Neither AF-070's `LiveOpsRegistry` nor AF-142's `ModuleRegistry` tracks any metric over time; both only gate at registration time.
- **Kept as pure reference data, no new runtime**: the Accessibility Gate uses the spec's own 8-item wording, deliberately decoupled from AF-095's differently-named `ACCESSIBILITY_VALIDATION_CHECKS` and AF-093's `accessibilityTags` (same count, different exact vocabulary). The Developer Toolset heavily overlaps in name with AF-142's `DEVELOPER_TOOLKIT_SURFACES` and AF-094's `DEVELOPER_TOOLS_KINDS` (Relationship Simulator is an exact duplicate) — documented, not re-implemented. Content Validation/Art/Audio/Narrative Pipelines/Performance Targets/Documentation/Automated QA are all kept as reference checklists, since they describe human-authorship process steps AF-094/095/097 already conceptually own.
- **Debug overlay** — `DebugSnapshot` gains a new `atlasFramework` field, rendered as `atlas`.

## Live

Fresh-run debug line: `atlas design gate passed · commander checklist 5/9 · world checklist 9/10 · post-launch 1 · knowledge base 1`. Browser-verified, zero page errors.

## Review

A real bug was caught during browser verification: the debug closure initially called `postLaunchSupport.record(...)` on every render frame (unlike every other module's one-time seed pattern), so an append-only log grew unbounded (145 entries after a few seconds of play instead of 1). Fixed by moving the seed call to the one-time instantiation block. Zero changes to AF-070/093/094/095/097/130/131/134/135/142 or any other locked module. 9 tests, suite at 1629. Score 9.5/10 — approved and locked.
