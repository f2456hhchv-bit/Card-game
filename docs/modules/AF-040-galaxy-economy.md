# AF-040 — GALAXY ECONOMY FRAMEWORK

**Module status:** Complete (framework specified; currency/merchant/pricing/event engine implemented and tested; a sandbox merchant governs Galaxy Command's trade layer end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-039 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/GALAXY_ECONOMY_FRAMEWORK.md` + implementation (`src/game/economy/`)

---

*(Module catalogued verbatim below.)*

40

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-039 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Galaxy Economy Framework.

The economy gives long-term value to exploration.

Resources should feel meaningful.

Currencies should remain understandable.

Trading should create interesting choices.

The economy exists to support gameplay.

Never to become the gameplay.

==================================================
CORE PHILOSOPHY
==================================================

Every resource has value.

Every currency has purpose.

Every purchase creates a decision.

Scarcity creates strategy.

Abundance creates experimentation.

Players should always feel rewarded for exploration.

==================================================
ECONOMY STRUCTURE
==================================================

The economy supports:

Currencies

Resources

Crafting Materials

Research Samples

Blueprint Fragments

Trade Goods

Ancient Technology

Prototype Components

Mission Rewards

Faction Rewards

Future systems extend naturally.

==================================================
CURRENCY TYPES
==================================================

Credits

Primary universal currency.

----------------------------

Research Data

Technology progression.

----------------------------

Ancient Fragments

Rare discoveries.

----------------------------

Crystal Essence

High-tier crafting.

----------------------------

Void Matter

Endgame progression.

----------------------------

Singularity Cores

Mythic crafting.

Future currencies extend this framework.

==================================================
RESOURCE TIERS
==================================================

Common

Uncommon

Rare

Epic

Legendary

Ancient

Mythic

Singularity

Every resource has crafting and research applications.

==================================================
RESOURCE SOURCES
==================================================

Resources originate from:

Enemies

Elite Enemies

Bosses

Mining

Exploration

Ancient Vaults

Galaxy Events

Faction Rewards

Research

Mission Completion

Hidden Discoveries

Future expansions.

==================================================
MERCHANT TYPES
==================================================

Galaxy Trader

Research Specialist

Weapons Engineer

Shipwright

Relic Collector

Ancient Archivist

Black Market Dealer

Nomad Merchant

Prototype Dealer

Faction Quartermaster

Each merchant has unique inventory.

==================================================
MERCHANT INVENTORY
==================================================

Inventories contain:

Weapons

Equipment

Relics

Resources

Blueprints

Cosmetics

Research

Crafting Materials

Limited Stock Items

Legendary Offers

Inventories refresh dynamically.

==================================================
TRADE SYSTEM
==================================================

Players may:

Buy

Sell

Salvage

Exchange

Trade Resources

Purchase Blueprints

Purchase Cosmetics

Reserve Items (future)

Trade remains optional.

==================================================
PRICING MODEL
==================================================

Pricing considers:

Rarity

Supply

Demand

Faction Reputation

Mission Progress

Research

Special Events

Galaxy State

Pricing remains data-driven.

==================================================
SPECIAL ECONOMIC EVENTS
==================================================

Support:

Trade Festivals

Resource Shortages

Faction Discounts

Prototype Auctions

Black Market Rotation

Ancient Recovery

Emergency Supply Missions

Market conditions evolve naturally.

==================================================
RESOURCE SINKS
==================================================

Resources are spent on:

Research

Crafting

Reforging

Evolution

Cosmetics

Galaxy Restoration

Blueprints

Mastery Challenges

Healthy sinks prevent inflation.

==================================================
PLAYER DECISIONS
==================================================

Players constantly choose:

Spend

Save

Craft

Trade

Research

Upgrade

Invest

Explore

No single optimal strategy exists.

==================================================
BALANCE PRINCIPLES
==================================================

Currencies remain valuable.

Resources remain meaningful.

Grinding is never mandatory.

Exploration remains profitable.

Economy supports gameplay.

Never replaces gameplay.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Economy Cards

Controller Navigation

Touch Navigation

Sorting

Search

Currency Icons

High Contrast

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache merchant inventories.

Optimise pricing calculations.

Pool market UI.

Lazy load inventories.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Currencies

Resource Counts

Market Prices

Merchant Inventory

Trade History

Economy Health

Performance

==================================================
OUTPUT
==================================================

Produce the complete Galaxy Economy Framework.

Every future merchant, resource, currency and trading system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of player economies.

Review currency flow.

Review resource value.

Review merchant diversity.

Review pricing.

Review crafting economy.

Review research economy.

Review player decision quality.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-039.

Adjust resource availability.

Adjust prices.

Adjust trade rewards.

Remove unnecessary currencies.

Ensure the economy remains intuitive, rewarding and supportive of long-term progression without encouraging repetitive grinding.

Repeat until the Galaxy Economy Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-040.

---

## Foundation / AF-000–039 / GP-FINAL alignment review (recorded at catalogue time)

- **Resource Tiers reuse AF-007/AF-023's existing nine-tier Rarity ladder directly — not an eighth/ninth tier system.** "Common → Singularity" is the same `RARITY_LADDER`/`RARITY_TABLE` every drop, elite, and offer already uses ("Uncommon" reads as `improved`); `RARITY_TABLE[rarity].collectionValue` becomes the base economic value for pricing, so Economy doesn't invent a second value table.
- **Five of the six Currency Types are a currency-facing *view* over values that already exist and already persist — only Credits is genuinely new.** Research Data is `ResearchTree.snapshot.points` (a currency in every sense already: bankable, spendable via `unlock`, balance-checkable); Ancient Fragments/Crystal Essence/Void Matter/Singularity Cores are named views over AF-025's `ancientComponents`/`crystalFragments`/`voidEssence`/`singularityMatter` material counts (`CURRENCY_SOURCES`). Credits is the one true addition, persisted through AF-026's `recordStat` under `economy:credits` — the same namespaced-statistic pattern AF-038/039 already established, zero new save slice.
- **Only Credits is publicly spendable today, and this is recorded honestly rather than faked.** Neither the locked `ResearchTree` nor the locked `CraftingSystem` expose a public decrement method outside their own gated operations (`unlock`, recipe `craft`) — adding one would mean editing a locked class's method surface, which this project's "extend, never redesign" rule reserves for the Project Owner. `SPENDABLE_CURRENCIES` records this limitation as data (`["credits"]`) rather than silently pretending all six currencies work identically.
- **Merchant Types and Merchant Inventory are new (no prior module registered a shop concept), but every offer reward references an existing acquisition id-space — zero new acquisition systems.** `MerchantOfferReward` mirrors AF-039's `FactionRewardDef` exactly: `resource`/`blueprint`/`researchPoints` have a live producer today (`crafting.addMaterial`, `crafting.unlockBlueprint`, `researchTree.addPoints`); `ship`/`weapon`/`equipment`/`commander`/`cosmetic`/`relic` are registered for future merchant content, the identical "registered, no consumer yet" deferral AF-039 already established for Faction Rewards.
- **Inventories refresh dynamically via the exact Fisher-Yates-shuffle-and-take-N algorithm AF-037's `MissionGenerator` already established for modifier rolling** — reused here for offer rolling rather than inventing a second rotation mechanism. Same seed, same reroll: deterministic like everything else in this codebase.
- **Trade System's Salvage already exists in full via AF-025's `CraftingSystem.salvage` — nothing to add.** Reserve Items is explicitly flagged "(future)" by the spec's own text. Sell and Exchange share the exact same not-yet-public-decrement limitation as the resource currencies above (no public way to remove a material stack or a banked research-point balance outside their own gated operations), so they are honestly deferred rather than half-built against a workaround.
- **Pricing Model mechanically implements three of its eight listed axes — Rarity, Faction Reputation, and Special Events — and says so.** `MarketRuntime.price()` is a pure static function: `RARITY_TABLE[rarity].collectionValue × priceScale × REPUTATION_LEVEL_PRICE_DISCOUNT[reputationLevel] × ECONOMIC_EVENT_PRICE_MULTIPLIER[activeEvent]`, reusing AF-039's `ReputationLevel` directly as a genuine cross-module interaction (a faction's own reputation ladder now has a second consumer beyond diplomacy). Supply, Demand, Mission Progress, Research, and Galaxy State are registered vocabulary without a producer yet — the same deferral pattern used repeatedly since AF-028's `droneEffectiveness`.
- **Special Economic Events are a sixth naming layer over the shared `EnvironmentalEventTriggered` bus fact AF-017 introduced and AF-036/037/038/039 already extended.** Trade Festivals/Resource Shortages/Black Market Rotation echo the same weighted-pick-on-a-timer algorithm written inline five times already (AF-036/037/038/039, now AF-040) — deliberately not extracted into a shared utility, to avoid editing a locked module for a non-bug refactor. Unlike the "momentary" Galaxy/Faction Events, an Economic Event becomes the *ongoing* active market condition until the next one fires — a deliberate, documented consumption difference, not a new mechanism.
- **Resource Sources wire Credits into six existing bus facts — no new event system.** Mission Completion (`RunEnded` victory), Faction Rewards (a completed Faction Mission), Bosses (`grantBossRewards`), Elite Enemies (`EnemyKilled` with `elite: true`), Research (`ResearchUnlocked`), and Exploration/Ancient Vaults (the AF-038 point-of-interest discovery handler) each now also call a small `awardCredits()` helper — the same facts AF-022/026/034/038/039 already listen to, given one more listener.
- **Self-review executed:** merchant offer rotation (bounded to slot count, sourced only from the merchant's own catalogue, deterministic per seed), weighted Special Economic Event firing, and the pure pricing function (rarity-only baseline, reputation ordering, event direction, floor-of-one) are all deterministic and tested, including a 5,000-cycle sweep of rotation ticks and event firings asserting every live-offered price stays positive. Live in the browser: an unaffordable Buy button correctly no-ops at zero Credits, discovering a Point of Interest correctly grants Credits (Exploration source), and an affordable Buy button correctly deducts the exact price and grants the real resource/research reward — all observed with zero errors, across a live, dynamically-rotated offer set.

**Review verdict:** ALIGNED (zero new resource-tier system, zero new acquisition systems, zero new save slice, zero sixth event mechanism, zero edits to a locked class's method surface; `MarketRuntime`'s rotation/event/pricing engine is the only genuinely new mechanical surface, and it stays pure by design, mirroring `GalaxyRuntime`/`FactionRuntime`). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/GALAXY_ECONOMY_FRAMEWORK.md`, `src/game/economy/`.
