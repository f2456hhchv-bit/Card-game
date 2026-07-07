/**
 * Galaxy Economy runtime (AF-040): deterministic merchant-inventory rotation
 * (the exact Fisher-Yates-shuffle-and-take-N pattern AF-037's MissionGenerator
 * already established for modifier rolling, reused here for offer rolling)
 * and weighted Special Economic Event scheduling (the same weighted-pick-
 * on-a-timer algorithm AF-036/037/038/039 already wrote inline four times).
 * Stays pure like GalaxyRuntime/FactionRuntime: it holds no currency balance
 * of its own. Pricing is a pure static function; the composition root reads
 * the actual Credits balance through AF-026's MetaProgression and spends it
 * there, exactly mirroring how AF-038/039 apply their own clamped deltas
 * outside the runtime.
 */
import type { Rng } from "../../core/rng/Rng";
import { RARITY_TABLE } from "../loot/lootTuning";
import type { ReputationLevel } from "../factions/factionData";
import {
  ECONOMIC_EVENT_PRICE_MULTIPLIER,
  REPUTATION_LEVEL_PRICE_DISCOUNT,
  type EconomicEventKind,
  type GalaxyEconomyDef,
  type MerchantDef,
  type MerchantOfferDef,
} from "./economyData";

export interface EconomySnapshot {
  eventsTriggered: number;
  lastEventKind: EconomicEventKind | null;
  activeEventKind: EconomicEventKind | null;
}

export class MarketRuntime {
  private readonly activeOffers = new Map<string, MerchantOfferDef[]>();
  private rotationTimerMs = 0;
  private eventTimerMs = 0;
  private eventsTriggered = 0;
  private lastEventKind: EconomicEventKind | null = null;
  private activeEventKind: EconomicEventKind | null = null;

  constructor(
    private readonly def: GalaxyEconomyDef,
    private readonly rng: Rng,
    private readonly eventIntervalMs = 40000,
  ) {
    for (const merchant of def.merchants) this.rerollMerchant(merchant);
  }

  private rerollMerchant(merchant: MerchantDef): void {
    const shuffled = [...merchant.catalogue];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = this.rng.int(0, i);
      const tmp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = tmp;
    }
    this.activeOffers.set(merchant.id, shuffled.slice(0, merchant.offerSlots));
  }

  findMerchant(merchantId: string): MerchantDef | null {
    return this.def.merchants.find((m) => m.id === merchantId) ?? null;
  }

  /** The currently rotated-in subset of a merchant's full catalogue. */
  offersFor(merchantId: string): readonly MerchantOfferDef[] {
    return this.activeOffers.get(merchantId) ?? [];
  }

  update(fixedDtMs: number): void {
    this.rotationTimerMs += fixedDtMs;
    this.eventTimerMs += fixedDtMs;
  }

  /** Inventories refresh dynamically — a deterministic reshuffle of the same catalogue, not new content. */
  tryRotateInventories(): boolean {
    if (this.rotationTimerMs < this.def.rotationIntervalMs) return false;
    this.rotationTimerMs = 0;
    for (const merchant of this.def.merchants) this.rerollMerchant(merchant);
    return true;
  }

  /** Returns a newly-fired event kind exactly once per interval, or null. The
   * fired kind also becomes the active market condition until the next fire. */
  tryTriggerEvent(): EconomicEventKind | null {
    if (this.def.events.length === 0 || this.eventTimerMs < this.eventIntervalMs) return null;
    this.eventTimerMs = 0;
    const totalWeight = this.def.events.reduce((sum, event) => sum + event.weight, 0);
    let roll = this.rng.float(0, totalWeight);
    for (const event of this.def.events) {
      roll -= event.weight;
      if (roll <= 0) {
        this.lastEventKind = event.kind;
        this.activeEventKind = event.kind;
        this.eventsTriggered += 1;
        return event.kind;
      }
    }
    return null;
  }

  get currentEvent(): EconomicEventKind | null {
    return this.activeEventKind;
  }

  /** Pure pricing: AF-023's Rarity collectionValue × Faction Reputation discount
   * × the active Special Economic Event multiplier. Never touches a balance. */
  static price(offer: MerchantOfferDef, reputationLevel: ReputationLevel, activeEvent: EconomicEventKind | null): number {
    const base = RARITY_TABLE[offer.rarity].collectionValue * offer.priceScale;
    const reputationFactor = REPUTATION_LEVEL_PRICE_DISCOUNT[reputationLevel];
    const eventFactor = activeEvent ? ECONOMIC_EVENT_PRICE_MULTIPLIER[activeEvent] : 1;
    return Math.max(1, Math.round(base * reputationFactor * eventFactor));
  }

  get snapshot(): EconomySnapshot {
    return {
      eventsTriggered: this.eventsTriggered,
      lastEventKind: this.lastEventKind,
      activeEventKind: this.activeEventKind,
    };
  }
}
