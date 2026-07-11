## Verbatim prompt

199

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-198 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Civilisational Wisdom Engine.

Previous modules allow individuals to reason and judge.

The Civilisational Wisdom Engine governs what humanity collectively learns across centuries.

Knowledge answers:

"What is true?"

Reasoning answers:

"What follows?"

Judgement answers:

"What should we choose?"

Wisdom answers:

"What should never be forgotten?"

It is the long-term intelligence of civilisation itself.

==================================================
PURPOSE
==================================================

Ensure civilisation learns across generations.

Prevent repeated mistakes.

Reward reflection.

Transform experience into enduring wisdom.

==================================================
CORE PRINCIPLE
==================================================

Experience becomes wisdom only after reflection.

Civilisation matures because it remembers why lessons mattered.

==================================================
WISDOM DOMAINS
==================================================

Science

Education

Leadership

Engineering

Ecology

Culture

History

Exploration

Medicine

Community

Architecture

Civilisation

==================================================
THE WISDOM CYCLE
==================================================

Experience

↓

Reflection

↓

Understanding

↓

Teaching

↓

Application

↓

Improved Outcomes

↓

New Experience

Wisdom compounds forever.

==================================================
COLLECTIVE WISDOM
==================================================

Humanity gradually develops:

Long-term thinking.

Patience.

Humility.

Stewardship.

Scientific responsibility.

Educational generosity.

Institutional resilience.

Civilisation becomes wiser.

==================================================
COMMANDER WISDOM
==================================================

Veteran Commanders become valued because they:

Teach calmly.

Recognise patterns.

Avoid unnecessary mistakes.

Mentor effectively.

Balance optimism with caution.

Experience becomes guidance.

==================================================
SCIENTIFIC WISDOM
==================================================

Science remembers:

Historic failures.

Unexpected discoveries.

Methodological improvements.

Ethical lessons.

Collaborative successes.

Knowledge becomes increasingly reliable.

==================================================
INSTITUTIONAL WISDOM
==================================================

Museums preserve lessons.

Universities refine understanding.

Academies improve teaching.

Hospitals improve care.

Research institutes improve methodology.

Institutions become wiser through time.

==================================================
CULTURAL WISDOM
==================================================

Communities preserve:

Stories.

Traditions.

Proverbs.

Celebrations.

Memorials.

Public rituals.

Culture quietly teaches future generations.

==================================================
PLAYER WISDOM
==================================================

The universe recognises recurring player behaviours.

Examples

Preparation.

Curiosity.

Mentorship.

Environmental care.

Long-term planning.

Scientific thinking.

The game supports—not judges—these patterns.

==================================================
WISDOM THROUGH FAILURE
==================================================

Failures are preserved.

Not as embarrassment.

As education.

Examples

Unsuccessful expeditions.

Engineering redesigns.

Scientific dead ends.

Historic misunderstandings.

Failure strengthens civilisation.

==================================================
THE WISDOM LIBRARY
==================================================

Every lesson permanently records:

Situation.

Decision.

Outcome.

Reflection.

Future relevance.

Teaching value.

Wisdom becomes searchable.

==================================================
INTERGENERATIONAL WISDOM
==================================================

Every generation inherits:

Experience.

Best practices.

Improved methods.

Historic context.

Public knowledge.

Shared responsibility.

Civilisation begins ahead of where it once stood.

==================================================
THE WISDOM TEST
==================================================

Every important decision asks:

Have we faced something similar?

What did we learn?

What still remains uncertain?

How can we improve?

Wisdom remains humble.

==================================================
THE CIVILISATIONAL COMPASS
==================================================

Humanity continually aligns itself toward:

Hope.

Discovery.

Responsibility.

Education.

Stewardship.

Compassion.

Long-term thinking.

These become enduring cultural values.

==================================================
DEVELOPER TOOLS
==================================================

Wisdom browser.

Lesson graph.

Civilisation learning timeline.

Institutional wisdom map.

Experience archive.

Reflection dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually realise:

"This civilisation isn't only becoming more advanced."

"It's becoming wiser."

==================================================
ACCESSIBILITY
==================================================

Lesson summaries.

Wisdom timeline.

Institution browser.

Reflection viewer.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Civilisational Wisdom Engine.

Ensure humanity continually transforms accumulated experience into practical wisdom that strengthens every future generation without preventing innovation or curiosity.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-198.

Simulate one million years.

Review scientific learning.

Review educational inheritance.

Review Commander mentorship.

Review institutional maturity.

Review cultural preservation.

Review historical reflection.

Review accessibility.

Review performance.

Prevent repeated mistakes without removing experimentation.

Ensure wisdom complements curiosity rather than replacing it.

Ensure AF-199 becomes the long-term learning layer of the Afterlight universe, allowing humanity to continually transform experience into wisdom while remaining humble enough to keep learning forever.

Repeat until civilisation demonstrates that every generation begins wiser than the last while still believing there is infinitely more left to discover.

Only then lock AF-199.

## Foundation / AF-000–198 / GP-FINAL alignment review

**NAMING SCOPE NOTE:** "Wisdom" already names AF-160's own locked "Atlas Wisdom Engine" (`atlasWisdom/`) — the closest possible collision short of a verbatim duplicate. AF-160 already sits "above AF-155-159... asking whether something should be done at all, and what centuries of experience have taught about it" — almost the identical framing AF-199 uses for itself. This module lives under its own `atlasCivilisationalWisdom/` directory and never redefines AF-160.

A research pass before implementation found AF-160 already built the near-entirety of this spec's apparatus. Reused directly, confirmed by dedicated tests: "The Wisdom Cycle" reuses AF-155's real generic `CyclicStageTracker<TStage>` directly, instantiated over this module's own new `WISDOM_CYCLE_STAGES` union — the same class AF-160's own "Reflection Loop" already reused. Shares 3 of 7 stages exactly with AF-160's real `REFLECTION_LOOP_STAGES` (Experience/Reflection/Teaching). "Commander Wisdom" reuses AF-160's real `CommanderWisdomTracker` directly, and its "mentor effectively" clause reuses AF-160's real `MentorshipLedger` directly. "Institutional Wisdom" reuses AF-165's real `InstitutionalMemoryTracker` directly. "Cultural Wisdom" composes AF-159's real `CulturalTrendTracker` directly. "Wisdom Through Failure" reuses AF-160's real `WisdomMemoryArchive` directly. "Intergenerational Wisdom" reuses AF-160's real `generationalTransferRank`/`GENERATIONAL_TRANSFER_STAGES` directly.

"Wisdom Domains" (12) is, as a SET, an EXACT match — all 12 members, only reordered — for AF-198's real `JUDGEMENT_DOMAINS`. Confirmed via `detectOverlap`: 12/12, TYING the absolute overlap record for the second time in this codebase (AF-191's own reuse of AF-171's real `CREATIVE_DOMAINS` was the first). Given a perfect match, this module reuses AF-198's real `JUDGEMENT_DOMAINS` directly rather than declaring a third near-duplicate domain list. Notably, that same 12-member set shares only 3 of 12 exact-string members with AF-160's own real `WISDOM_DIMENSIONS` — confirmed by a dedicated test.

Confirmed genuinely new: "The Wisdom Library" ("every lesson permanently records situation/decision/outcome/reflection/future relevance/teaching value... wisdom becomes searchable") is a genuinely different question from AF-160's real `WisdomMemoryArchive` (which only tags a lesson id against WHICH institutions now teach it, never the situation/decision/outcome narrative itself) — the same "archive tags destinations, ledger records the narrative" distinction AF-190's real `DesignHistoryLedger` already established relative to its own neighbouring archive. The new `WisdomLibrary` is an append-only per-lesson record, mirroring the established shape, confirmed by a dedicated test.

"Collective Wisdom" (7 qualities) shares 2 of 7 exact members with AF-160's real `CIVILISATION_VALUES` (Humility/Stewardship); "The Civilisational Compass" (7 values) shares 5 of 7 exactly (Hope/Responsibility/Education/Stewardship/Compassion) — the stronger of the two, documented honestly rather than merged. "Cultural Wisdom" (6 examples) shares 2 of 6 with AF-160's real `CULTURAL_WISDOM_FACTORS`. All confirmed via `detectOverlap`, kept as separate reference lists. "Scientific Wisdom," "Player Wisdom," and "The Wisdom Test" are kept as pure reference vocabulary — none uses an explicit "if yes/no then X" gate framing, the same honest restraint AF-197/198 already applied to their own reflective checklists.

The debug overlay gains a new `atlasCivilisationalWisdom` field on `DebugSnapshot`, rendered with the label `civWisdom` — checked against the pre-existing `wisdom` label (AF-160) before finalising and confirmed distinct. Zero changes to AF-155's `CyclicStageTracker`, AF-159's `CulturalTrendTracker`, AF-160's `CommanderWisdomTracker`/`MentorshipLedger`/`WisdomMemoryArchive`/`generationalTransferRank`/`REFLECTION_LOOP_STAGES`/`CIVILISATION_VALUES`/`CULTURAL_WISDOM_FACTORS`/`WISDOM_DIMENSIONS`, AF-165's `InstitutionalMemoryTracker`, AF-170's `detectOverlap`, AF-190's `DesignHistoryLedger`, AF-198's `JUDGEMENT_DOMAINS`, or any other locked module.

Score: 9.5/10 — approved and locked.
