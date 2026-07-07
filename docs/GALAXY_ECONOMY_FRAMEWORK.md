# AFTERLIGHT — Galaxy Economy Framework

**Authority:** Produced output of AF-040. Extends AF-000 → AF-039. Every future merchant, resource, currency, and trading system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the economy exists to support gameplay, never to become the gameplay — every purchase is a decision, grinding is never mandatory, and exploration always pays for itself.

---

## 1. Economy Structure — content over existing systems

Currencies, Resources, Crafting Materials, Research Samples, Blueprint Fragments, Trade Goods, Ancient Technology, Prototype Components, Mission Rewards, and Faction Rewards are not ten new subsystems. Crafting Materials/Research Samples/Ancient Technology/Prototype Components are AF-025's existing `ResourceType`s and categories; Mission/Faction Rewards are AF-037/039's existing reward paths. Currencies (§2), Resources (§3), and Trade Goods (merchant offers, §6) are this module's real additions.

## 2. Currency Types — one new value, five existing views

Credits is the first true universal currency, persisted through AF-026's `recordStat` under `economy:credits`. Research Data, Ancient Fragments, Crystal Essence, Void Matter, and Singularity Cores are named views over values that already exist and already persist (`CURRENCY_SOURCES`): Research Data reads `ResearchTree.snapshot.points`; the other four read AF-025 material counts. Only Credits is publicly spendable today (`SPENDABLE_CURRENCIES`) — the other five have no public decrement path on their locked source systems, and this module records that honestly rather than working around it.

## 3. Resource Tiers — the same nine-tier ladder, a second consumer for its value column

Common through Singularity is AF-007/AF-023's `RARITY_LADDER`. `RARITY_TABLE[rarity].collectionValue` — already used for salvage returns and collection scoring — becomes the base economic value for every merchant offer, giving that column a second real consumer rather than a duplicate pricing table.

## 4. Resource Sources — six existing bus facts, one new listener each

Enemies (regular kills — not yet wired), Elite Enemies, Bosses, Exploration, Research, Mission Completion, and Faction Rewards are the sources with a real Credits producer today: a small `awardCredits()` call added at `EnemyKilled` (elite), `grantBossRewards()`, the AF-038 point-of-interest discovery handler, `ResearchUnlocked`, and `RunEnded` (victory, both generic and Faction-Mission bonus). Mining, Ancient Vaults (subsumed by the Exploration hook), Galaxy Events, and Hidden Discoveries are registered sources without their own hook yet.

## 5. Merchant Types & Merchant Inventory — new concept, zero new acquisition systems

All ten Merchant Types are registered (`MERCHANT_KINDS`). Every `MerchantOfferDef` rewards through `MerchantOfferReward`, a discriminated union over existing acquisition id-spaces — `resource`/`blueprint`/`researchPoints` have a live producer in the sandbox; `ship`/`weapon`/`equipment`/`commander`/`cosmetic`/`relic` are registered for future merchant content. Inventories refresh dynamically via the same deterministic Fisher-Yates shuffle AF-037's `MissionGenerator` already uses for modifier rolling — reused for offer rolling, not reinvented.

## 6. Trade System — Buy live, Salvage already existed, the rest honestly deferred

Buy has a real, tested path today. Salvage already exists in full via AF-025's `CraftingSystem.salvage` — nothing needed. Sell and Exchange share Currency Types' decrement limitation (§2) and are deferred alongside it. Reserve Items is explicitly flagged "(future)" by the spec's own text.

## 7. Pricing Model — three of eight axes mechanically live

`MarketRuntime.price(offer, reputationLevel, activeEvent)` is a pure static function: Rarity (`collectionValue × priceScale`) × Faction Reputation discount (AF-039's `ReputationLevel`, reused directly — a second consumer for that ladder) × the active Special Economic Event's multiplier. Supply, Demand, Mission Progress, Research, and Galaxy State are registered vocabulary without a producer yet.

## 8. Special Economic Events — a sixth naming layer, one deliberate consumption difference

All seven event kinds fire through the shared `EnvironmentalEventTriggered` bus fact, a sixth layer over AF-017/036/037/038/039's precedent, using the identical weighted-pick-on-a-timer algorithm written inline a sixth time. Unlike Galaxy/Faction Events' "momentary flash," an Economic Event becomes the ongoing active market condition until the next one fires, since price needs a *current* state rather than a fired moment — a documented design choice, not a new mechanism.

## 9. Resource Sinks & Player Decisions — already-existing spends, newly named

Research, Crafting, Reforging, Evolution, Galaxy Restoration, Blueprints, and Mastery Challenges are all sinks that already exist (AF-024/025/026/029/038); Cosmetics binds when a cosmetic-purchase path exists. Spend/Save/Craft/Trade/Research/Upgrade/Invest/Explore are simply the actions this and prior modules already offer — Buy is the one new "Spend."

## 10. Balance Principles

Grinding is never mandatory: every Credits source is a byproduct of play the player already does (fighting, researching, exploring, completing missions) — there is no dedicated "farm Credits" loop. Exploration remains profitable: the point-of-interest discovery hook pays Credits on top of Exploration% and collection value, the same discovery already rewards.

## 11. Accessibility & performance

Large economy cards, controller/touch navigation, sorting, search, currency icons, high contrast, and colour-blind support build from AF-003/AF-004/AF-005/AF-019 at the UI module. `MarketRuntime` caches its rotated offer window and reshuffles only on interval; pricing is a pure per-call computation with no allocation beyond the returned number.

## 12. Debug

Live: Credits balance, Research Data balance, Crystal Essence balance, the active merchant's rotated offer count, and Special Economic Events triggered/active — rendered in the shared `DebugOverlay` `economy` field alongside every other module's summary line.

---

## Internal review loop (AF-040, recorded)

- **No duplicated systems** — resource tiers, five of six currencies, offer rewards, rotation algorithm, and event vocabulary all reuse AF-007/023/024/025/026/037/038/039 exactly; `MarketRuntime`'s rotation/event/pricing engine is the only genuinely new mechanical surface, and it stays pure by design, mirroring `GalaxyRuntime`/`FactionRuntime`. ✔
- **Every purchase creates a decision** — Credits are scarce (small, source-gated awards) against real prices (12–120 in the sandbox), so a Buy is a genuine trade-off, not a rubber stamp; verified directly in the browser (an unaffordable offer correctly no-ops). ✔
- **Exploration remains profitable** — the Exploration/Ancient Vaults Credits hook pays out on the same button that already grants Exploration% and a collection entry, stacking rewards rather than competing with them. ✔
- **Grinding is never mandatory** — no Credits source requires repeating an action beyond what the player already does to progress; there is no idle/passive currency faucet requiring dedicated loops. ✔
- **Sandbox proof** — a real merchant's rotating three-offer window prices correctly against live Reputation and a live Economic Event, an unaffordable purchase no-ops, and an affordable purchase deducts the exact price and grants the real reward, all browser-verified with zero errors. ✔
- **Simplification pass** — rejected a second rotation algorithm (reused AF-037's shuffle); rejected a seventh event mechanism (extended the existing bus fact a sixth time); rejected editing a locked class's method surface to make five currencies spendable (recorded the limitation as data instead); rejected rebuilding Salvage (it already exists). ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining nine merchant types, Sell/Exchange (once a decrement-capable extension is owner-authorised), and the full market UI (sorting, search, currency icons) bind at future content and UI modules.**
