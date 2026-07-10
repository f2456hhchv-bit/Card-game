## Verbatim prompt

160

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-159 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Wisdom Engine.

The Wisdom Engine sits above the Intelligence Engine, Decision Engine, Planning Engine, Future Engine and Possibility Engine.

Knowledge is information.

Intelligence is understanding.

Wisdom is knowing when, why and whether something should be done.

The Wisdom Engine ensures that the Afterlight universe matures ethically, thoughtfully and sustainably across centuries.

==================================================
PURPOSE
==================================================

Enable civilisation to grow wiser.

Not merely smarter.

Every generation should inherit not only technology...

...but judgement.

==================================================
CORE PRINCIPLE
==================================================

The best decision is not always the fastest.

The most powerful technology is not always the best technology.

Wisdom evaluates consequences across generations.

==================================================
WISDOM SOURCES
==================================================

The engine learns from:

Chronicle

Legacy Engine

Museum

Historical Records

Commander Memories

Player Actions

Scientific Discoveries

Civilisation Outcomes

Ecological Recovery

Cultural Development

Education

Failures

Successes

==================================================
WISDOM DIMENSIONS
==================================================

Scientific

Ethical

Environmental

Historical

Educational

Cultural

Diplomatic

Engineering

Medical

Leadership

Exploration

Personal

==================================================
COMMANDER WISDOM
==================================================

Commanders gradually develop:

Patience.

Mentorship.

Perspective.

Humility.

Long-term thinking.

Emotional maturity.

Leadership evolves naturally.

==================================================
SCIENTIFIC WISDOM
==================================================

Researchers ask:

Should this experiment happen?

Who benefits?

Who might be harmed?

What safeguards exist?

Can history teach us anything?

Discovery includes responsibility.

==================================================
CIVILISATION WISDOM
==================================================

Governments evaluate:

Future generations.

Environmental sustainability.

Educational impact.

Historical preservation.

Social wellbeing.

Long-term prosperity.

==================================================
ECOLOGICAL WISDOM
==================================================

Planetary restoration considers:

Biodiversity.

Native ecosystems.

Long-term resilience.

Species balance.

Climate stability.

Intergenerational stewardship.

==================================================
CULTURAL WISDOM
==================================================

Societies preserve:

Traditions.

Languages.

Art.

Music.

Stories.

Scientific heritage.

Local identity.

Progress never erases culture.

==================================================
HISTORICAL REFLECTION
==================================================

Civilisation studies:

Past mistakes.

Successful recoveries.

Historic leaders.

Engineering failures.

Scientific triumphs.

Diplomatic breakthroughs.

History informs tomorrow.

==================================================
MENTORSHIP SYSTEM
==================================================

Experienced Commanders teach:

Young recruits.

Scientists.

Engineers.

Citizens.

Students.

Mentorship preserves wisdom.

Not just skill.

==================================================
ETHICAL DELIBERATION
==================================================

Major projects undergo thoughtful review.

Questions include:

Is this necessary?

Is it sustainable?

Is it reversible?

Does it improve humanity?

Can we achieve the goal another way?

==================================================
REFLECTION LOOP
==================================================

Experience

↓

Reflection

↓

Discussion

↓

Learning

↓

Teaching

↓

Improved Judgement

Wisdom compounds across generations.

==================================================
CIVILISATION VALUES
==================================================

The Wisdom Engine reinforces:

Curiosity.

Compassion.

Responsibility.

Hope.

Cooperation.

Stewardship.

Integrity.

Humility.

Education.

Legacy.

==================================================
GENERATIONAL TRANSFER
==================================================

Knowledge becomes:

Lessons.

Lessons become:

Traditions.

Traditions become:

Institutions.

Institutions become:

Civilisation.

==================================================
WISDOM MEMORY
==================================================

Historic lessons appear in:

Schools.

Universities.

Commander academies.

Museums.

Public monuments.

Scientific ethics.

Children inherit accumulated experience.

==================================================
DEVELOPER TOOLS
==================================================

Wisdom graph.

Ethics viewer.

Historical influence map.

Leadership maturity tracker.

Mentorship network.

Civilisation values dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should notice:

Commanders becoming calmer.

Scientists becoming more thoughtful.

Cities becoming more sustainable.

Children learning from history.

Civilisation behaving more responsibly over time.

==================================================
ACCESSIBILITY
==================================================

Reflection summaries.

Historical context viewer.

Ethics explanations.

Mentorship browser.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Wisdom Engine.

Enable every intelligent entity to develop judgement through accumulated experience, ensuring the Afterlight universe grows not only in capability—but in wisdom.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of generations.

Review ethical decisions.

Review Commander maturity.

Review scientific responsibility.

Review environmental stewardship.

Review educational outcomes.

Review cultural preservation.

Review accessibility.

Review performance.

Ensure wisdom consistently emerges from lived experience rather than scripted morality.

Ensure no single philosophy dominates every situation.

Ensure thoughtful disagreement remains possible while preserving the Atlas Core principles.

Ensure AF-160 becomes the philosophical maturation layer of the Afterlight universe, allowing humanity to build a future that is not merely more advanced—but genuinely wiser.

Repeat until civilisation consistently demonstrates accumulated judgement worthy of centuries of experience while remaining hopeful, curious and deeply human.

Only then lock AF-160.

## Foundation / AF-000–159 / GP-FINAL alignment review

Sits above AF-155–159: where those engines understand, choose, coordinate, forecast and imagine, AF-160 asks whether something should be done at all. "Reflection Loop" (Experience→Reflection→Discussion→Learning→Teaching→Improved Judgement) is driven directly by AF-155's real generic `CyclicStageTracker<TStage>` — the same class already reused for AF-155's own two lists and AF-156's Decision Pyramid — confirmed by a dedicated test that this list's exact membership still differs from every prior cyclic list.

"Commander Wisdom" (6 traits, "gradually develops") is confirmed a genuinely different axis from two existing Commander concepts, verified by a dedicated test showing zero member overlap: AF-030's real `PersonalityTrait` is fixed and dialogue-only by design law; AF-139's real `COMMANDER_MATURITY_STAGES` is a coarse 4-stage career-summary ladder. `CommanderWisdomTracker` tracks six fine-grained scores that accumulate with lived experience, never writing to either real list.

"Civilisation Values" (10) is confirmed another entry in this codebase's recurring "abstract value/virtue list" family, alongside the real Constitution's Design Pillars, AF-146's `TEN_PILLARS`, AF-145's Atlas Principle virtues, and AF-147's `CORE_THEMES` — kept separate. "Scientific Wisdom" and "Ethical Deliberation" are two more instances of this codebase's established all-must-pass checklist-gate mechanic, kept as their own separate question sets. "Civilisation Wisdom"'s `Future generations` factor is a single verbatim overlap with AF-155's real `STRATEGIC_REASONING_FACTORS` — the other five factors differ, so the lists stay separate.

"Wisdom Memory" (6 outcomes) mirrors the SHAPE of AF-157/158/159's real `PlanMemoryArchive`/`FutureMemoryArchive`/`InnovationMemoryArchive` — the FOURTH mirrored "completed experience becomes a named institution" archive in this codebase, typed to its own separate union. "Mentorship System" is confirmed the first REAL mentor/mentee relationship ledger in the codebase — prior mentions in AF-156/157's own decision/plan-kind lists were reference vocabulary only, never a tracked relationship. "Generational Transfer" mirrors AF-148/154/157's real indexOf-rank pattern as a linear escalation ladder rather than a cycle.

The debug overlay gains a new `atlasWisdom` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-159 before it. Zero changes to AF-155's `CyclicStageTracker`/`STRATEGIC_REASONING_FACTORS`, AF-030's `PersonalityTrait`, AF-139's `COMMANDER_MATURITY_STAGES`, AF-157/158/159's memory-archive classes, or any other locked module.

Score: 9.5/10 — approved and locked.
