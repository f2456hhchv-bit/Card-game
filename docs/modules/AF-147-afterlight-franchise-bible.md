## Verbatim prompt

147

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-146 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Afterlight Franchise Bible.

Unlike previous modules, this is not a gameplay system.

It is the permanent reference document that ensures every future game, expansion, novel, animation, soundtrack, tabletop adaptation and multimedia project remains part of one coherent universe.

This document defines the DNA of the franchise.

==================================================
PURPOSE
==================================================

The Franchise Bible protects Afterlight across decades.

It ensures:

Consistency.

Quality.

Lore accuracy.

Visual identity.

Technical philosophy.

Emotional identity.

Creative direction.

No future project should contradict the Bible.

==================================================
FRANCHISE MISSION
==================================================

Afterlight is a hopeful science-fiction universe centred on rebuilding civilisation through exploration, knowledge, engineering, cooperation and legacy.

Conflict exists.

But rebuilding always matters more than winning.

==================================================
UNIVERSE FOUNDATIONS
==================================================

Core Themes

Hope

Discovery

Civilisation

Curiosity

Humanity

Legacy

Science

Friendship

Education

Stewardship

Every story reinforces at least three themes.

==================================================
TIMELINE AUTHORITY
==================================================

The Bible defines:

Earth Era

Collapse Era

First Expedition

Atlas Initiative

Reconstruction Era

Expansion Era

Beacon Era

Future Eras

All future content references this chronology.

==================================================
CANON LEVELS
==================================================

Tier One

Main Games

Tier Two

Official Expansions

Tier Three

Official Companion Books

Tier Four

Museum Records

Tier Five

Educational Archives

Tier Six

Developer Commentary

Conflicts always resolve in favour of the highest canon tier.

==================================================
VISUAL IDENTITY
==================================================

Architecture

Elegant.

Optimistic.

Functional.

Human-centred.

Technology

Readable.

Clean.

Purposeful.

Scientific.

Lighting

Warm.

Hopeful.

Natural.

Celestial.

Colour Language

White.

Gold.

Deep Blue.

Emerald.

Silver.

Soft Amber.

Avoid dystopian visual overload.

==================================================
MUSIC IDENTITY
==================================================

Musical pillars:

Wonder.

Hope.

Reflection.

Adventure.

Civilisation.

Discovery.

Silence remains an intentional artistic tool.

==================================================
LANGUAGE STYLE
==================================================

Dialogue avoids:

Edgelord cynicism.

Needless profanity.

Hopeless nihilism.

Instead emphasises:

Competence.

Kindness.

Professionalism.

Curiosity.

Occasional humour.

==================================================
COMMANDER STANDARDS
==================================================

Every Commander represents:

A philosophy.

A profession.

A gameplay identity.

A human story.

No Commander exists purely because they fight well.

==================================================
WORLD STANDARDS
==================================================

Every planet includes:

History.

Culture.

Ecology.

Economy.

Education.

Architecture.

Wildlife.

Scientific value.

Hope for the future.

==================================================
TECHNOLOGY RULES
==================================================

Technology should solve problems.

Not replace humanity.

People remain central.

AI assists.

Humans decide.

==================================================
EXPANSION RULES
==================================================

Every expansion must:

Introduce genuine discovery.

Expand civilisation.

Respect history.

Create memorable characters.

Leave the universe richer than before.

==================================================
MERCHANDISE GUIDELINES
==================================================

Products should celebrate:

Engineering.

Science.

Exploration.

Commanders.

Museum artifacts.

Companions.

Architecture.

History.

Avoid glorifying destruction.

==================================================
ADAPTATION GUIDELINES
==================================================

Books.

Television.

Animation.

Film.

Board games.

Educational media.

Each adaptation preserves:

Core philosophy.

Timeline.

Themes.

Hopeful identity.

==================================================
COMMUNITY VALUES
==================================================

Encourage:

Creativity.

Knowledge sharing.

Accessibility.

Respect.

Constructive collaboration.

Celebration of discovery.

==================================================
FUTURE VISION
==================================================

Afterlight should remain recognisable fifty years from now.

Technology may evolve.

Graphics may evolve.

Gameplay may evolve.

The identity remains constant.

==================================================
THE FRANCHISE TEST
==================================================

Every new project answers:

Does it strengthen hope?

Does it expand discovery?

Does it deepen civilisation?

Does it respect history?

Does it reward curiosity?

Does it preserve humanity?

If not...

It is redesigned.

==================================================
OUTPUT
==================================================

Implement the Afterlight Franchise Bible.

It becomes the permanent creative reference for every current and future Afterlight project across all media.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-146.

Validate thematic consistency.

Validate canon.

Validate artistic identity.

Validate narrative philosophy.

Validate technical direction.

Stress-test hypothetical sequels, novels, films, comics and expansions.

Ensure every future Afterlight project feels unmistakably part of the same universe while continuing to evolve.

Repeat until the Franchise Bible provides a timeless foundation capable of guiding the Afterlight universe for generations.

Only then lock AF-147.

## Foundation / AF-000–146 / GP-FINAL alignment review

The fourth module in a row whose subject is franchise-level governance rather than in-game mechanics, after the real `docs/CONSTITUTION.md`, AF-145's Atlas Core, and AF-146's Design Constitution — and, per its own text, explicitly "not a gameplay system." Confirmed genuinely new: `eraFor` maps epochs onto a real, named 8-Era chronology, confirmed absent anywhere else (AF-068's `CampaignRuntime` chapters are a gameplay-campaign structure, not a franchise-wide timeline); `CanonAuthorityResolver` is a real conflict resolver over the spec's own 6-tier canon ladder, mirroring AF-144's real `DecisionRouter` tier-comparison shape but arbitrating lore statements rather than gameplay change requests — a distinct domain, not a duplicate.

Two overlaps are documented rather than merged. "Core Themes" (10 items) is the densest vocabulary overlap yet with the project's other three abstract-value lists — the real Constitution's Design Pillars, AF-146's `TEN_PILLARS` (shares Hope/Discovery/Humanity/Civilisation verbatim), and AF-145's Atlas Principle virtues (shares Curiosity/Hope/Stewardship/Discovery/Legacy verbatim) — kept as its own separate, fourth list, with a genuinely new minimum-count rule ("at least three themes") distinct from the other three lists' exact-N or all-N gates. "The Franchise Test" (6 questions, all-must-pass) is the *fifth* occurrence of the same checklist-gate mechanic in this codebase, after the real Constitution's two gates, AF-146's Expansion Test, and AF-145's Design Validation — kept as its own separate, sixth question list.

Visual/Music/Language Identity, Commander/World Standards, Technology Rules, Merchandise/Adaptation Guidelines, Community Values, and Future Vision are all kept as pure reference data with no runtime validator, since this module explicitly disclaims being a gameplay system and these sections have no computational analog — the same honest scope boundary AF-140 through AF-146 already applied to pure design-philosophy sections.

`CanonRecordLedger` and `FranchiseComplianceRegistry` give the Canon Levels and Franchise Test real, inspectable evidence rather than design-promise text with nothing behind it. The debug overlay gains a new `franchiseBible` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-145 before it. Zero changes to `docs/CONSTITUTION.md`, AF-144's `DecisionRouter`, AF-145/146's charters, AF-068's `CampaignRuntime`, or any other locked module.

Score: 9.5/10 — approved and locked.
