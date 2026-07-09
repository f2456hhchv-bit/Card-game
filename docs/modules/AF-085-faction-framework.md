# AF-085 — FACTION FRAMEWORK

**Module status:** Complete (the civilisation layer as profiles + a fifteen-part completeness law over AF-039's unchanged engine; the ten-civilisation register live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-084 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/FACTION_ARCHITECTURE.md` + implementation (`src/game/factions/factionFrameworkData.ts`)

---

*(Module catalogued verbatim below.)*

85

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-084 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Faction Framework.

Factions are not quest givers.

They are living civilizations with goals, fears, politics, economies and military power.

Every faction should continue evolving whether or not the player interacts with them.

Players should feel they exist inside a living galaxy rather than being the centre of it.

==================================================
CORE PHILOSOPHY
==================================================

Civilisation.

Politics.

Identity.

Consequences.

Living Worlds.

Every faction should feel capable of existing independently.

==================================================
FACTION ARCHITECTURE
==================================================

Every faction contains:

Unique ID

Name

Government

History

Leader

Military

Economy

Technology

Territory

Relationships

Reputation

Visual Identity

Audio Identity

Lore

Future Expansion Hooks

Nothing remains undefined.

==================================================
MAJOR FACTIONS
==================================================

Support:

Afterlight Initiative

United Human Frontier

Crystal Ascendancy

Machine Collective

Void Swarm

Celestial Conclave

Paragon Protocol

Stellar Nomads

The Eclipsed

Independent Colonies

Future factions extend naturally.

==================================================
FACTION IDENTITY
==================================================

Every faction possesses:

Unique Philosophy

Unique Technology

Unique Units

Unique Economy

Unique Architecture

Unique Music

Unique Dialogue

Unique Rewards

No faction should overlap excessively.

==================================================
REPUTATION SYSTEM
==================================================

Track:

Trust

Influence

Alliance

Hostility

Scientific Standing

Trade Standing

Military Standing

Historical Decisions

Reputation evolves dynamically.

==================================================
PLAYER INTERACTION
==================================================

Players influence factions through:

Mission Outcomes

Trade

Research

Rescue Operations

Diplomatic Decisions

Exploration

Technology Sharing

Civilian Support

Every action has consequences.

==================================================
FACTION RELATIONSHIPS
==================================================

Every faction maintains relationships with:

Every other faction.

Relationships evolve through:

Wars

Trade

Scientific Cooperation

Political Events

Territorial Expansion

Ancient Discoveries

The galaxy evolves naturally.

==================================================
GALACTIC POLITICS
==================================================

Support:

Peace Treaties

Wars

Trade Agreements

Joint Research

Military Alliances

Embargoes

Exploration Accords

Political instability creates gameplay.

==================================================
FACTION ECONOMIES
==================================================

Support:

Mining

Industry

Trade

Research

Military Production

Civilian Development

Exploration

Infrastructure

Economies influence world evolution.

==================================================
FACTION TERRITORY
==================================================

Control affects:

Mission Availability

Trade

Resources

Enemy Presence

Galaxy Events

Research

Story

Territory changes over time.

==================================================
FACTION REWARDS
==================================================

Support:

Blueprints

Ships

Weapons

Equipment

Relics

Commanders

Research

Cosmetics

Lore

Rewards reflect faction identity.

==================================================
ACCESSIBILITY
==================================================

Support:

Relationship Viewer

Reputation History

Faction Encyclopedia

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache faction states.

Optimise diplomacy calculations.

Lazy load faction data.

Reuse relationship systems.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Faction Status

Reputation

Relationships

Territory

Politics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Faction Framework.

Every future civilisation extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of galaxies.

Review diplomacy.

Review reputation.

Review territorial expansion.

Review political systems.

Review rewards.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-084.

Reduce repetitive faction behaviour.

Strengthen civilisation identity.

Improve galactic simulation.

Ensure every faction feels like a believable civilisation with evolving ambitions, believable politics and meaningful interactions that continue shaping the galaxy long after individual missions end.

Repeat until the Faction Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-085.

---

## Foundation / AF-000–084 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-039 is the engine; AF-085 is the civilisation doctrine over it:** the ten-id register, `FactionDef`'s thirteen fields, reputation levels/clamps, `CONFLICT_STATES`, the roster shapes, and `FactionRuntime` (relationships, weighted events, threshold ladder) stand untouched. `FactionProfileDef` wraps each profiled faction BY ID with the identity uniques the def didn't carry — architecture style, music theme, dialogue voice, signature reward kind, economy sectors, expansion hooks; `factionArchitectureFor` proves all fifteen spec parts ("nothing remains undefined" as a function).
- **NO ELEVENTH FACTION — the CIVILISATION REGISTER realises all ten spec factions through EXISTING things:** six are DIPLOMATIC factions on AF-039's register (United Human Frontier IS the Human Alliance, Crystal Ascendancy IS the Dominion, Void Swarm IS the Legion, Stellar Nomads ARE the fleet, plus the Machine Collective and Independent Colonies); three are ENEMY CIVILISATIONS living in AF-026's real codex (the Celestial Conclave, Paragon Protocol, and the Eclipsed — canon since the enemy-civilisation modules); and the AFTERLIGHT INITIATIVE is the PLAYER'S OWN ORGANISATION, bound to the AF-068 campaign's protagonist. Every realisation resolves against its real register; no diplomatic faction is claimed twice; exactly one player organisation — all asserted.
- **"NO FACTION SHOULD OVERLAP EXCESSIVELY" is a UNIQUENESS LAW:** across all six profiled civilisations, architecture styles, music themes, dialogue voices, signature reward kinds (each a REAL FactionRewardDef kind — the Guild deals in commanders, the Nomads in hulls, the Custodians in lore), and economy-sector sets are ALL asserted pairwise-distinct. Territory regions resolve against AF-038's real region shelf.
- **Politics ride the REAL engine:** the seven political instruments map TOTALLY onto AF-039's conflict states (embargoes are cold wars; exploration accords are shared science) and drive `setRelationship` in tests — symmetric either way, self-alliance inviolable, roster default backing every unset pair. The six relationship-evolution drivers are each realised by a conflict state or a faction event. Eight reputation tracks, eight interaction routes, seven territory effects, and nine reward realisations each NAME their live mechanism (relics are honest: found in-run through AF-029's pools, never handed out — no new reward kind forced into the locked union).
- **"FACTIONS EVOLVE WHETHER OR NOT THE PLAYER INTERACTS" is a TEST:** the event engine fires on elapsed time alone — two runtimes with the same seed produce identical event histories with zero player input, deterministically. The reputation ladder is proven monotone across its entire clamped range (hostile at −400, legendary ally at +1000, level never falling as standing rises). The faction ENCYCLOPEDIA is derivation (`factionEncyclopediaFor`, ten sections from data every profiled faction already carries).
- **LIVE in the composition root:** the overlay's factions line now shows profiled coverage and the civilisation register — `Crystal Dominion rep 0 (neutral) · CD↔MC coldWar · events 0 · profiled 6/10 · civs 10 (6 diplomatic)`.
- **Self-review executed:** 10 new tests — the ten shelves with live bindings, the no-eleventh-faction register battery (real faction ids, real codex entries, exactly one player organisation, no double claims), the instrument/driver total maps, fifteen-part completeness for all six profiled civilisations with real-region territory, the five-way uniqueness law, the derived encyclopedia, the monotone reputation ladder over the full clamped range, politics through the REAL runtime (symmetry, self-alliance, defaults), the player-independent deterministic event engine, and a **1,000-galaxy seeded simulation** through the REAL FactionRuntime (symmetry and self-alliance never break, instruments always apply, events stay on the shelf, counts never regress). Suite: 995 passing. **Live in the browser:** zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-039; the civilisation layer as pure data + two pure functions; ten spec civilisations realised with no eleventh faction; identity uniqueness as law; the living-galaxy claim as a determinism test). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/FACTION_ARCHITECTURE.md`, `src/game/factions/factionFrameworkData.ts`.
