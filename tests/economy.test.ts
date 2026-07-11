import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { MarketRuntime } from "../src/game/economy/MarketRuntime";
import {
  CREDIT_AWARDS,
  CURRENCY_IDS,
  CURRENCY_SOURCES,
  ECONOMIC_EVENT_KINDS,
  SANDBOX_GALAXY_ECONOMY,
  SPENDABLE_CURRENCIES,
} from "../src/game/economy/economyData";
import { RARITY_TABLE } from "../src/game/loot/lootTuning";
import { SANDBOX_RECIPES } from "../src/game/crafting/craftingData";

describe("MarketRuntime — merchant inventory rotation (AF-040 §Merchant Inventory)", () => {
  it("rolls an initial offer window no larger than the merchant's slot count", () => {
    const runtime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(1));
    const offers = runtime.offersFor("lucent-gate-trader");
    expect(offers.length).toBeLessThanOrEqual(3);
    expect(offers.length).toBeGreaterThan(0);
  });

  it("every rolled offer comes from the merchant's own catalogue", () => {
    const runtime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(7));
    const merchant = runtime.findMerchant("lucent-gate-trader")!;
    const catalogueIds = merchant.catalogue.map((o) => o.id);
    for (const offer of runtime.offersFor("lucent-gate-trader")) {
      expect(catalogueIds).toContain(offer.id);
    }
  });

  it("returns an empty list for an unknown merchant", () => {
    const runtime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(1));
    expect(runtime.offersFor("does-not-exist")).toEqual([]);
  });

  it("does not rotate before the interval elapses", () => {
    const runtime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(1));
    const before = runtime.offersFor("lucent-gate-trader").map((o) => o.id);
    runtime.update(SANDBOX_GALAXY_ECONOMY.rotationIntervalMs - 1);
    expect(runtime.tryRotateInventories()).toBe(false);
    expect(runtime.offersFor("lucent-gate-trader").map((o) => o.id)).toEqual(before);
  });

  it("rotates deterministically once the interval elapses — same seed, same reroll", () => {
    const a = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(42));
    const b = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(42));
    a.update(SANDBOX_GALAXY_ECONOMY.rotationIntervalMs);
    b.update(SANDBOX_GALAXY_ECONOMY.rotationIntervalMs);
    expect(a.tryRotateInventories()).toBe(true);
    expect(b.tryRotateInventories()).toBe(true);
    expect(a.offersFor("lucent-gate-trader").map((o) => o.id)).toEqual(
      b.offersFor("lucent-gate-trader").map((o) => o.id),
    );
  });
});

describe("GP-003 §Blueprints — a real second acquisition route alongside boss-defeat drops", () => {
  it("every blueprint offer in the merchant's catalogue references a real, existing recipe", () => {
    const merchant = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(1)).findMerchant("lucent-gate-trader")!;
    const recipeBlueprintIds = new Set(SANDBOX_RECIPES.map((r) => r.blueprintId));
    const blueprintOffers = merchant.catalogue.filter((o) => o.reward.kind === "blueprint");
    expect(blueprintOffers.length).toBeGreaterThanOrEqual(3); // prototype-lance + the two new GP-003 blueprints
    for (const offer of blueprintOffers) {
      if (offer.reward.kind === "blueprint") expect(recipeBlueprintIds.has(offer.reward.id)).toBe(true);
    }
  });
});

describe("MarketRuntime — weighted Special Economic Events (AF-040 §Special Economic Events)", () => {
  it("fires no event before the interval elapses", () => {
    const runtime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(1), 1000);
    runtime.update(999);
    expect(runtime.tryTriggerEvent()).toBeNull();
  });

  it("fires exactly one event per interval, always from the roster's own pool, and becomes the active condition", () => {
    const runtime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(5), 1000);
    const configuredKinds = SANDBOX_GALAXY_ECONOMY.events.map((e) => e.kind);
    let fired = 0;
    for (let i = 0; i < 50; i += 1) {
      runtime.update(1000);
      const event = runtime.tryTriggerEvent();
      if (event) {
        fired += 1;
        expect(configuredKinds).toContain(event);
        expect(ECONOMIC_EVENT_KINDS).toContain(event);
        expect(runtime.currentEvent).toBe(event);
      }
    }
    expect(fired).toBe(50);
  });
});

describe("MarketRuntime.price — pure, no balance of its own (AF-040 §Pricing Model)", () => {
  const offer = SANDBOX_GALAXY_ECONOMY.merchants[0]!.catalogue[0]!;

  it("is exactly the rarity's collectionValue × priceScale at neutral reputation with no active event", () => {
    const price = MarketRuntime.price(offer, "neutral", null);
    expect(price).toBe(Math.round(RARITY_TABLE[offer.rarity].collectionValue * offer.priceScale));
  });

  it("Legendary Ally reputation is strictly cheaper than Hostile reputation for the same offer", () => {
    const hostilePrice = MarketRuntime.price(offer, "hostile", null);
    const alliedPrice = MarketRuntime.price(offer, "legendaryAlly", null);
    expect(alliedPrice).toBeLessThan(hostilePrice);
  });

  it("a Resource Shortage event raises price; a Trade Festival lowers it, relative to no event", () => {
    const basePrice = MarketRuntime.price(offer, "neutral", null);
    const shortagePrice = MarketRuntime.price(offer, "neutral", "resourceShortages");
    const festivalPrice = MarketRuntime.price(offer, "neutral", "tradeFestivals");
    expect(shortagePrice).toBeGreaterThan(basePrice);
    expect(festivalPrice).toBeLessThan(basePrice);
  });

  it("never prices an offer at zero or below", () => {
    for (const merchant of SANDBOX_GALAXY_ECONOMY.merchants) {
      for (const catalogueOffer of merchant.catalogue) {
        expect(MarketRuntime.price(catalogueOffer, "legendaryAlly", "tradeFestivals")).toBeGreaterThan(0);
      }
    }
  });
});

describe("Currency Types — five of six are a view over an already-existing value (AF-040 §Currency Types)", () => {
  it("registers exactly the six spec currencies", () => {
    expect(CURRENCY_IDS).toEqual([
      "credits",
      "researchData",
      "ancientFragments",
      "crystalEssence",
      "voidMatter",
      "singularityCores",
    ]);
  });

  it("only Credits is genuinely new — the rest resolve to researchPoints or a resource type", () => {
    expect(CURRENCY_SOURCES.credits).toEqual({ kind: "credits" });
    expect(CURRENCY_SOURCES.researchData).toEqual({ kind: "researchPoints" });
    for (const id of ["ancientFragments", "crystalEssence", "voidMatter", "singularityCores"] as const) {
      expect(CURRENCY_SOURCES[id].kind).toBe("resource");
    }
  });

  it("only Credits is publicly spendable today", () => {
    expect(SPENDABLE_CURRENCIES).toEqual(["credits"]);
  });
});

describe("Economy — self-review: thousands of player-economy cycles stay consistent", () => {
  it("survives a long sweep of rotation ticks and event firings without breaching invariants", () => {
    const runtime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(999), 500);
    let eventsFired = 0;
    let rotations = 0;
    for (let cycle = 0; cycle < 5000; cycle += 1) {
      runtime.update(16);
      if (runtime.tryTriggerEvent()) eventsFired += 1;
      if (runtime.tryRotateInventories()) rotations += 1;
      const offers = runtime.offersFor("lucent-gate-trader");
      expect(offers.length).toBeLessThanOrEqual(3);
      for (const offer of offers) {
        expect(MarketRuntime.price(offer, "neutral", runtime.currentEvent)).toBeGreaterThan(0);
      }
    }
    expect(eventsFired).toBeGreaterThan(0);
    expect(rotations).toBeGreaterThan(0);
    expect(runtime.snapshot.eventsTriggered).toBe(eventsFired);
  });

  it("every CREDIT_AWARDS value is a positive, non-trivial integer (Resource Sources content tuning)", () => {
    for (const amount of Object.values(CREDIT_AWARDS)) {
      expect(amount).toBeGreaterThan(0);
      expect(Number.isInteger(amount)).toBe(true);
    }
  });
});
