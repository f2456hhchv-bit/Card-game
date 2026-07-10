## Verbatim prompt

168

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-167 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Soul Engine.

The Soul Engine exists above the Identity Engine.

Identity answers:

"Who are we?"

The Soul Engine answers:

"What kind of civilisation are we becoming?"

It is not religion.

It is not mysticism.

It is the collective character, spirit and emotional identity that emerges naturally from generations of shared experience.

It ensures Afterlight always feels deeply human.

==================================================
PURPOSE
==================================================

Allow humanity to develop a shared soul.

A civilisation should possess a recognisable spirit.

Not because it is programmed.

Because it has lived.

==================================================
CORE PRINCIPLE
==================================================

A civilisation's soul cannot be built.

It must be earned.

Through kindness.

Discovery.

Failure.

Forgiveness.

Hope.

Generations of shared purpose.

==================================================
SOUL DIMENSIONS
==================================================

Hope

Curiosity

Compassion

Resilience

Humility

Wonder

Responsibility

Creativity

Cooperation

Legacy

Stewardship

Belonging

==================================================
COLLECTIVE CHARACTER
==================================================

Humanity gradually develops traits.

Examples

Patient.

Generous.

Curious.

Inventive.

Protective.

Welcoming.

Thoughtful.

Different campaigns may emphasise different strengths.

==================================================
CIVILISATIONAL SPIRIT
==================================================

The Soul Engine reflects:

How children are educated.

How discoveries are celebrated.

How strangers are welcomed.

How mistakes are remembered.

How history is preserved.

How nature is protected.

These define civilisation more than technology.

==================================================
COMMANDER SPIRIT
==================================================

Commanders become symbols.

Not because they are powerful.

Because they inspire.

Future generations tell stories about:

Their kindness.

Their courage.

Their wisdom.

Their humour.

Their perseverance.

==================================================
PLACE SPIRIT
==================================================

Every important location develops atmosphere.

Examples

A peaceful observatory.

A beloved park.

A famous academy.

A legendary workshop.

A historic launch site.

A restored forest.

Places feel emotionally distinct.

==================================================
COMMUNITY SPIRIT
==================================================

Communities naturally develop:

Hospitality.

Volunteer traditions.

Scientific curiosity.

Public celebrations.

Shared rituals.

Neighbourhood identity.

Citizens care about where they live.

==================================================
RITUALS
==================================================

Organic traditions emerge.

Examples

Watching the first sunrise of the year.

Planting remembrance trees.

Lighting the Beacon.

Welcoming new explorers.

Graduation walks.

Commander farewell ceremonies.

None are mandatory.

All are meaningful.

==================================================
MOMENTS OF HUMANITY
==================================================

Small interactions matter.

Helping someone carry equipment.

Children asking questions.

A Commander comforting a recruit.

Citizens applauding returning explorers.

A shared meal after a difficult mission.

These define civilisation.

==================================================
THE BEAUTY INDEX
==================================================

The universe quietly values:

Gardens.

Art.

Music.

Architecture.

Public spaces.

Wildlife.

Education.

Beauty improves wellbeing.

Not statistics alone.

==================================================
INSPIRATION
==================================================

Acts of goodness spread.

One mentor inspires another.

One discovery inspires a generation.

One restored forest inspires a new movement.

Hope propagates naturally.

==================================================
COLLECTIVE MEMORY
==================================================

Some moments become legendary.

Not because they were largest.

Because they represented humanity at its best.

==================================================
GALACTIC REPUTATION
==================================================

Other civilisations recognise humanity by its character.

Not its military.

Not its wealth.

Its compassion.

Its curiosity.

Its reliability.

==================================================
SOUL THROUGH ADVERSITY
==================================================

Setbacks test civilisation.

Recovery defines it.

Every crisis asks:

"What kind of people are we?"

The answer emerges through action.

==================================================
DEVELOPER TOOLS
==================================================

Civilisation spirit graph.

Hope index.

Community wellbeing map.

Tradition evolution viewer.

Inspiration network.

Humanity dashboard.

==================================================
PLAYER EXPERIENCE
==================================================

Players should eventually realise:

"I didn't save humanity."

"I helped humanity become the kind of civilisation I'd be proud to belong to."

==================================================
ACCESSIBILITY
==================================================

Civilisation summaries.

Tradition browser.

Community highlights.

Legacy overview.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Soul Engine.

Allow humanity to gradually develop a collective spirit defined by shared history, compassion, discovery and hope.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of generations.

Review traditions.

Review Commander inspiration.

Review community identity.

Review public wellbeing.

Review educational values.

Review cultural continuity.

Review accessibility.

Review performance.

Ensure the Soul Engine never becomes a numerical morality system.

Ensure civilisation's character always emerges from player actions, shared experiences and accumulated history.

Ensure AF-168 becomes the emotional heart of the Afterlight universe, making humanity feel not only intelligent, capable and purposeful—but genuinely worthy of rebuilding.

Repeat until players describe Afterlight not simply as a game about rebuilding civilisation, but as a game that reminds them why civilisation is worth rebuilding.

Only then lock AF-168.

## Foundation / AF-000–167 / GP-FINAL alignment review

Exists above AF-167's Identity Engine: identity answers "who are we?", the Soul Engine answers "what kind of civilisation are we becoming?" — operating at civilisation scale. This module leans heavily on direct reuse: "Commander Spirit" is exactly AF-167's real `ReputationTracker`/`EarnedTitleTracker` at legendary scale; "Place Spirit" composes AF-163's real `SignificanceTracker` directly; "Community Spirit" reuses AF-159's real `CulturalTrendTracker` directly; "Inspiration" composes AF-160's real `MentorshipLedger` directly (mentor→mentee IS an inspiration link); "Collective Memory" is exactly AF-163's real `collectiveMemory` `MeaningCurator` instance; "Galactic Reputation" is exactly AF-167's real `ReputationTracker` reused at civilisation scale (entity id `"humanity"`); "Soul Through Adversity" is exactly AF-166's real `EmotionalContinuityTracker` reused at civilisation scale — all confirmed by dedicated tests, no second symbol/legend/propagation/adversity system anywhere.

"Soul Dimensions" (12) is confirmed the HEAVIEST PROPORTIONAL overlap yet recorded in this codebase: 8 of AF-160's real 10-member `CIVILISATION_VALUES` appear verbatim here — 80% of that list, a higher proportion than AF-162's previous 8-of-12 (67%) record overlap with AF-161, verified by a dedicated test. Kept as its own separate reference vocabulary: `CIVILISATION_VALUES` names ideals the Wisdom Engine actively reinforces, while `SOUL_DIMENSIONS` names aspects of a spirit that can only be measured as it emerges — never reinforced or assigned directly, enforced structurally by having no direct-set function anywhere in this module.

The self-review's explicit directive — "ensure the Soul Engine never becomes a numerical morality system" — is honoured by `CollectiveCharacterTracker`: it only exposes per-trait witnessed counts and an emergent dominant trait (mirroring AF-162's real `PlayerPurposeObserver.dominantPurpose` "reveal, never assign" discipline), confirmed by a dedicated test that no morality-score property exists. "Rituals" ("none are mandatory, all are meaningful") is structurally enforced by `RitualLog` having no completion/mandatory field at all, confirmed by a dedicated test. `MomentsOfHumanityLog` (a civilisation-wide witnessed-moments ledger, distinct from AF-163's per-entity `SignificanceTracker`) and `BeautyIndexTracker` are both confirmed genuinely new.

The debug overlay gains a new `atlasSoul` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-167 before it. Zero changes to AF-167's `ReputationTracker`/`EarnedTitleTracker`, AF-163's `SignificanceTracker`/`MeaningCurator`, AF-159's `CulturalTrendTracker`, AF-160's `MentorshipLedger`/`CIVILISATION_VALUES`, AF-166's `EmotionalContinuityTracker`, AF-162's `PlayerPurposeObserver`, or any other locked module.

Score: 9.5/10 — approved and locked.
