# AF-077 — RELIC FRAMEWORK

**Module status:** Complete (framework layered over AF-029's unchanged relic system; eight fully profiled relics; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-076 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/RELIC_ARCHITECTURE.md` + implementation (`src/game/relics/relicFrameworkData.ts`, `RelicCollectionRuntime.ts`)

---

*(Module catalogued verbatim below.)*

77

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-076 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Relic Framework.

Relics are not simple stat upgrades.

Every Relic should fundamentally change gameplay.

The most exciting moment in every expedition should often be discovering a Relic that transforms an average build into something entirely new.

Relics create the "one more run" feeling.

==================================================
CORE PHILOSOPHY
==================================================

Discovery.

Transformation.

Creativity.

Synergy.

Replayability.

Every Relic should encourage players to rethink their build.

==================================================
RELIC ARCHITECTURE
==================================================

Every Relic contains:

Unique ID

Name

Visual Identity

Rarity

Origin

Lore

Passive Effect

Conditional Effect

Synergy Tags

Stacking Rules

Evolution Rules

Statistics

Collection Status

Codex Entry

Future Expansion Hooks

Every Relic feels handcrafted.

==================================================
RELIC TIERS
==================================================

Support:

Common

Uncommon

Rare

Epic

Legendary

Ancient

Prototype

Mythic

Tier affects discovery frequency.

Never long-term viability.

==================================================
RELIC CATEGORIES
==================================================

Support:

Combat

Mobility

Defence

Economy

Critical

Status

Summoning

Drone

Exploration

Research

Boss

Void

Crystal

Machine

Quantum

Experimental

Future categories extend naturally.

==================================================
BUILD DEFINING DESIGN
==================================================

Relics should enable:

New playstyles

Unexpected synergies

Alternative scaling

Risk vs Reward

Combo interactions

Mechanical experimentation

Relics should rarely provide only flat bonuses.

==================================================
SYNERGY SYSTEM
==================================================

Relics interact with:

Weapons

Ships

Commanders

Equipment

Research

Ascension

Biome Effects

Mission Modifiers

Every build becomes an interconnected ecosystem.

==================================================
STACKING RULES
==================================================

Support:

Unique Relics

Limited Stack

Unlimited Stack

Mutually Exclusive

Evolution Chains

Fusion Combinations

Stacking remains readable.

==================================================
RELIC EVOLUTION
==================================================

Certain Relics evolve through:

Kills

Bosses

Exploration

Research

Ascension

Legendary Discoveries

Evolution changes mechanics.

Not only numbers.

==================================================
DISCOVERY
==================================================

Relics may be discovered through:

Exploration

Bosses

Ancient Vaults

Legendary Missions

Research

World Events

Galaxy Restoration

Discovery always feels rewarding.

==================================================
COLLECTION
==================================================

Track:

Owned

Discovered

Mastered

Evolved

Hidden Variants

Statistics

Lore

Collection encourages experimentation.

==================================================
CUSTOMISATION
==================================================

Support:

Relic Frames

Animated Icons

Discovery Animations

Lore Themes

Collection Displays

Museum Presentation

Visuals reinforce rarity.

==================================================
BALANCE PRINCIPLES
==================================================

Relics reward:

Creativity.

Knowledge.

Experimentation.

Build diversity.

Never mandatory optimisation.

No Relic should invalidate others.

==================================================
ACCESSIBILITY
==================================================

Support:

Detailed Tooltips

Synergy Preview

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Search & Filters

==================================================
PERFORMANCE
==================================================

Cache Relic calculations.

Pool effect systems.

Optimise passive evaluation.

Reuse visual assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Active Relics

Passive Effects

Synergies

Evolution State

Statistics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Relic Framework.

Every future Relic extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of builds.

Review Relic identity.

Review build diversity.

Review evolution.

Review synergy.

Review collection.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-076.

Reduce redundant effects.

Strengthen transformational gameplay.

Improve discovery excitement.

Ensure every Relic feels capable of fundamentally changing a run, encouraging experimentation and creating memorable stories that players will discuss long after the expedition ends.

Repeat until the Relic Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-077.

---

## Foundation / AF-000–076 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-029's locked relic system is EXTENDED, byte-for-byte untouched — and it turns out the spec's central demand was ALREADY AF-029's law:** "relics should rarely provide only flat bonuses" is enforced by `validateRelicDef`, which rejects any relic without a non-numeric behaviour clause — shipped at AF-029, re-asserted here across the extended reliquary. The framework's "conditional effect" architecture part IS that clause. `RelicDef`, the rarity/category shelves, the stacking model, exclusion groups, synergy detection, and evolution all stand unchanged.
- **THREE spec vocabularies land as TOTAL MAPS onto locked shelves:** eight tiers onto AF-029's seven rarities, sixteen categories onto its thirteen, and six stacking rules onto its four rules PLUS its `maxStacks` semantics — with FUSION COMBINATIONS binding to the existing `evolutionRequires` field (registered future — a fusion is an evolution that requires a partner; no second fusion engine).
- **"Every relic feels handcrafted" is a FUNCTION:** `relicArchitectureFor` asserts all FIFTEEN architecture parts per relic — id through future expansion hooks — and every profile is stat-free by key inspection ("tier affects discovery frequency, never long-term viability").
- **The reliquary extends additively:** AF-029's seven relics asserted unchanged at the head, joined by the SINGULARITY KEEPSAKE — a quantum relic with a REAL trade-off (+damage, −speed: "the Zone charges rent"), a riskVsReward build-defining declaration, and full passage through AF-029's UNCHANGED `RelicSystem` in tests (acquisition, stack-cap uniqueness, synergy detection with the warden token).
- **Two authoring conventions were discovered by AF-029's own machinery and recorded for every future relic author:** uniqueness is expressed through `maxStacks: 1` (the engine caps on stacks, not on the flag), and synergy declarations must live on the ALPHABETICALLY-EARLIER relic (the engine sorts ids and consults one side). Both corrections were caught by tests, fixed in data, and documented — the locked engine teaching the content how to be authored.
- **Collection is a MONOTONE STATE LATTICE:** `RelicCollectionRuntime` advances discovered → owned → mastered (mastery REQUIRES ownership; states never regress; no demote/forget operation, prototype-asserted) with evolution as a permanent parallel mark. It is fed by REAL play: both relic-acquisition sites in the composition root advance the lattice on genuine drops, and AF-029's own evolution callback records evolutions forever.
- **Registered vocabulary for the rest:** seven discovery sources (every profile names one), six evolution triggers (every evolving relic names one — the Ember Core evolves through kills into the Cinder Heart, whose codex note records that "evolution changed the mechanics, not just the numbers"), six build-defining kinds, eight synergy surfaces, six customisation kinds, seven collection states — all counted in tests.
- **Self-review executed:** 9 new tests — all ten shelves, the three total maps, the extended reliquary with AF-029's validator and the no-flat-bonus law, the fifteen-part completeness function, the stat-free profile inspection with per-profile source/kind resolution, the Keepsake's full passage through the unchanged engine, the monotone-lattice battery (gated mastery, no regression, permanent evolution, no-removal prototype), and a **1,000-career seeded collection sweep** — the lattice never regresses and mastered ≤ owned ≤ discovered always holds. **Live in the browser:** launched, and the reliquary ran on the relics line — `active 0 [none] · synergies 0 · reliquary 0/8 owned, 0 evolved` — zero page errors.

**Review verdict:** ALIGNED (AF-029 unchanged; one profile layer + one pure monotone-lattice runtime in the established wrapping class; three total vocabulary maps; the spec's central law recognised as already enforced; one roster addition with a real trade-off; two authoring conventions recorded). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/RELIC_ARCHITECTURE.md`, `src/game/relics/relicFrameworkData.ts` + `RelicCollectionRuntime.ts`.
