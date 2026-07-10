## Verbatim prompt

172

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-171 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Imagination Engine.

The Imagination Engine exists above the Creative Intelligence.

Creativity produces new ideas.

Imagination explores realities that do not yet exist.

It enables every intelligent entity to dream, speculate, hypothesise and envision futures beyond current knowledge.

Imagination becomes the source of humanity's greatest leaps forward.

==================================================
PURPOSE
==================================================

Allow civilisation to imagine impossible futures.

Encourage exploration beyond known assumptions.

Ensure curiosity always reaches further than certainty.

==================================================
CORE PRINCIPLE
==================================================

Every great discovery begins as imagination.

Before something can be built...

Someone must first imagine it.

==================================================
IMAGINATION DOMAINS
==================================================

Exploration

Science

Engineering

Medicine

Architecture

Education

Culture

Ecology

History

Art

Leadership

Civilisation

==================================================
INDIVIDUAL IMAGINATION
==================================================

Every major character occasionally wonders:

"What if..."

These thoughts influence:

Research.

Expeditions.

Teaching.

Conversation.

Innovation.

Personal growth.

==================================================
COMMANDER VISIONS
==================================================

Commanders imagine:

Unknown worlds.

Future academies.

Scientific revolutions.

Improved expeditions.

Safer colonies.

Better teaching.

Their dreams evolve through experience.

==================================================
SCIENTIFIC IMAGINATION
==================================================

Scientists hypothesise:

Unknown particles.

Life beyond known biology.

Alternative ecosystems.

Ancient precursor technology.

Unexplored physical phenomena.

Every hypothesis remains grounded in evidence.

==================================================
ENGINEERING IMAGINATION
==================================================

Engineers envision:

Impossible structures.

Adaptive habitats.

Living architecture.

Self-restoring cities.

Planetary engineering.

Deep-space habitats.

Ideas become future projects.

==================================================
CHILDREN'S IMAGINATION
==================================================

Children imagine freely.

Some ideas become:

Future discoveries.

Art.

Stories.

Games.

Scientific inspiration.

Educational reforms.

Civilisation values imagination at every age.

==================================================
CULTURAL IMAGINATION
==================================================

Artists create:

Paintings.

Music.

Poetry.

Architecture.

Literature.

Performances.

Creative works inspire scientific thinking.

==================================================
EXPLORATION IMAGINATION
==================================================

Explorers speculate about:

Unknown galaxies.

Hidden civilisations.

Living nebulae.

Impossible ecosystems.

Forgotten histories.

Future expeditions often begin as speculation.

==================================================
HISTORICAL IMAGINATION
==================================================

Historians ask:

What remains undiscovered?

Which records are incomplete?

How might earlier civilisations have lived?

History continues expanding.

==================================================
COLLECTIVE DREAMS
==================================================

Entire civilisation gradually dreams about:

The next galaxy.

Universal education.

Perfect ecological restoration.

Living museums.

Interstellar gardens.

New horizons unite society.

==================================================
THE DREAM NETWORK
==================================================

Ideas spread naturally.

A child imagines.

A teacher encourages.

A scientist investigates.

An engineer prototypes.

A Commander funds.

Civilisation advances.

==================================================
IMAGINATION WITHOUT FANTASY
==================================================

Imagination never breaks established science.

Unknown does not mean magical.

Every extraordinary possibility eventually gains believable scientific grounding.

==================================================
FUTURE MYTHS
==================================================

Some imagined futures inspire generations even before they become possible.

Examples

The Living Ring.

The Ocean Between Galaxies.

The Atlas Horizon.

The Garden Worlds.

Dreams motivate exploration.

==================================================
THE HORIZON EFFECT
==================================================

Every answer creates:

New questions.

New mysteries.

New dreams.

Wonder never reaches completion.

==================================================
DEVELOPER TOOLS
==================================================

Vision graph.

Dream network viewer.

Hypothesis explorer.

Future concept browser.

Imagination dependency map.

Speculation timeline.

==================================================
PLAYER EXPERIENCE
==================================================

Players should regularly think:

"I wonder if that's actually possible..."

Long before they discover the answer.

==================================================
ACCESSIBILITY
==================================================

Dream journal.

Hypothesis browser.

Future concepts.

Vision summaries.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Imagination Engine.

Allow every generation of humanity to dream beyond current knowledge while remaining scientifically grounded and faithful to the hopeful vision of Afterlight.

==================================================
SELF REVIEW LOOP
==================================================

Simulate ten thousand years of scientific imagination.

Review Commander visions.

Review educational influence.

Review artistic inspiration.

Review exploration hypotheses.

Review cultural dreams.

Review accessibility.

Review performance.

Ensure imagination continuously creates believable new frontiers without violating established canon.

Ensure every imagined future can eventually become tomorrow's reality through discovery, cooperation and knowledge.

Ensure AF-172 becomes the visionary layer of the Afterlight universe, guaranteeing that civilisation never stops asking, "What lies beyond?" and never stops believing that the answer is worth finding.

Repeat until players leave every session inspired to imagine futures beyond the game itself.

Only then lock AF-172.

## Foundation / AF-000–171 / GP-FINAL alignment review

Positions imagination one layer above AF-171's Creative Intelligence: creativity produces new ideas, imagination explores realities that do not yet exist. This module leans almost entirely on direct reuse of already-locked mechanics, confirmed by dedicated tests: "Commander Visions" ("their dreams evolve through experience") reuses AF-161's real `CommanderBeliefTracker` directly, since that class already stores plain evolving strings per commander with no union constraint — the same "already a real generic" situation AF-167 found with AF-163's `MeaningCurator`. "Engineering Imagination" ("ideas become future projects") and "Collective Dreams" ("new horizons unite society") both compose AF-162's real `LongTermMissionTracker.register` directly. "Historical Imagination" ("what remains undiscovered?") composes AF-159's real `MysteryLog.open` directly. "The Dream Network" (child imagines → teacher encourages → scientist investigates → engineer prototypes → Commander funds → civilisation advances) is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` over this module's own 5-stage `DREAM_NETWORK_STAGES` union. "The Horizon Effect" ("every answer creates new questions... wonder never reaches completion") is exactly AF-169's real `ensureNextHorizonOpen`, reused directly rather than authoring a second completion-chains-to-a-new-mystery mechanic.

"Imagination Domains" (12) ties (does not break) AF-171's current absolute overlap record: NINE of its 12 members are exact-string matches with AF-171's real `CREATIVE_DOMAINS`, verified using AF-170's real `detectOverlap` function. It is kept as its own separate reference vocabulary regardless, since it tags what a SPECULATIVE idea concerns — a fifth distinct question from "meaningful goal" (Purpose), "emotional significance" (Meaning), "cross-generational inheritance" (Legacy) and "creative act" (Creative Intelligence).

"Scientific Imagination" and "Imagination Without Fantasy" ("imagination never breaks established science... every extraordinary possibility eventually gains believable scientific grounding") are confirmed genuinely new: `HypothesisTracker` is a speculative-idea registry with an explicit grounded/ungrounded state, confirmed by a dedicated test to start every idea ungrounded and only mark it grounded through an explicit later action — a fundamentally different concept from AF-155's real `rankOptions` (which weighs already-known options) and from AF-159's real `PossibilityRegistry` (which stores a fully-specified opportunity, not an open, possibly-wrong guess).

The debug overlay gains a new `atlasImagination` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-171 before it. Zero changes to AF-161's `CommanderBeliefTracker`, AF-162's `LongTermMissionTracker`, AF-159's `MysteryLog`, AF-155's `CyclicStageTracker`, AF-169's `ensureNextHorizonOpen`, AF-171's `CREATIVE_DOMAINS`, AF-170's `detectOverlap`, or any other locked module.

Score: 9.5/10 — approved and locked.
