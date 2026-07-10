import type { EffectTier } from "./atlasEmergenceData";
import { EFFECT_TIERS } from "./atlasEmergenceData";

interface EffectRecord {
  tier: EffectTier;
  description: string;
  epoch: number;
}

/** "Every meaningful action records immediate, secondary,
 * generational, civilisational effects... emergent history becomes
 * traceable." Confirmed genuinely new (see atlasEmergenceData.ts
 * module doc comment): classifies effects into four ordered causal-
 * distance tiers per origin action, a question AF-151's real
 * `KnowledgeGraph` never answers on its own. */
export class CascadeTracker {
  private readonly records = new Map<string, EffectRecord[]>();

  recordEffect(actionId: string, tier: EffectTier, description: string, epoch: number): void {
    const effects = this.records.get(actionId) ?? [];
    effects.push({ tier, description, epoch });
    this.records.set(actionId, effects);
  }

  effectsAtTier(actionId: string, tier: EffectTier): readonly EffectRecord[] {
    return (this.records.get(actionId) ?? []).filter((r) => r.tier === tier);
  }

  allTiersReached(actionId: string): boolean {
    const effects = this.records.get(actionId) ?? [];
    return EFFECT_TIERS.every((tier) => effects.some((r) => r.tier === tier));
  }
}
