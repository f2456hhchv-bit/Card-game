## Verbatim prompt

194

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-193 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Possibility Engine.

The Excellence Engine ensures civilisation continually improves.

The Possibility Engine ensures civilisation never believes improvement has ended.

Every achievement should reveal new opportunities.

Every limitation should suggest new approaches.

Every unanswered question should become an invitation.

Possibility is civilisation's greatest renewable resource.

==================================================
PURPOSE
==================================================

Guarantee that meaningful opportunities always exist.

Prevent intellectual stagnation.

Maintain curiosity.

Maintain optimism.

Maintain long-term player motivation.

==================================================
CORE PRINCIPLE
==================================================

The universe is never finished.

Neither is humanity.

There is always another possibility worth exploring.

==================================================
POSSIBILITY DOMAINS
==================================================

Science

Engineering

Medicine

Education

Exploration

Architecture

Culture

Ecology

History

Community

Leadership

Civilisation

==================================================
THE POSSIBILITY CYCLE
==================================================

Observation

↓

Question

↓

Possibility

↓

Exploration

↓

Experiment

↓

Discovery

↓

Reflection

↓

New Possibilities

Every answer expands the frontier.

==================================================
SCIENTIFIC POSSIBILITY
==================================================

Every discovery creates:

New hypotheses.

New instruments.

New disciplines.

New collaborations.

New educational opportunities.

Knowledge continually expands.

==================================================
ENGINEERING POSSIBILITY
==================================================

Every invention enables:

Improved infrastructure.

New habitats.

Advanced restoration.

Safer exploration.

Creative architecture.

Engineering opens future pathways.

==================================================
COMMANDER POSSIBILITY
==================================================

Every Commander continually discovers:

New leadership styles.

Research opportunities.

Teaching approaches.

Mentorship networks.

Exploration goals.

Personal growth never concludes.

==================================================
PLAYER POSSIBILITY
==================================================

The player always has meaningful options.

Examples

Restore another ecosystem.

Mentor new Commanders.

Build a new academy.

Investigate ancient signals.

Expand museums.

Design new cities.

Support scientific initiatives.

No playstyle reaches a dead end.

==================================================
CIVILISATIONAL POSSIBILITY
==================================================

Humanity continually asks:

Which worlds remain unseen?

Which species remain unknown?

Which histories remain incomplete?

Which ideas remain unexplored?

The future always remains open.

==================================================
POSSIBILITY THROUGH COOPERATION
==================================================

Great opportunities often require:

Scientists.

Engineers.

Teachers.

Artists.

Communities.

Explorers.

Children.

Collaboration expands possibility.

==================================================
THE POSSIBILITY WEB
==================================================

Every possibility links to:

Existing knowledge.

Current challenges.

Available resources.

Historical context.

Potential contributors.

Future consequences.

Nothing exists without context.

==================================================
LIMITATIONS
==================================================

Constraints inspire innovation.

Limited resources create:

Efficiency.

Creativity.

Collaboration.

Adaptation.

Better long-term solutions.

==================================================
THE UNKNOWN RESERVE
==================================================

The universe intentionally retains:

Unexplored sectors.

Unanswered questions.

Undiscovered species.

Untranslated archives.

Emerging sciences.

Future technologies.

Unknown remains valuable.

==================================================
THE POSSIBILITY INDEX
==================================================

Evaluate:

Curiosity.

Research diversity.

Exploration opportunities.

Educational growth.

Community innovation.

Creative expression.

Scientific openness.

Future readiness.

==================================================
THE OPEN DOOR PRINCIPLE
==================================================

Every completed objective should naturally unlock:

At least one new opportunity.

At least one new question.

At least one new relationship.

At least one new direction.

Progress expands freedom.

==================================================
DEVELOPER TOOLS
==================================================

Possibility explorer.

Opportunity graph.

Future pathway viewer.

Curiosity dashboard.

Knowledge frontier browser.

Potential analyser.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually realise:

"I've accomplished so much..."

"...and I've only begun to understand what's possible."

==================================================
ACCESSIBILITY
==================================================

Opportunity summaries.

Future pathway browser.

Discovery tracker.

Possibility overview.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Possibility Engine.

Ensure every achievement naturally creates further meaningful opportunities without relying on artificial progression or infinite procedural content.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-193.

Simulate one million years.

Review opportunity generation.

Review scientific expansion.

Review educational growth.

Review Commander ambitions.

Review player motivation.

Review institutional evolution.

Review accessibility.

Review performance.

Ensure possibilities emerge from accumulated history rather than arbitrary content generation.

Ensure every frontier naturally reveals another beyond it.

Ensure AF-194 becomes the opportunity layer of the Afterlight universe, guaranteeing that civilisation never reaches a point where curiosity, creativity or hope have nowhere left to grow.

Repeat until every generation believes the greatest discoveries still lie ahead.

Only then lock AF-194.

## Foundation / AF-000–193 / GP-FINAL alignment review

**⚠ CRITICAL NAMING COLLISION — the most severe of the entire session so far.** This spec's title, "The Atlas Possibility Engine," is a VERBATIM, word-for-word duplicate of AF-159's own real, already-locked module title (`src/game/atlasPossibility/` — "Sits above AF-158's Future Engine... imagines opportunities nobody has considered yet"). Every prior naming collision this session (AF-185 vs "Living Galaxy," AF-186 vs "Evolution Engine," AF-188 vs BOTH "Atlas Possibility Engine [AF-159]" and "Atlas Possibility Space," AF-191 vs "Galactic Creator Engine"/"Atlas Creative Intelligence," AF-192 vs "Crafting System"/"Master Index") involved at most a shared WORD inside a differently-worded title. This is the first FULL exact-title duplicate — AF-188 already brushed against AF-159's title when disambiguating itself from it, but AF-194 IS that title again, verbatim.

Resolved the same way every prior collision was resolved: a new, distinct directory (`atlasOpenPossibility/`), extending rather than redefining AF-159's real classes. The display name is disambiguated as "The Atlas Possibility Engine (AF-194)" wherever it must appear alongside AF-159's identical title, both here and in the binding doc/STATUS.md row. This is flagged prominently in the closing summary to the user for Project Owner awareness, since a verbatim title reuse this deep into a 200-module sequence may indicate an unintentional repeat on the Project Owner's side, though the standing contract's "resolve collisions autonomously" precedent from AF-185 through AF-192 was followed rather than pausing implementation.

A research pass before implementation found AF-159 already built the near-entirety of this spec's apparatus, reused directly and confirmed by dedicated tests: "The Possibility Web" is exactly AF-159's real `PossibilityRegistry`/`Possibility` interface (which already carries `requiredKnowledge`/`requiredPeople`/`requiredLocations`/`potentialRisks`/`potentialRewards`/`historicalSignificance`/`futureImplications`). "The Unknown Reserve" reuses AF-159's real `MysteryLog` directly. "Player Possibility" reuses AF-159's real `PlayerInspirationLog` directly. "The Open Door Principle" is exactly AF-169's real `ensureNextHorizonOpen` directly. "Possibility Through Cooperation" reuses AF-155's real `CollaborativeProblemLog` directly. "Civilisational Possibility" composes AF-151's real `KnowledgeGraph.suggestConnections` directly — the same shared-neighbour convergence AF-159's own "Serendipity" section already reused.

Confirmed genuinely new: "The Possibility Cycle" (Observation→Question→Possibility→Exploration→Experiment→Discovery→Reflection→"New Possibilities") never draws an arrow back to Observation by name — its final stage is a distinct new concept, not a repeat of its first — so it is modelled as an ORDERED, NON-CYCLIC ladder via the new `possibilityCycleRank`, mirroring the established `xRank(stage): number` pattern. It shares 2 of 8 stages exactly with AF-191's real `CREATION_CYCLE_STAGES` (Question/Reflection) and zero with either AF-192's `CRAFT_CYCLE_STAGES` or AF-193's `EXCELLENCE_CYCLE_STAGES` — the fourth sibling process ladder authored in a row, still fragmented membership, confirmed via AF-170's real `detectOverlap`.

"The Possibility Index" (8 categories) mirrors AF-143/149/170/173/179/180/182/184/188/190/193's real scoring-rubric shape exactly — the TWELFTH such rubric in this codebase, typed to its own new `PossibilityIndexCategory` union, reusing the same established 9.5 gate. Shares zero exact members with AF-193's real `EXCELLENCE_INDEX_CATEGORIES`, confirmed by a dedicated test.

"Possibility Domains" (12) shares 11 of 12 exact-string members with AF-193's real `EXCELLENCE_DOMAINS` (only "Civilisation" here vs "Governance" there) — ties but does not break the absolute overlap record (AF-191's own 12/12 remains highest) — and only 2 of 12 with AF-159's own real `DISCOVERY_CATEGORIES` (Engineering/Exploration), both confirmed via `detectOverlap`. The Scientific/Engineering/Commander Possibility sections, "Limitations," and "Possibility Through Cooperation"'s own participant list are kept as pure reference vocabulary — the same honest scope boundary previously established.

The debug overlay gains a new `atlasOpenPossibility` field on `DebugSnapshot`, rendered with the label `openDoor` — checked against every existing debug line for collisions before finalising (including the pre-existing `possible` and `possibility` labels for AF-159/AF-173) and confirmed unique. Zero changes to AF-151's `KnowledgeGraph`, AF-155's `CollaborativeProblemLog`, AF-159's `PossibilityRegistry`/`MysteryLog`/`PlayerInspirationLog`/`DISCOVERY_CATEGORIES`, AF-169's `ensureNextHorizonOpen`, AF-170's `detectOverlap`, AF-191's `CREATION_CYCLE_STAGES`, AF-192's `CRAFT_CYCLE_STAGES`, AF-193's `EXCELLENCE_DOMAINS`/`EXCELLENCE_CYCLE_STAGES`/`EXCELLENCE_INDEX_CATEGORIES`, or any other locked module.

Score: 9.5/10 — approved and locked.
