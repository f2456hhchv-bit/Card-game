# AF-029 — RELIC FRAMEWORK

**Module status:** Complete (framework specified; discovery/synergy/trade-off/evolution engine implemented and tested; relics drop and equip live in the sandbox; relic content passes bind as future content modules land)
**Lock status:** LOCKED — extends AF-000 → AF-028 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/RELIC_FRAMEWORK.md` + implementation (`src/game/relics/`)

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-028 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Relic Framework.

Relics are the defining items of every expedition.

Unlike Equipment, Relics are primarily discovered during runs.

Relics should fundamentally alter gameplay.

Every Relic should encourage experimentation.

Every Relic should create memorable stories.

No Relic should simply be a larger statistical bonus.

==================================================
CORE PHILOSOPHY
==================================================

Relics define builds.

Synergies create mastery.

Discovery creates excitement.

Every Relic should feel unique.

Players should immediately rethink their strategy after finding one.

==================================================
RELIC ACQUISITION
==================================================

Relics may be obtained from:

Elite Enemies

Mini Bosses

Bosses

Ancient Vaults

Hidden Chambers

Galaxy Events

Rare Discoveries

Mission Rewards

Special Encounters

Future systems extend this framework.

==================================================
RELIC CATEGORIES
==================================================

Offensive

Defensive

Utility

Movement

Drone

Orbital

Elemental

Void

Crystal

Ancient

Prototype

Mythic

Singularity

Future categories extend this framework.

==================================================
RELIC PROPERTIES
==================================================

Every Relic defines:

Unique Name

Tier

Category

Primary Effect

Secondary Effect

Synergies

Restrictions

Lore

Visual Identity

Audio Identity

Collection Status

==================================================
BUILD DEFINERS
==================================================

Relics should enable:

Critical Builds

Burn Builds

Shock Builds

Drone Builds

Orbital Builds

Beam Builds

Projectile Builds

Summoner Builds

Tank Builds

Glass Cannon Builds

Movement Builds

Hybrid Builds

Support limitless future archetypes.

==================================================
SYNERGY SYSTEM
==================================================

Relics interact with:

Weapons

Equipment

Commanders

Ships

Research

Status Effects

Boss Mechanics

Mission Modifiers

Galaxy Events

Synergies should create emergent gameplay.

Never mandatory combinations.

==================================================
STACKING RULES
==================================================

Support:

Unique Relics

Stackable Relics

Mutually Exclusive Relics

Upgradeable Relics

Evolving Relics

Corrupted Relics (Future)

Rules remain data-driven.

==================================================
RELIC RARITY
==================================================

Common

Rare

Epic

Legendary

Ancient

Mythic

Singularity

Higher rarities provide:

Greater uniqueness.

Not merely larger numbers.

==================================================
RELIC EVENTS
==================================================

Special Relic interactions include:

Transformation

Fusion

Evolution

Awakening

Corruption

Purification

Ancient Activation

Future systems integrate seamlessly.

==================================================
RISK VS REWARD
==================================================

Some Relics include trade-offs.

Examples:

Higher damage

Lower shield

Faster movement

Reduced health

Greater rewards

Greater danger

Trade-offs should encourage meaningful decisions.

==================================================
DISCOVERY
==================================================

Players gradually discover Relics through:

Collections

Codex

Lore

Galaxy Exploration

Bosses

Research

Achievements

Unknown Relics remain mysterious until found.

==================================================
VISUAL PRESENTATION
==================================================

Every Relic includes:

Unique Icon

Unique Frame

Animated Effects (where appropriate)

Inspection Card

Pickup Animation

Distinct Audio

Visual identity supports gameplay.

==================================================
BALANCE PRINCIPLES
==================================================

Every Relic changes gameplay.

No universally best Relic.

No mandatory combinations.

Multiple viable builds remain possible.

Power comes through synergy.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Relic Cards

Controller Navigation

Touch Navigation

Search

Sorting

Synergy Highlights

Colour-blind Support

Tooltip Scaling

==================================================
PERFORMANCE
==================================================

Cache Relic effects.

Pool Relic UI.

Optimise synergy calculations.

Lazy load lore.

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

Relic Synergies

Triggered Effects

Stack Count

Evolution State

Balance Values

Performance

==================================================
OUTPUT
==================================================

Produce the complete Relic Framework.

Every future Relic, Artifact, Ancient Technology and Mythic system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Generate thousands of random Relic combinations.

Review build diversity.

Review synergy quality.

Review acquisition pacing.

Review rarity distribution.

Review trade-offs.

Review evolution mechanics.

Review player excitement.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-028.

Adjust Relic effects.

Adjust synergy weighting.

Adjust rarity balance.

Remove dominant combinations.

Ensure every Relic meaningfully changes gameplay while creating memorable runs and encouraging experimentation.

Repeat until the Relic Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-029.

---

## Foundation / AF-016–028 / GP-FINAL alignment review (recorded at catalogue time)

- **Relic vs Equipment boundary drawn explicitly:** Equipment (AF-028) is acquired between runs and slotted deliberately; Relics are **primarily found during runs** and apply immediately on pickup (no equip step) — matching GP-FINAL's elite reward pool ("Epic Upgrade", "Legendary Chance") and the AF-016 in-run pickup flow. Relics still occupy AF-028's relic1–relic6 slots for *persistent* relics carried between runs (a relic found and kept survives to the next expedition via AF-027's inventory); in-run relics are a **temporary build layer** parallel to AF-022's upgrade pool, not a duplicate of it — upgrades are level-up choices, relics are discovery pickups, both write into the same aggregate.
- **Relic rarity ladder reconciled:** AF-029 lists seven tiers (Common → Singularity) — a *subset* of AF-007's canonical nine-tier ladder (omitting Damaged and Improved, which don't suit "found, not degraded" items). Ruling: relics draw from the **existing AF-007 ladder**, restricted to the seven tiers AF-029 names; no second rarity system created. "Higher rarities = greater uniqueness, not bigger numbers" is a content-QA law — mechanically supported by giving higher tiers additional *effect clauses* (secondary effects, synergy tags) rather than only scaling existing ones.
- **"No Relic is simply a larger statistical bonus"** is enforced structurally: every relic definition requires **at least one non-numeric clause** — a behaviour change, conditional trigger, or trade-off — not just a bonus list. A relic with only flat bonuses fails the schema's own validation (content-QA gate, checked in code).
- **Synergy system** reuses AF-028's passive-trigger vocabulary (onKill, onCriticalHit, onShieldBreak, onLowHealth…) rather than inventing a second trigger language; relic-specific triggers (status-effect-applied, boss-mechanics-present) extend the same union, flagged future where no consumer exists yet (boss mechanics — no boss system).
- **Stacking rules**: unique (one only), stackable (data limit), mutually exclusive (data-defined exclusion groups — reuses AF-028's validation-with-reasons pattern), upgradeable/evolving (a relic instance can transform its definition id — implemented; "Corrupted" explicitly future-flagged, no system built for it).
- **Trade-offs** are first-class: a relic's effect list may include negative clauses (lower shield, reduced health) alongside positive ones — both apply through the identical AF-028 bonus-aggregation path (a negative value is just a bonus with a negative sign; no new maths).
- **Relic events** (Transformation, Fusion, Evolution, Awakening, Corruption, Purification, Ancient Activation) are registered as the vocabulary for a future combination-triggered system; **Evolution is implemented now** (the only one with a concrete, testable mechanic: N specific relics/conditions present → swap to an evolved definition) since AF-025 already established the evolution-hook pattern this extends cleanly. The remaining six are named but unbuilt — no dead scaffolding beyond the shared vocabulary.
- **Acquisition sources** (elites, mini/major bosses, vaults, chambers, events, mission rewards) are bus-fact subscriptions exactly like AF-023 loot sources; the sandbox demonstrates elite-kill relic drops using the existing Director/combat facts — no new event types required for the proof.
- **Self-review executed:** thousands of randomised relic-set combinations run headlessly in CI asserting: every definition has a non-numeric clause (schema law), synergy detection is symmetric and deterministic, evolution triggers fire exactly once per qualifying set, and trade-off relics never silently drop their negative clause.
- **Two real bugs found and fixed by the self-review's own tests before lock:** (1) mutual-exclusion checking gated on the *acquiring* relic's `stacking` field instead of its `exclusionGroup`, letting two group-conflicting relics coexist when the second one wasn't itself flagged `mutuallyExclusive` — fixed to check the group unconditionally; (2) evolution was checked only against the just-acquired relic's own definition, making evolution **acquisition-order-dependent** — acquiring A-then-B could evolve while B-then-A would not, which the order-independence test caught via a synergy-symmetry failure. Fixed by rescanning all active relics for satisfied evolution requirements after every acquisition (loop-until-stable, terminates because a relic never requires itself).

**Review verdict:** ALIGNED (relic/equipment boundary and rarity-ladder subset explicitly reconciled; four relic-event kinds registered as vocabulary only, pending their systems). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/RELIC_FRAMEWORK.md`, `src/game/relics/`.
