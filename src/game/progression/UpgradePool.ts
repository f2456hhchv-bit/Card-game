/**
 * Weighted upgrade offer pool (AF-022 §5). Seeded and deterministic per
 * mission; maxed upgrades excluded; distinct choices per offer. Reroll,
 * choice locking, and wider offers are framework methods awaiting their
 * content buyers (relics/Commanders) — supported, not speculatively wired.
 */
import type { Rng } from "../../core/rng/Rng";
import type { UpgradeDefinition } from "./xpTuning";

export interface UpgradeOffer {
  choices: readonly UpgradeDefinition[];
}

export class UpgradePool {
  private readonly taken = new Map<string, number>();
  private lockedChoice: UpgradeDefinition | null = null;

  constructor(
    private readonly definitions: readonly UpgradeDefinition[],
    private readonly rng: Rng,
    /**
     * GP-FINAL §Build Philosophy: additive, optional gate over which
     * definitions may appear in an offer at all — every existing caller
     * that omits it keeps its old unrestricted behaviour. main.ts uses it
     * to cap simultaneously-held distinct Passives and to withhold weapon-
     * unlock offers once the loadout is full/the weapon is already held.
     */
    private readonly isAllowed?: (def: UpgradeDefinition) => boolean,
  ) {}

  /** Times an upgrade has been taken (drives stack exclusion + tooltips). */
  stacksOf(id: string): number {
    return this.taken.get(id) ?? 0;
  }

  recordTaken(id: string): void {
    this.taken.set(id, this.stacksOf(id) + 1);
    if (this.lockedChoice?.id === id) this.lockedChoice = null;
  }

  /** Lock a choice so it reappears in the next offer (future-flag buyer). */
  lockChoice(choice: UpgradeDefinition): void {
    this.lockedChoice = choice;
  }

  /** Reroll = a fresh offer from the same deterministic stream. */
  reroll(count: number): UpgradeOffer {
    return this.offer(count);
  }

  offer(count: number): UpgradeOffer {
    const available = this.definitions.filter(
      (def) =>
        (def.maxStacks === null || this.stacksOf(def.id) < def.maxStacks) &&
        (!this.isAllowed || this.isAllowed(def)),
    );
    const choices: UpgradeDefinition[] = [];

    if (this.lockedChoice && available.some((d) => d.id === this.lockedChoice?.id)) {
      choices.push(this.lockedChoice);
    }

    const remaining = available.filter((d) => !choices.some((c) => c.id === d.id));
    while (choices.length < count && remaining.length > 0) {
      const totalWeight = remaining.reduce((sum, d) => sum + d.weight, 0);
      let roll = this.rng.next() * totalWeight;
      let pickedIndex = remaining.length - 1;
      for (let i = 0; i < remaining.length; i += 1) {
        roll -= (remaining[i] as UpgradeDefinition).weight;
        if (roll <= 0) {
          pickedIndex = i;
          break;
        }
      }
      choices.push(remaining[pickedIndex] as UpgradeDefinition);
      remaining.splice(pickedIndex, 1);
    }
    return { choices };
  }
}
