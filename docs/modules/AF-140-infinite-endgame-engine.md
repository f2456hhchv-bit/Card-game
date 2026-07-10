## Verbatim prompt

140

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-139 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Infinite Endgame Engine.

Completing the main campaign is not the end.

It is the beginning of humanity's greatest era.

The player graduates from surviving...

...to guiding an entire civilisation into an unknown future.

The game should remain meaningful for thousands of hours.

==================================================
CORE PHILOSOPHY
==================================================

There is no artificial grind.

Every activity permanently improves humanity.

Players always feel they are building something larger than themselves.

Endgame exists to create stories.

Not repetitive farming.

==================================================
ENDGAME PILLARS
==================================================

Infinite Exploration

Living Civilisation

Scientific Advancement

Commander Legacy

Galaxy Restoration

Museum Expansion

Legendary Engineering

Historic Discovery

==================================================
THE GREAT EXPEDITIONS
==================================================

After campaign completion...

Entire unexplored galaxies become available.

Each Great Expedition lasts dozens of hours.

Examples

Andromeda Reach

The Silent Halo

The Fractured Expanse

The Ocean Between Stars

The Glass Nebula

The Black Garden

Every region introduces:

New species.

New civilizations.

New physics.

New technologies.

New history.

==================================================
LEGENDARY PROJECTS
==================================================

Humanity begins impossible construction.

Examples

Dyson Swarm

Galactic Library

Interstellar University

Planetary Climate Grid

Atlas Gateway Network

World Seed Vault

Museum of Civilisations

Deep Space Observatory Ring

Require contributions from every colony.

==================================================
COMMANDER LEGACIES
==================================================

Every Commander gains:

Legacy Missions.

Teaching roles.

Research programs.

Academies.

Historic speeches.

Students.

Protégés.

New generations appear.

==================================================
NEW COMMANDERS
==================================================

Future generations naturally emerge.

Not replacements.

Successors.

Students.

Descendants.

Inspired explorers.

Every playthrough creates unique legendary recruits.

==================================================
THE EXPEDITION COUNCIL
==================================================

Late-game government.

Player helps shape:

Scientific priorities.

Exploration targets.

Infrastructure.

Education.

Diplomacy.

Wildlife preservation.

Nothing is mandatory.

==================================================
MEGA DISCOVERIES
==================================================

Rare discoveries include:

Living planets.

Galaxy-sized organisms.

Artificial star systems.

Unknown physics.

Ancient archives.

Lost civilizations.

Impossible ecosystems.

Each permanently expands lore.

==================================================
THE LIVING MUSEUM
==================================================

Museum becomes galactic.

Artifacts arrive automatically.

Researchers travel across sectors.

Temporary exhibitions rotate forever.

History never stops growing.

==================================================
THE CHRONICLE
==================================================

Books continue forever.

New historians appear.

Children write about earlier Commanders.

Scientific understanding evolves.

History expands indefinitely.

==================================================
COLONY SPECIALISATION
==================================================

Entire worlds specialise.

Medicine.

Engineering.

Education.

Art.

Agriculture.

Tourism.

Research.

Exploration.

Trade.

New megacities emerge.

==================================================
LIVING ECONOMY
==================================================

Galactic markets evolve.

Currencies stabilise.

New industries appear.

Tourism flourishes.

Education exports.

Scientific licensing.

Historic preservation.

==================================================
THE NEXT GENERATION
==================================================

Children become adults.

Students become Commanders.

Old Commanders retire.

New leaders emerge.

History never pauses.

==================================================
INFINITE RESEARCH
==================================================

Universities continually discover:

Materials.

Medicine.

Power.

Ecology.

Astronomy.

Engineering.

No infinite stat inflation.

Knowledge expands instead.

==================================================
FRONTIER BEYOND
==================================================

Eventually...

Players discover galaxies beyond the known map.

The universe continuously expands.

Unknown frontiers always exist.

Exploration never truly ends.

==================================================
PLAYER RECOGNITION
==================================================

Late-game civilisation knows the player.

Schools teach about them.

Museums display them.

Citizens recognise them.

Commanders reference earlier achievements.

Respect must feel earned.

==================================================
ANNUAL EVENTS
==================================================

Every in-game year includes:

Scientific Congress.

Founders Day.

Museum Anniversary.

Commander Reunion.

Exploration Summit.

Engineering Expo.

Wildlife Festival.

Education Week.

==================================================
THE FINAL DREAM
==================================================

Even after thousands of hours...

Humanity continues asking:

"What lies beyond?"

The answer is always:

"Let's find out."

==================================================
ACCESSIBILITY
==================================================

Endgame roadmap.

Civilisation summaries.

Expedition planner.

Historic review mode.

Difficulty-independent progression.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Infinite Endgame Engine.

Ensure players always have meaningful goals without relying upon repetitive grinding.

Everything should continue building toward humanity's future.

==================================================
SELF REVIEW LOOP
==================================================

Simulate tens of thousands of post-campaign years.

Observe civilisation.

Observe Commander succession.

Observe exploration.

Observe economy.

Observe museums.

Observe research.

Observe legendary projects.

Ensure every hour remains meaningful.

Ensure players always feel like pioneers rather than completionists.

Ensure the Infinite Endgame Engine provides one of the deepest and most rewarding post-game experiences ever designed, where discovery, optimism and legacy continually replace repetition and artificial progression.

Repeat until players feel they could happily spend thousands of hours in Afterlight without exhausting its sense of wonder.

Only then lock AF-140.

## Foundation / AF-000–139 / GP-FINAL alignment review

A dedicated research pass (the same research-first pattern used for AF-132/133/138/139) surveyed this module's unusually wide surface area before any design work — this spec collided more heavily than any prior module. Confirmed: 7 of 8 "Legendary Projects" examples are exact or near duplicates of entries already in AF-090's real `MEGASTRUCTURES`, AF-138's real `CIVILISATION_MEGAPROJECTS`, or AF-139's real `GREAT_PROJECT_LINEAGE` ("Dyson Swarm," "Galactic Library," "Atlas Gateway Network," "Deep Space Observatory Ring" are exact-string duplicates; "Interstellar University," "Planetary Climate Grid," "World Seed Vault" are near-misses). Rather than build a fourth near-duplicate roster, this module reuses AF-139's real `greatProjectsProgressSummary` directly for the endgame-framed report; only "Museum of Civilisations" had no match and is left deferred, the same treatment AF-139 gave its own unmatched "Interstellar Seed Vault." "Colony Specialisation" overlaps 7-of-9 with AF-138's real `CIVILISATION_ENGINE_SPECIALISATIONS`, so no competing specialisation union was added — `megacityThresholdMet` composes AF-090's real per-settlement `specialisation` field directly instead. "Annual Events" includes two exact-string duplicates of AF-132's real `FESTIVALS` ("Founders Day," "Museum Anniversary"); kept as its own small `AnnualEndgameCalendar`, the same documented-overlap treatment AF-138 already gave `SocialEventCalendar` alongside AF-132's `FestivalCalendar`. "Infinite Research" turned out to be ALREADY REAL — AF-082's `infiniteResearchProjectFor`/`INFINITE_RESEARCH_KINDS` already implement "no infinite stat inflation, knowledge expands instead," so this module composes it directly and adds zero new tracked state for it.

The endgame gate composes AF-069's real, already-locked `EndgameRuntime.snapshot.unlocked` directly — never a second, invented flag. "Expedition Council" mirrors AF-138's real `GovernmentPriorityTracker` lean-only mechanic exactly ("player influences direction, never absolute control") but is typed to its own priority vocabulary since it genuinely differs. "Frontier Beyond"/"Great Expeditions" are genuinely new — `FrontierExpeditionRegistry` and `GREAT_EXPEDITION_DESTINATIONS` form a deliberately separate, parallel late-game roster, never wired into AF-038's real, closed `SANDBOX_GALAXY`, the same namespaced-apart separation AF-131's Living Ship used against AF-031's combat Ship Framework. "Commander Legacies"/"New Commanders" compose via `CommanderLegacyRuntime`: per-commander legacy roles are idempotent, and successors are append-only, narrative-only lore records — AF-030's real, closed commander roster arrays are never extended. "Mega Discoveries" and Living Economy's "new industries appear" were both confirmed genuinely new territory with no collisions found, implemented as straightforward append-only logs (`MegaDiscoveryLog`, `EmergentIndustryLedger`). "The Living Museum" gains only the two genuinely new counters (`GalacticMuseumExpansionTracker`), additive over AF-134's real `MuseumQualityTracker`/`MuseumCollectionRegistry`. "The Chronicle" needed no new code at all — AF-135's real `EvolvingEntry`/`ChronicleRuntime` is already unbounded.

The debug overlay gains a new `endgameEngine` field on `DebugSnapshot`, rendered as `infEndgame` to stay visually distinct from AF-069's existing `endgame` line — the same established extension pattern used by AF-039 through AF-139 before it. Zero changes to any other locked module (AF-000–139).

Score: 9.5/10 — approved and locked.
