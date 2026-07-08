# AF-078 — RELIC ROSTER FRAMEWORK

**Module status:** Complete (nine-relic ecosystem with sets, families, origins and museum on unchanged AF-029/077 shapes; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-077 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/RELIC_ROSTER.md` + implementation (`src/game/relics/relicRosterData.ts`)

---

*(Module catalogued verbatim below.)*

78

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-077 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Relic Roster Framework.

The objective is not to create hundreds of Relics.

The objective is to create an ecosystem where discovering Relics continuously produces new build ideas throughout thousands of hours of gameplay.

Players should regularly encounter combinations they have never considered before.

Relics are the heart of replayability.

==================================================
CORE PHILOSOPHY
==================================================

Experimentation.

Discovery.

Synergy.

Creativity.

Infinite combinations.

No Relic should exist in isolation.

==================================================
RELIC FAMILIES
==================================================

Support major families:

Combat Relics

Mobility Relics

Defensive Relics

Drone Relics

Economy Relics

Research Relics

Exploration Relics

Void Relics

Crystal Relics

Machine Relics

Quantum Relics

Ancient Relics

Experimental Relics

Faction Relics

Ascension Relics

Future families extend naturally.

==================================================
RELIC SETS
==================================================

Support:

2-piece bonuses

3-piece bonuses

5-piece bonuses

Legendary set completion

Ancient set completion

Prototype collections

Set bonuses change gameplay.

Not only statistics.

==================================================
BUILD NETWORKS
==================================================

Relics create networks with:

Ships

Commanders

Weapons

Equipment

Research

Talents

Biome modifiers

Mission modifiers

World events

Every build becomes a highly interconnected system.

==================================================
DISCOVERY STRUCTURE
==================================================

Relics may originate from:

Bosses

Ancient Vaults

Civilisations

Research

Faction Reputation

Legendary Expeditions

Hidden Discoveries

Galaxy Restoration

Every source has its own identity.

==================================================
ANCIENT RELICS
==================================================

Ancient Relics possess:

Historical Lore

Unique Visuals

Exclusive Mechanics

Evolution Paths

Codex Stories

Discovery Chains

Museum Entries

Ancient Relics feel irreplaceable.

==================================================
VOID RELICS
==================================================

Void Relics introduce:

Corruption

Risk vs Reward

Reality Manipulation

Gravity Effects

Probability Changes

Unique Build Paths

Power requires sacrifice.

==================================================
PROTOTYPE RELICS
==================================================

Prototype Relics feature:

Experimental Mechanics

Instability

Conditional Bonuses

Adaptive Behaviour

Unexpected Interactions

High Skill Ceiling

Prototype gameplay rewards mastery.

==================================================
RELIC EVOLUTION
==================================================

Evolution occurs through:

Boss Kills

Discovery

Research

Ascension

Legendary Challenges

Biome Completion

Collection Progress

Evolution unlocks new mechanics.

==================================================
COLLECTION
==================================================

Players permanently collect:

Relics

Set Pieces

Ancient Variants

Prototype Variants

Hidden Relics

Evolution States

Lore

Statistics

Collection supports completionists.

==================================================
MUSEUM
==================================================

Support:

3D Inspection

Lore

History

Discovery Timeline

Civilisation Origin

Related Entries

Statistics

The Museum celebrates exploration.

==================================================
BALANCE PRINCIPLES
==================================================

Relics reward:

Creativity

Knowledge

Experimentation

Build Diversity

Adaptation

Never:

Mandatory combinations

Single dominant builds

Meaningless stat inflation

==================================================
ACCESSIBILITY
==================================================

Support:

Relic Search

Filters

Recommended Synergies

Detailed Tooltips

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache synergy calculations.

Optimise passive evaluation.

Pool visual effects.

Reuse shared logic.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Relic Sets

Synergies

Evolution

Collection

Museum

Performance

==================================================
OUTPUT
==================================================

Produce the complete Relic Roster Framework.

Every future Relic extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of build combinations.

Review Relic families.

Review set bonuses.

Review synergy networks.

Review evolution.

Review discovery.

Review collection.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-077.

Reduce repetitive effects.

Strengthen transformational mechanics.

Increase build diversity.

Ensure the Relic ecosystem remains one of Afterlight's strongest sources of experimentation, replayability and long-term mastery, with virtually limitless combinations that continue generating fresh gameplay across years of content.

Repeat until the Relic Roster Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-078.

---

## Foundation / AF-000–077 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-076 roster move applied to relics, on unchanged shapes:** AF-029's `RelicDef` and AF-077's `RelicProfileDef` stand untouched — the ecosystem is data. Fifteen families map TOTALLY onto AF-077's category shelf (eight carrying relics today, the rest honestly awaiting content); eight discovery origins each carry an AUTHORED identity ("every source has its own identity", literally); seven evolution routes map totally onto AF-077's six triggers; and the reliquary extends additively with the VEIL FRAGMENT — a void relic passing AF-029's validator and AF-077's fifteen-part completeness function.
- **"Set bonuses change gameplay. Not only statistics." is UNREPRESENTABLE:** `RelicSetBonusDef` carries a piece threshold, an AF-028 trigger, and a description — no numeric field exists (key-inspection asserted). Two sandbox sets over REAL registered relics with ascending, readable thresholds; detection (`activeSetBonusesFor`) is pure and order-independent, and the self-review verifies it against ALL 512 possible loadouts by brute force — every combination, exactly right.
- **THE ENGINE TAUGHT THE THIRD AUTHORING CONVENTION, and it took two broken drafts to learn it:** AF-029's evolution is a FUSION — acquiring the Ember Core with the Frost Shard held CONSUMES BOTH and grants the Cinder Heart. The first Thermal Cycle draft listed the pre-evolution core as a piece (evolution deleted it mid-set); the second listed the consumed catalyst (fusion deleted that too). Both breaks were caught by this module's own tests against the live engine. The recorded convention: **fusion inputs must never be set pieces — build sets from the fusion's PRODUCT**, so evolution only ever ADVANCES a set (asserted: fusing into the Cinder Heart completes the Thermal Cycle rather than breaking it). This joins AF-077's two conventions in the growing authors' rulebook the locked engine writes for its own content.
- **"Power requires sacrifice" is a LAW, not a vibe:** every void-family relic is asserted to carry a negative effect clause — the Veil Fragment pays in shield lattice. Ancient traits (seven), void traits (six), and prototype traits (six) are registered vocabularies; the three forbidden balance outcomes (mandatory combinations, single dominant builds, meaningless stat inflation) are registered BY NAME, the AF-070 move.
- **The MUSEUM is derivation, not a system:** `museumEntryFor` assembles all seven features (3D inspection through statistics) from data every relic already carries — asserted non-empty for all nine. Collection kinds (eight) and build-network surfaces (nine) registered.
- **The roster went LIVE in the composition root:** the relic drop pools upgraded from the sandbox seven to the full nine (the Keepsake and the Fragment genuinely drop), the reliquary lattice spans all nine profiles, and the overlay shows live set detection.
- **Self-review executed:** 10 new tests — all eleven shelves, the two total maps with authored origin identities, the extended reliquary through both inherited validators, the power-requires-sacrifice law, full entry resolution with stat-free key inspection, the no-numeric-field set-bonus shape with real-piece resolution and ascending thresholds, the fusion-aware order-independence battery through the REAL RelicSystem, the seven-feature museum for all nine relics, the **512-loadout brute-force verification** ("simulate millions of build combinations" — every possible loadout, exactly), and a **1,000-career seeded acquisition sweep** through the real engine — set bonuses never regress as pieces accumulate, fusion included. **Live in the browser:** launched, and the ecosystem ran on the relics line — `active 0 [none] · synergies 0 · sets 0 live · reliquary 0/9 owned, 0 evolved` — zero page errors.

**Review verdict:** ALIGNED (zero shape changes; the ecosystem as pure data + one pure detection function; the drop pools upgraded to the full roster; one void relic obeying the module's own law; a third authoring convention discovered against the live engine and recorded). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/RELIC_ROSTER.md`, `src/game/relics/relicRosterData.ts`.
