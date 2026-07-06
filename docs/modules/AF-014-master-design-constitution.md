# AF-014 — MASTER DESIGN CONSTITUTION

**Module status:** Complete (specification produced; governs every future AF module beneath AF-000)
**Lock status:** LOCKED — extends AF-000 → AF-013 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/MASTER_DESIGN_CONSTITUTION.md` (the creative authority document) + decision-record practice (`docs/decisions/`)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-013 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the Master Design Constitution for Afterlight.

This is the highest creative authority beneath AF-000.

Whenever uncertainty exists, this document determines the correct design decision.

Every future feature.

Every visual.

Every mechanic.

Every system.

Every expansion.

Every piece of lore.

Must comply with this constitution.

If it does not, redesign it.

==================================================
CORE PHILOSOPHY
==================================================

Consistency creates quality.

Discipline creates identity.

Small excellent decisions produce legendary games.

The player experience always outweighs developer convenience.

==================================================
THE TEN COMMANDMENTS
==================================================

1.

Gameplay First.

Always.

--------------------------------------------------

2.

Readability Above Spectacle.

Every visual exists to support gameplay.

--------------------------------------------------

3.

Meaningful Choice.

Never create fake decisions.

--------------------------------------------------

4.

Player Respect.

Never waste player time.

--------------------------------------------------

5.

Reward Discovery.

Curiosity should always be worthwhile.

--------------------------------------------------

6.

Every System Connects.

Nothing exists in isolation.

--------------------------------------------------

7.

Simple Interface.

Deep Gameplay.

--------------------------------------------------

8.

Failure Teaches.

Never punish unfairly.

--------------------------------------------------

9.

Build For Expansion.

Never build dead-end systems.

--------------------------------------------------

10.

Protect The Vision.

Reject features that weaken Afterlight.

==================================================
DESIGN DECISION MATRIX
==================================================

Every proposed feature must answer:

Is it fun?

Is it readable?

Does it create meaningful gameplay?

Does it improve replayability?

Does it fit the universe?

Does it respect the visual language?

Does it support accessibility?

Does it remain performant?

Can it scale?

Will players remember it?

If any answer is "No"

The feature returns to design.

==================================================
DESIGN PRIORITY ORDER
==================================================

Priority 1

Gameplay

↓

Priority 2

Player Experience

↓

Priority 3

Readability

↓

Priority 4

Performance

↓

Priority 5

Accessibility

↓

Priority 6

Presentation

↓

Priority 7

Technical Elegance

When priorities conflict,

higher priorities always win.

==================================================
FEATURE EVALUATION
==================================================

Every feature receives scores for:

Gameplay

Replayability

Readability

Originality

Accessibility

Performance

Technical Risk

Production Cost

Longevity

Overall Quality

Minimum approval score:

9.5 / 10

==================================================
FEATURE REJECTION RULES
==================================================

Reject features that:

Duplicate existing systems.

Reduce readability.

Increase unnecessary complexity.

Create mandatory playstyles.

Reduce replayability.

Contradict established lore.

Compromise performance.

Compromise accessibility.

==================================================
PLAYER PROMISE
==================================================

Afterlight promises players:

Fair challenge.

Meaningful progression.

Respect for time.

Offline completeness.

Premium quality.

Long-term replayability.

Constant discovery.

No artificial retention.

No pay-to-win.

==================================================
CREATIVE GOVERNANCE
==================================================

Every new idea belongs to one of:

Foundation

Gameplay

Content

Narrative

Technology

Visual

Audio

Community

Expansion

Every idea must identify:

Purpose

Dependencies

Future Extensions

Player Benefit

==================================================
CHANGE MANAGEMENT
==================================================

Locked modules remain unchanged.

Future modules extend them.

If redesign becomes necessary:

Document reason.

Assess impact.

Review dependencies.

Update affected modules.

Maintain backwards compatibility where practical.

==================================================
PROJECT SUCCESS METRICS
==================================================

Success is measured by:

Player enjoyment.

Replayability.

Build diversity.

Performance.

Accessibility.

Community creativity.

Long-term engagement.

Critical quality.

Never by player addiction.

==================================================
DOCUMENTATION
==================================================

Every decision stores:

Reason

Alternatives Considered

Chosen Solution

Trade-offs

Dependencies

Future Review Date

==================================================
PERFORMANCE
==================================================

Creative decisions must never compromise:

Architecture.

Performance.

Maintainability.

Scalability.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Decision Status

Quality Score

Design Conflicts

Governance Warnings

Locked Modules

Performance

==================================================
OUTPUT
==================================================

Produce the complete Master Design Constitution.

Every future AF module is governed by this document.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every completed AF module.

Review every future proposal.

Review every gameplay decision.

Review every visual decision.

Review every technical decision.

Review every narrative decision.

Review every accessibility decision.

Review every performance target.

Challenge unnecessary complexity.

Challenge feature creep.

Challenge duplication.

Strengthen system integration.

Ensure every future decision reinforces the identity established by AF-000 through AF-014.

Reject anything that weakens the project.

Repeat until the entire production pipeline naturally produces a cohesive, premium-quality game.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-013 alignment review (recorded at catalogue time)

- **Authority chain clarified and recorded:** the project's supreme document remains the Master Constitution v1.0 (`docs/CONSTITUTION.md`, pre-AF-000). AF-014 sits: Master Constitution → AF-000 → **AF-014** → all other modules. AF-014's content is a faithful operational descendant of the Master Constitution (commandments ≈ pillars; matrix ≈ matrix; promise ≈ promise), so no authority conflict arises — recorded explicitly in output §1 so future uncertainty resolves up the same chain.
- Design Decision Matrix: all ten questions already live in the Unified Feature Gate (AF-011 §5 — "respect the visual language" and "support accessibility" map to Gate clusters B/E). Output references the Gate rather than duplicating the list (no-duplication law applied to governance itself).
- **Design Priority Order is new binding canon** — with one critical reconciliation: mandatory floors (Constitution accessibility set, 60 FPS floors, readability laws) are *gates that cannot be traded away at any priority*; the priority order governs **discretionary design effort and genuine conflicts above the floors**. Accessibility ranking 5th never permits shipping below the mandatory accessibility set. Recorded in output §3.
- Feature evaluation (ten scored axes, 9.5 minimum) extends AF-011 §9's instruments with the recorded-score practice; Technical Risk and Production Cost are new axes.
- Creative governance taxonomy (nine idea categories) mapped onto AF-013 §2's eleven module categories (Content ↔ Progression+World subsets; Technology ↔ Technical+Developer; Expansion spans) — one mapping table in output §6, preventing dual-taxonomy drift.
- Change management restates AF-012 §8's lock/amendment procedure; the three existing authorised amendments already follow it.
- **Decision-record practice instituted:** the documentation requirement (reason, alternatives, chosen solution, trade-offs, dependencies, future review date) is realised as `docs/decisions/` — one record per significant design decision, beginning with the next module. Retroactive seed records: the technology stack decision and the three authorised amendments.
- Success metrics ("never by player addiction") restate the Constitution's anti-manipulation stance as measurable governance.

**Review verdict:** ALIGNED (authority chain recorded; priority-order floor rule added; taxonomy mapping added; ADR practice instituted). Internal quality score 9.5/10 — approved. Produced output: `docs/MASTER_DESIGN_CONSTITUTION.md`.
