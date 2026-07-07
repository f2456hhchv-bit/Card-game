# AF-050 — ANCIENT CUSTODIAN ENEMY FRAMEWORK

**Module status:** Complete (framework specified; security escalation engine implemented and tested; a live Custodian site governs an AF-017 EnvironmentalEvent outcome end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-049 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ANCIENT_CUSTODIAN_FRAMEWORK.md` + implementation (`src/game/enemies/ancientData.ts`, `AncientSecurity.ts`)

---

*(Module catalogued verbatim below.)*

50

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-049 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Ancient Custodian Enemy Framework.

The Ancient Custodians are the last automated guardians of the civilisation that originally built the Afterlight Network.

Unlike the Machine Collective, they are not expanding.

They are preserving.

They defend ancient knowledge, relics and technologies that humanity was never intended to possess.

Players should feel they are trespassing inside sacred locations.

==================================================
CORE PHILOSOPHY
==================================================

Ancient.

Precise.

Patient.

Defensive.

Intelligent.

Every encounter should feel like surviving ancient security systems that have operated flawlessly for thousands of years.

==================================================
FACTION IDENTITY
==================================================

Theme:

Ancient precursor civilisation.

Lost technology.

Impossible engineering.

Perfect automation.

Preservation above destruction.

Sacred guardians.

Their purpose is protection.

Not conquest.

==================================================
VISUAL LANGUAGE
==================================================

White ceramic armour.

Gold structural frames.

Blue-white energy.

Floating architecture.

Perfect symmetry.

Ancient glyphs.

Gravitational levitation.

Clean geometric silhouettes.

Visuals communicate forgotten perfection.

==================================================
CORE UNITS
==================================================

Support:

Sentinel

Observer

Guardian Sphere

Defence Drone

Custodian Walker

Archive Keeper

Beacon Warden

Shield Architect

Energy Conduit

Judicator

Oracle Unit

Vault Defender

Temple Guardian

Ancient Executor

Future units extend naturally.

==================================================
COMBAT STYLE
==================================================

Ancient Custodians favour:

Area Protection

Predictive Defence

Shield Networks

Precision Weapons

Zone Control

Counterattacks

Environmental Activation

Measured Escalation

They rarely pursue.

They defend.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Light Bridges

Energy Walls

Ancient Glyphs

Rotating Defences

Adaptive Barriers

Security Fields

Defence Arrays

Guardian Drones

Energy Mirrors

Vault Locks

Every mechanic reinforces ancient technology.

==================================================
SECURITY SYSTEM
==================================================

Ancient facilities monitor:

Player Position

Threat Level

Vault Integrity

System Damage

Forbidden Technology

Security escalates logically.

Minor trespass.

↓

Warning.

↓

Containment.

↓

Guardian Deployment.

↓

Maximum Response.

==================================================
ANCIENT NETWORK
==================================================

Custodian structures share:

Energy

Shield Capacity

Target Information

Threat Assessment

Repair Functions

Security Protocols

Destroying network nodes weakens the defence grid.

==================================================
ELITE VARIANTS
==================================================

Elite Custodians gain:

Ancient Upgrades

Prototype Weapons

Perfect Accuracy

Enhanced Shields

Unique Glyph Patterns

Rare Rewards

Historical Records

Every Elite feels irreplaceable.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Vault Overseer

Archive Intelligence

Temple Protector

Guardian Prime

Ancient Constructor

Quantum Sentinel

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Custodians interact with:

Ancient Vaults

Temple Worlds

Research Facilities

Afterlight Relays

Energy Conduits

Planetary Archives

Ancient Bosses

Their environment is part of their defence system.

==================================================
LOOT
==================================================

Possible rewards:

Ancient Blueprints

Prototype Components

Guardian Technology

Quantum Crystals

Research Archives

Legendary Equipment

Ancient Relics

Civilisation Records

==================================================
CODEX
==================================================

Record:

Guardian Classes

Security Protocols

Architecture

Ancient Language

Historical Timeline

Technology

Known Vaults

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Distinct silhouettes

Security indicators

Energy network visuals

Readable glyphs

High Contrast

Colour-blind support

Reduced visual complexity mode

==================================================
PERFORMANCE
==================================================

Pool guardian effects.

Optimise energy networks.

Reuse environmental systems.

Cache security logic.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Security Level

Guardian Network

Shield Grid

Threat Status

Vault Integrity

Active Protocol

Performance

==================================================
OUTPUT
==================================================

Produce the complete Ancient Custodian Enemy Framework.

Every future precursor civilisation, ancient defence system, sacred vault and forgotten technology extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Ancient Custodian encounters.

Review security escalation.

Review environmental interaction.

Review defence networks.

Review Elite encounters.

Review rewards.

Review Codex progression.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-049.

Adjust security logic.

Adjust environmental mechanics.

Adjust encounter pacing.

Remove repetitive defence patterns.

Ensure the Ancient Custodians feel like timeless guardians protecting the greatest secrets of the galaxy through intelligence, precision and overwhelming technological superiority rather than aggression.

Repeat until the Ancient Custodian Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-050.

---

## Foundation / AF-000–049 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Custodian unit is a plain AF-033 `EnemyDef` — zero schema changes, zero sixth enemy engine.** Six of the fourteen registered Core Unit kinds carry full sandbox defs (Sentinel, Defence Drone, Guardian Sphere, Shield Architect, Custodian Walker, Elite Ancient Executor), every one using the `ancientGuardian` family — previously carrying only AF-048's single Crystal Titan def — with every fingerprint checked distinct from it and from the entire five-faction roster. Ranged attacks ARE real AF-032 `WeaponDef`s manufactured by "Ancient Custodians", using the dormant `ancient` `WeaponCategory` (registered since AF-032, unused until now) for its first real content.
- **This is the sixth AF-039 `FactionId` to be profiled, paying off exactly the same content debt AF-046 paid off for the Mercenary Guild.** `ancientCustodians` was a registered-but-unprofiled `FactionId` since AF-039; this module adds its full `FactionDef` (territory `ancientCore`, unique resource `ancientComponents`, unique units referencing the two new weapons) to `SANDBOX_FACTION_ROSTER.factions`, unlike AF-047/048 (inherited a full profile) and unlike AF-049 (deliberately added none, being explicitly not a civilisation).
- **A genuine, caught-before-lock id collision, resolved without touching the pre-existing entry.** `codexData.ts` already carried a `codex-ancient-custodians` entry (category `ancientCivilisations`, unlocked by discovering an Ancient Vault point of interest, tied to `LORE_LUCENT_GATE_VAULT`) from earlier galaxy/lore content — a "who they are" entry, not a combat-doctrine one. Rather than overwrite or rename that locked content, this module's new entry is `codex-ancient-security-doctrine` (category `enemies`, gated on a new `LORE_ANCIENT_CUSTODIANS_CODEX`, `relatedEntryIds: ["codex-ancient-custodians"]` cross-referencing the older entry) — a "how they fight" companion, exactly the AF-047/048/049 doctrine-entry pattern, layered correctly on top of a faction that already had partial lore presence.
- **Escalation is the deliberate fifth doctrine — and the first that runs in the opposite direction.** Outlaw squads SCATTER (weaker, binary), Machine networks DEGRADE (weaker, discrete steps), the Crystal Ecosystem WEAKENS (weaker, continuous from a count), the Void Swarm CORRUPTS (stronger with time, contained by kills) — the Ancient Custodians ESCALATE: `AncientSecurityRuntime.alertLevel` climbs while the player trespasses within `siteRadius` of any living Custodian and continuously de-escalates the instant they leave (`update(dtMs, playerPresent)`), regardless of how many Custodians remain alive — the opposite of every doctrine that gets weaker as units die. A permanent ceiling (`ceiling`, `maxAlert * nodesRemaining/totalNodes`) composes a Crystal-style proportional cap on top of this Void-style continuous time axis, and destroying the network node (a Shield Architect) clamps current alert down to the new ceiling immediately — verified live in the browser on two independent runs: the site's displayed ceiling collapsed from 100% to 0% the instant its Shield Architect died.
- **The fairness discipline continues, applied to a fifth doctrine's number.** `ANCIENT_SECURITY_TUNING.maxAlert = 1` bounds `alertLevel` regardless of trespass duration, verified at 100,000 accumulated update ticks in `tests/ancient.test.ts`. Of the six registered Ancient Network traits, three are mechanically live — Repair Functions, Target Information, and Shield Capacity — but unlike every prior faction's continuously-scaled bonuses, these are stepped discretely by `stageIndex`, matching the Security System's own discrete five-stage design rather than a smooth ratio.
- **Guardian Deployment (stage 3+) is the module's one genuine mechanical extension beyond the number itself**, giving a named stage real teeth: `tryDeployGuardian()` reuses AF-047's exact Drone Factory cadence-gate-and-lifetime-cap pattern (a fourth reuse of that shape, after Crystal's Growth Seeder and Void's zone-seeder), manufacturing one real Defence Drone reinforcement through the shared spawn path once escalation earns it.
- **The Director is untouched, continuing AF-049's zero-wave-type precedent.** Sites enter through a new `bus.on("EnvironmentalEventTriggered", ...)` branch reacting to AF-017's own `AncientSignal` `EnvironmentalEventType` — one of the seven `ENVIRONMENTAL_EVENTS` the Director already emits, and a name that could not fit the faction more precisely. `EnemyDirector.ts`/`directorTuning.ts` remain byte-for-byte unmodified, and `AmbientPatrol`/`HunterPack`/`SwarmWave` all remain fully unclaimed for future factions.
- **AF-021's dormant `armourBreak` `StatusKind` gets its first producer**, via the Defence Drone's Precision Lance and the Ancient Executor's Judgment Beam — thematically exact for "Precision Weapons" that strip an intruder's defences rather than simply dealing raw damage.
- **Self-review executed:** 18 new tests — vocabulary registration (including the five named security stages), AF-033-vocabulary conformance, the six-faction no-overlap law, readable-telegraph floors, the `armourBreak` first-producer assertion, the Elite pipeline for the Executor, the full escalation lifecycle (climb through every stage, continuous de-escalation on disengagement, the fairness cap at 100,000 ticks, the permanent ceiling shrink and immediate clamp on node death, member-vs-node kill distinction, discrete stage-stepped bonuses, Guardian Deployment's cadence-and-cap), the `FactionDef` profile's presence, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which alert never exceeds its ceiling and every site reaches elimination. Live in the browser: a site spawned via the dev key with a real Shield Architect, and on two independent runs the site's alert ceiling visibly collapsed from 100% to 0% in the same tick the Architect died — zero page errors throughout.

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes — continuing AF-049's zero-wave-type precedent, zero new loot/elite systems, one genuine faction-profile debt paid off exactly as AF-046 modelled, and one pre-existing Codex id collision caught and resolved without touching locked content). `AncientSecurityRuntime` is the only genuinely new mechanical surface, and escalation — climbing while a threat is present, capped by surviving infrastructure — is meaningfully distinct from every prior doctrine's weakening-on-death shape. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ANCIENT_CUSTODIAN_FRAMEWORK.md`, `src/game/enemies/ancientData.ts` + `AncientSecurity.ts`.
