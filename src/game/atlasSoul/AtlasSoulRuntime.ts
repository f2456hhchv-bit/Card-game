import type { BeautyIndexCategory, CollectiveCharacterTrait } from "./atlasSoulData";

/** "Ensure the Soul Engine never becomes a numerical morality system."
 * Only per-trait WITNESSED counts and an emergent dominant trait are
 * exposed — mirroring AF-162's real `PlayerPurposeObserver.
 * dominantPurpose` "reveal, never assign" discipline (see
 * atlasSoulData.ts module doc comment). No combined civilisation-
 * morality scalar exists anywhere in this class. */
export class CollectiveCharacterTracker {
  private readonly witnessCounts = new Map<CollectiveCharacterTrait, number>();

  witness(trait: CollectiveCharacterTrait): void {
    this.witnessCounts.set(trait, (this.witnessCounts.get(trait) ?? 0) + 1);
  }

  witnessCountFor(trait: CollectiveCharacterTrait): number {
    return this.witnessCounts.get(trait) ?? 0;
  }

  dominantTrait(): CollectiveCharacterTrait | null {
    if (this.witnessCounts.size === 0) return null;
    let best: CollectiveCharacterTrait | null = null;
    let bestCount = 0;
    for (const [trait, count] of this.witnessCounts) {
      if (count > bestCount) {
        best = trait;
        bestCount = count;
      }
    }
    return best;
  }
}

interface RitualRecord {
  ritual: string;
  participants: readonly string[];
  epoch: number;
}

/** "None are mandatory. All are meaningful." Structurally enforced by
 * having no completion/mandatory field at all — a ritual is only ever
 * observed happening, never required. */
export class RitualLog {
  private readonly records: RitualRecord[] = [];

  observe(ritual: string, participants: readonly string[], epoch: number): void {
    this.records.push({ ritual, participants, epoch });
  }

  countFor(ritual: string): number {
    return this.records.filter((r) => r.ritual === ritual).length;
  }

  all(): readonly RitualRecord[] {
    return this.records;
  }
}

interface HumanityMomentRecord {
  description: string;
  epoch: number;
}

/** "These define civilisation." A civilisation-wide witnessed-moments
 * ledger — distinct from AF-163's real `SignificanceTracker` (which
 * accumulates weight for one specific entity) since this logs many
 * small, unrelated human moments across all of civilisation. */
export class MomentsOfHumanityLog {
  private readonly records: HumanityMomentRecord[] = [];

  witness(description: string, epoch: number): void {
    this.records.push({ description, epoch });
  }

  all(): readonly HumanityMomentRecord[] {
    return this.records;
  }
}

/** "Beauty improves wellbeing. Not statistics alone." A per-category
 * level with a simple average — genuinely new. */
export class BeautyIndexTracker {
  private readonly levels = new Map<BeautyIndexCategory, number>();

  setLevel(category: BeautyIndexCategory, value: number): void {
    this.levels.set(category, Math.max(0, Math.min(100, value)));
  }

  levelFor(category: BeautyIndexCategory): number {
    return this.levels.get(category) ?? 0;
  }

  overallBeauty(): number {
    if (this.levels.size === 0) return 0;
    return Array.from(this.levels.values()).reduce((sum, value) => sum + value, 0) / this.levels.size;
  }
}
