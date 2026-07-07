/**
 * Galaxy Economy data shapes (AF-040). Resource Tiers reuse AF-007/AF-023's
 * existing nine-tier Rarity ladder directly ("Uncommon" ≈ `improved`) — not
 * an eighth/ninth tier system. Five of the six Currency Types are a
 * currency-facing *view* over values that already exist and already persist
 * (AF-024 research points; AF-025 crystalFragments/voidEssence/
 * singularityMatter/ancientComponents material counts) — only Credits is
 * genuinely new, the first true universal currency, persisted via AF-026's
 * recordStat under `economy:credits` like everything else. Merchant offers
 * reference existing acquisition id-spaces (AF-024/025/026/028/029/030/031/032)
 * — zero new acquisition systems. Special Economic Events are a sixth
 * naming layer over the shared EnvironmentalEventTriggered bus fact
 * (AF-017/036/037/038/039).
 */
import type { ResourceType } from "../crafting/craftingData";
import type { Rarity } from "../loot/lootTuning";
import type { ReputationLevel } from "../factions/factionData";

export const CURRENCY_IDS = [
  "credits",
  "researchData",
  "ancientFragments",
  "crystalEssence",
  "voidMatter",
  "singularityCores",
] as const;
export type CurrencyId = (typeof CURRENCY_IDS)[number];

/** Every currency but Credits resolves to a value that already exists elsewhere. */
export type CurrencySource =
  | { kind: "credits" }
  | { kind: "researchPoints" }
  | { kind: "resource"; resourceType: ResourceType };

export const CURRENCY_SOURCES: Readonly<Record<CurrencyId, CurrencySource>> = {
  credits: { kind: "credits" },
  researchData: { kind: "researchPoints" },
  ancientFragments: { kind: "resource", resourceType: "ancientComponents" },
  crystalEssence: { kind: "resource", resourceType: "crystalFragments" },
  voidMatter: { kind: "resource", resourceType: "voidEssence" },
  singularityCores: { kind: "resource", resourceType: "singularityMatter" },
};

/** Only Credits has a public decrement path today (a plain recordStat delta);
 * the resource-backed currencies have no public spend method on the locked
 * CraftingSystem/ResearchTree, so they remain read-only display views until
 * a future, owner-authorised extension adds one. */
export const SPENDABLE_CURRENCIES: readonly CurrencyId[] = ["credits"];

export const MERCHANT_KINDS = [
  "galaxyTrader",
  "researchSpecialist",
  "weaponsEngineer",
  "shipwright",
  "relicCollector",
  "ancientArchivist",
  "blackMarketDealer",
  "nomadMerchant",
  "prototypeDealer",
  "factionQuartermaster",
] as const;
export type MerchantKind = (typeof MERCHANT_KINDS)[number];

/** Salvage already exists in full via AF-025's CraftingSystem.salvage; Reserve
 * Items is explicitly flagged "(future)" by the spec itself. Sell/Exchange
 * need the same not-yet-public decrement path as the resource currencies
 * above, so only "buy" has a live producer in this module today. */
export const TRADE_ACTIONS = ["buy", "sell", "salvage", "exchange", "reserve"] as const;
export type TradeAction = (typeof TRADE_ACTIONS)[number];

export const ECONOMIC_EVENT_KINDS = [
  "tradeFestivals",
  "resourceShortages",
  "factionDiscounts",
  "prototypeAuctions",
  "blackMarketRotation",
  "ancientRecovery",
  "emergencySupplyMissions",
] as const;
export type EconomicEventKind = (typeof ECONOMIC_EVENT_KINDS)[number];

/** Price multiplier while an event is the active market condition — content tuning. */
export const ECONOMIC_EVENT_PRICE_MULTIPLIER: Readonly<Record<EconomicEventKind, number>> = {
  tradeFestivals: 0.75,
  resourceShortages: 1.4,
  factionDiscounts: 0.85,
  prototypeAuctions: 1.5,
  blackMarketRotation: 1,
  ancientRecovery: 1,
  emergencySupplyMissions: 0.9,
};

/** Reputation Level → price discount factor (AF-039's ReputationLevel, reused directly). */
export const REPUTATION_LEVEL_PRICE_DISCOUNT: Readonly<Record<ReputationLevel, number>> = {
  hostile: 1.5,
  distrusted: 1.25,
  neutral: 1,
  known: 0.95,
  trusted: 0.9,
  respected: 0.85,
  honoured: 0.75,
  legendaryAlly: 0.6,
};

export interface EconomicEventDef {
  kind: EconomicEventKind;
  weight: number;
}

/** Merchant rewards reference existing acquisition id-spaces. Ship/weapon/
 * equipment/commander/cosmetic/relic are registered for future merchant
 * content — the sandbox catalogue below only offers the three kinds with a
 * live consumer today (resource, blueprint, researchPoints), the same
 * "registered, no consumer yet" deferral AF-039 already established for
 * Faction Rewards. */
export type MerchantOfferReward =
  | { kind: "resource"; id: ResourceType; amount: number }
  | { kind: "blueprint"; id: string }
  | { kind: "researchPoints"; amount: number }
  | { kind: "ship"; id: string }
  | { kind: "weapon"; id: string }
  | { kind: "equipment"; id: string }
  | { kind: "commander"; id: string }
  | { kind: "cosmetic"; id: string }
  | { kind: "relic"; id: string };

export interface MerchantOfferDef {
  id: string;
  reward: MerchantOfferReward;
  rarity: Rarity;
  currency: CurrencyId;
  /** Multiplied against the rarity's AF-023 collectionValue to derive the base price. */
  priceScale: number;
  limitedStock: boolean;
}

export interface MerchantDef {
  id: string;
  kind: MerchantKind;
  name: string;
  /** AF-039 FactionId this merchant answers to, if any (Faction Quartermaster et al). */
  factionId: string | null;
  /** Full catalogue; the runtime rotates a subset into the active offer list. */
  catalogue: readonly MerchantOfferDef[];
  offerSlots: number;
}

export interface GalaxyEconomyDef {
  merchants: readonly MerchantDef[];
  events: readonly EconomicEventDef[];
  rotationIntervalMs: number;
}

/** Credits earned from existing bus facts — Resource Sources content tuning, not a new event system. */
export const CREDIT_AWARDS = {
  missionCompleted: 40,
  factionMissionBonus: 20,
  bossDefeated: 60,
  eliteDefeated: 8,
  researchUnlocked: 5,
  discovery: 15,
} as const;

/** Sandbox economy — one merchant, rotating a three-offer window, proving the
 * pricing/rotation/event engine. */
export const SANDBOX_GALAXY_ECONOMY: GalaxyEconomyDef = {
  merchants: [
    {
      id: "lucent-gate-trader",
      kind: "galaxyTrader",
      name: "Galaxy Trader",
      factionId: null,
      offerSlots: 3,
      catalogue: [
        {
          id: "offer-crystal-fragments",
          reward: { kind: "resource", id: "crystalFragments", amount: 5 },
          rarity: "improved",
          currency: "credits",
          priceScale: 1,
          limitedStock: false,
        },
        {
          id: "offer-rare-alloys",
          reward: { kind: "resource", id: "rareAlloys", amount: 3 },
          rarity: "rare",
          currency: "credits",
          priceScale: 1,
          limitedStock: false,
        },
        {
          id: "offer-research-points",
          reward: { kind: "researchPoints", amount: 6 },
          rarity: "rare",
          currency: "credits",
          priceScale: 1.2,
          limitedStock: false,
        },
        {
          id: "offer-quantum-cores",
          reward: { kind: "resource", id: "quantumCores", amount: 2 },
          rarity: "epic",
          currency: "credits",
          priceScale: 1,
          limitedStock: true,
        },
        {
          id: "offer-prototype-blueprint",
          reward: { kind: "blueprint", id: "bp-prototype-lance" },
          rarity: "legendary",
          currency: "credits",
          priceScale: 1.5,
          limitedStock: true,
        },
      ],
    },
  ],
  events: [
    { kind: "tradeFestivals", weight: 4 },
    { kind: "resourceShortages", weight: 2 },
    { kind: "blackMarketRotation", weight: 3 },
    { kind: "ancientRecovery", weight: 1 },
    { kind: "emergencySupplyMissions", weight: 2 },
  ],
  rotationIntervalMs: 60000,
};
