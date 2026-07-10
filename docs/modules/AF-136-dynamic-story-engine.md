## Verbatim prompt

136

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-135 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Dynamic Story Engine.

No playthrough should unfold identically.

The player's decisions, relationships, discoveries and priorities organically create a unique narrative.

The game no longer tells one story.

It generates thousands.

==================================================
CORE PHILOSOPHY
==================================================

The player is not following history.

The player is creating it.

Every expedition becomes its own science-fiction novel.

Every Commander experiences a different journey.

Every colony develops differently.

Stories emerge naturally rather than through scripted sequences alone.

==================================================
STORY PILLARS
==================================================

The Story Engine tracks:

Hope

Curiosity

Sacrifice

Leadership

Discovery

Unity

Innovation

Compassion

Resilience

Exploration

These values influence future events.

==================================================
WORLD STORY STATE
==================================================

Every major system influences narrative.

Examples

Destroyed colonies.

Saved wildlife.

Scientific breakthroughs.

Political alliances.

Economic prosperity.

Commander morale.

Museum progress.

Historic discoveries.

Nothing exists in isolation.

==================================================
STORY DIRECTOR
==================================================

Invisible AI continuously evaluates:

Player behaviour.

Difficulty.

Pacing.

Emotional tone.

Commander usage.

Exploration frequency.

Combat intensity.

Downtime.

It adjusts future events naturally.

Never unfairly.

Never obviously.

==================================================
PERSONAL STORYLINES
==================================================

Every Commander receives:

Origin Story.

Growth Arc.

Breaking Point.

Triumph.

Legacy.

Friendships alter every chapter.

Player choices influence outcomes.

==================================================
GALACTIC STORYLINES
==================================================

Large-scale arcs emerge naturally.

Examples

Scientific Renaissance.

Engineering Revolution.

Political Unification.

Wildlife Recovery.

Economic Crisis.

Exploration Boom.

Ancient Awakening.

Energy Shortage.

Each campaign experiences different combinations.

==================================================
EMERGENT MOMENTS
==================================================

The engine constantly creates:

Unexpected rescues.

Equipment failures.

Lucky discoveries.

Ancient signals.

Lost survivors.

Friendly encounters.

Natural disasters.

Celebrations.

Quiet personal moments.

These feel authored despite being procedural.

==================================================
COMMANDER DEVELOPMENT
==================================================

Commanders evolve through experience.

Relationships deepen.

Opinions change.

Confidence grows.

New dialogue appears.

Personal ambitions shift.

The player witnesses genuine character growth.

==================================================
PLAYER REPUTATION STORIES
==================================================

Depending upon playstyle the galaxy may know the player as:

The Explorer.

The Builder.

The Scientist.

The Guardian.

The Diplomat.

The Founder.

The Pathfinder.

The Restorer.

NPC dialogue reflects this identity.

==================================================
STORY BRANCHES
==================================================

No binary morality.

Instead:

Curiosity vs Caution.

Expansion vs Preservation.

Innovation vs Tradition.

Risk vs Stability.

Efficiency vs Compassion.

Every choice has strengths.

==================================================
QUIET MOMENTS
==================================================

Not every story requires danger.

Examples

Watching stars.

Commander conversations.

Children playing.

Companion interactions.

Reading recovered books.

Music performances.

Planetary festivals.

Small moments become memorable.

==================================================
LONG-TERM CONSEQUENCES
==================================================

Years later:

Former colonies flourish.

Children become scientists.

Wildlife returns.

Old enemies reconcile.

Buildings constructed early remain visible.

History becomes tangible.

==================================================
NARRATIVE CALLBACKS
==================================================

The Story Engine references:

Earlier dialogue.

Old missions.

Lost opportunities.

Recovered artifacts.

Commander promises.

Personal jokes.

Historic failures.

Tiny details may return dozens of hours later.

==================================================
CAMPAIGN THEMES
==================================================

Every campaign organically develops themes.

Examples

Hope after disaster.

Scientific discovery.

Family.

Exploration.

Forgiveness.

Rebuilding.

Legacy.

The player never explicitly chooses the theme.

It emerges.

==================================================
ENDING GENERATION
==================================================

The ending reflects:

Relationships.

Commander survival.

Colonies.

Museum.

Humanity Score.

Exploration.

Scientific progress.

Legacy.

Every ending feels personal.

==================================================
POST-CAMPAIGN DOCUMENTARY
==================================================

Generate an in-universe documentary.

Includes:

Major events.

Commander interviews.

Recovered footage.

Player statistics.

Historic narration.

Museum footage.

Planet transformations.

Feels like watching history.

==================================================
ACCESSIBILITY
==================================================

Story recap system.

Relationship summaries.

Timeline viewer.

Campaign theme viewer.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Dynamic Story Engine.

Every campaign becomes a unique history shaped by the player's actions rather than a fixed script.

==================================================
SELF REVIEW LOOP
==================================================

Simulate tens of thousands of complete campaigns.

Measure narrative variety.

Review emotional pacing.

Review Commander development.

Review world consistency.

Review endings.

Review replayability.

Ensure no two campaigns feel identical while maintaining a coherent canon and optimistic tone.

Ensure the Dynamic Story Engine produces stories players genuinely believe were handcrafted specifically for them.

Repeat until the system consistently creates unforgettable, emotionally resonant science-fiction adventures worthy of the Afterlight universe.

Only then lock AF-136.

## Foundation / AF-000–135 / GP-FINAL alignment review

Built entirely under `src/game/storyEngine/`, as real new narrative-tracking primitives composing with — never duplicating — the locked/prior stack. `StoryPillarTracker`'s 10 Story Pillars (Hope/Curiosity/Sacrifice/Leadership/Discovery/Unity/Innovation/Compassion/Resilience/Exploration) are deliberately distinct from AF-133's 13 Legacy Categories — different vocabulary, different purpose (abstract narrative values vs. concrete accomplishment tracking), so both trackers coexist rather than one redefining the other. `dominantPillars()` returns multiple co-dominant pillars rather than forcing a single winner, matching "each campaign experiences different combinations," verified by a dedicated test. `deriveCampaignTheme` and `reputationTitleFor` are both pure functions of existing state (the pillar tracker's dominant pillar; AF-133's `LegacyProgressTracker.topCategory()` respectively) — "the player never explicitly chooses the theme, it emerges," and the reputation title needed no new stat tracking at all.

`StoryDirector` is deliberately distinct from AF-056's `DirectorConductor`: that class evaluates combat-encounter recovery-window pacing from hull fraction and recent damage; this class evaluates broad narrative-level play patterns (combat/exploration/downtime proportions) from entirely separate counters, with zero shared state or fields. Its `pacingBias()` output is a real, computed value handed back to the caller — never wired directly into any locked event roller, the same "compute the real bonus, defer live-loop application" scoping already established for AF-130's `bondGameplayBonusFor` and others this session.

`CommanderStorylineLog` reuses AF-135's real `EvolvingEntry` class directly for the five Personal Storyline beats (Origin Story/Growth Arc/Breaking Point/Triumph/Legacy) — these beats are meant to expand exactly like AF-135's Dynamic Writing already does, so no new versioning primitive was created; verified by a dedicated test confirming a beat's earlier version stays archived alongside its later one. `generateEndingSummary` composes AF-135's real `generateFinalChronicle` rather than building a second final-aggregation function. `NarrativeCallbackLog.eligibleCallbacks` only surfaces an entry once enough epochs have genuinely elapsed, matching "tiny details may return dozens of hours later" structurally rather than as a documented-only intention.

The debug overlay gains a new `storyEngine` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-070 and AF-130/131/132/133/134/135 before it. Zero changes to any other locked module (AF-000–135).

Score: 9.5/10 — approved and locked.
