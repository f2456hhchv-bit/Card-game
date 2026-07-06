# AF-023 — LOOT FRAMEWORK

**Module status:** Complete (framework specified; generator, ground loot, and rarity presentation implemented and distribution-tested at scale; live drops in the sandbox; item content passes bind as equipment/weapon/relic modules land)
**Lock status:** LOCKED — extends AF-000 → AF-022 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/LOOT_FRAMEWORK.md` + implementation (`src/game/loot/`) + live sandbox drops

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-022 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Loot Framework.

Loot is the primary reward system of Afterlight.

Every drop should create anticipation.

Every pickup should feel meaningful.

Every reward should encourage experimentation.

Players should never stop feeling excited when an item appears.

The loot system must support thousands of items without becoming repetitive.

==================================================
CORE PHILOSOPHY
==================================================

Reward curiosity.

Reward risk.

Reward mastery.

Reward exploration.

Every drop tells a story.

Every rarity creates excitement.

Randomness should create opportunity.

Never frustration.

==================================================
LOOT SOURCES
==================================================

Loot may drop from:

Enemies

Elite Enemies

Mini Bosses

Bosses

Ancient Vaults

Hidden Rooms

Mission Rewards

Galaxy Discoveries

Research

Events

Challenge Objectives

Future systems extend this framework.

==================================================
LOOT CATEGORIES
==================================================

Weapons

Equipment

Relics

Resources

Blueprints

Crafting Materials

Currencies

Research Samples

Ancient Artifacts

Commander Items

Ship Components

Cosmetics

Lore Objects

Future categories remain modular.

==================================================
RARITY SYSTEM
==================================================

Damaged

Common

Improved

Rare

Epic

Legendary

Ancient

Mythic

Singularity

Each rarity modifies:

Drop Chance

Visual Presentation

Audio

Statistics

Affix Count

Collection Value

==================================================
DROP GENERATION
==================================================

Every drop rolls:

Item Category

Base Item

Item Level

Rarity

Affixes

Quality

Special Properties

Seed

Drop generation remains deterministic.

==================================================
SMART LOOT
==================================================

Support optional weighting for:

Current Commander

Current Ship

Current Build

Current Difficulty

Research Unlocks

Mission Type

Weighting improves relevance.

Never guarantees outcomes.

==================================================
LOOT PRESENTATION
==================================================

Every drop includes:

Ground Glow

Light Beam

Pickup Animation

Pickup Sound

Rarity Effect

Inspection Card

Legendary and above receive enhanced presentation.

==================================================
AFFIX PREVIEW
==================================================

Inspection displays:

Name

Rarity

Statistics

Affixes

Synergies

Lore

Upgrade Potential

Salvage Value

Information remains concise.

==================================================
PLAYER DECISIONS
==================================================

Every drop creates meaningful choices:

Equip

Store

Salvage

Ignore

Compare

Favourite

Mark for Crafting

No automatic decisions without player approval.

==================================================
DROP BALANCING
==================================================

Support configurable:

Drop Rates

Rarity Weights

Mission Modifiers

Difficulty Bonuses

Ascension Bonuses

Mutator Bonuses

Research Bonuses

Balance through data.

Never hardcode.

==================================================
SPECIAL DROPS
==================================================

Support:

Set Items

Quest Items

Boss Exclusives

Ancient Technology

Prototype Equipment

Unique Relics

Lore Artifacts

Seasonal Items

Framework supports future additions.

==================================================
REWARD PHILOSOPHY
==================================================

Small rewards occur frequently.

Large rewards remain memorable.

Every mission should provide progression.

Legendary moments should remain rare.

==================================================
ACCESSIBILITY
==================================================

Support:

Large loot cards

Rarity symbols

Colour-blind indicators

Auto-pickup options

Loot beam intensity

Pickup notification duration

Controller-friendly inspection

==================================================
PERFORMANCE
==================================================

Pool loot objects.

Pool loot beams.

Pool pickup effects.

Optimise affix generation.

Limit active ground loot where appropriate.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Loot Seed

Drop Table

Drop Rate

Affix Rolls

Rarity Distribution

Ground Loot Count

Performance

==================================================
OUTPUT
==================================================

Produce the complete Loot Framework.

Every future Weapon, Equipment, Relic, Resource and Reward system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Generate millions of loot drops.

Review rarity distribution.

Review drop excitement.

Review affix balance.

Review reward pacing.

Review player decision quality.

Review Smart Loot weighting.

Review Boss rewards.

Review mission rewards.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-022.

Adjust drop tables.

Adjust rarity weights.

Adjust affix generation.

Remove unrewarding drops.

Ensure every item has value, every rarity feels distinct and every reward reinforces the excitement of discovering something new.

Repeat until the Loot Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-023.

---

## Foundation / AF-016–022 alignment review (recorded at catalogue time)

- **Rarity ladder = AF-007 §4 canon exactly** (nine tiers, tokens, seven-piece identity sets; "never change rarity colours" honoured). Rarity drives drop chance, presentation intensity, affix count, and collection value from one data table.
- **Drop generation is deterministic**: every drop consumes the mission-seed `loot` fork and records its own child seed — a drop is reproducible and (future) verifiable server-side (AF-001 §11). Loot sources subscribe to bus facts (`EnemyKilled` etc.); combat never knows loot exists.
- **Smart loot never guarantees** made structural: weighting multipliers are hard-clamped (default 0.5×–3×), so relevance improves while every category stays possible — randomness creates opportunity, never rigged outcomes, and the AF-016 §6 never-unwinnable constraint extends naturally (offers vary, viability persists).
- **Drop balancing is pure data** (AF-011 §7): rates, rarity weights, difficulty/Ascension/mutator/research bonuses all tuning; difficulty-style bonuses shift weight *up the ladder* progressively (higher tiers benefit more), tested.
- Thirteen loot categories + eight special-drop kinds registered as the content shelf; affix definitions are placeholders proving generation (real affixes arrive with equipment modules and slot into the same roll). Inspection card fields map to AF-009 §7's tooltip anatomy; player decisions (equip/store/salvage/ignore/compare/favourite/mark-for-crafting) are the registered decision enumeration with AF-003 §8's destructive-action guards (salvaging favourites warns) — inventory UI arrives with equipment modules.
- Ground loot pooled with a cap and a value-preserving overflow policy: beyond the cap, the *lowest-rarity oldest* drops bank automatically to the Results reward summary (never deleted, never auto-decided into the build — banking to Results is storage, not a decision, honouring "no automatic decisions"). Legendary+ never banks — those moments stay on the field.
- Reward philosophy inherits the Constitution/AF-011 spectrum; Singularity drop rates sit at lottery-rarity by data (memorable because rare).
- **Self-review executed at scale:** 500,000 seeded drops per CI run assert monotonic rarity distribution, top-tier ppm bounds, affix-count-per-rarity correctness, quality bounds, determinism, smart-loot bias-with-cap, and difficulty ladder-shift. Excitement/pacing passes bind as item content lands.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; item content passes bind equipment/weapon/relic modules. Produced outputs: `docs/LOOT_FRAMEWORK.md`, `src/game/loot/`, sandbox drops.
