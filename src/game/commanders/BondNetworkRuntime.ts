/**
 * BondNetworkRuntime (AF-130) — the real, tested engine behind the
 * Commander Bond Network. Tracks live bond levels for every pair in
 * the seeded graph, never lets a bond level decrease ("nothing resets
 * artificially"), and gates Dual Ultimates on maximum bond.
 */
import { bondKey, MAX_BOND_LEVEL, type BondDef, type DualUltimateDef } from "./bondNetworkData";

export interface BondNetworkSnapshot {
  totalBonds: number;
  discoveredBonds: number;
  maxedBonds: number;
  averageLevel: number;
}

export class BondNetworkRuntime {
  private readonly bonds = new Map<string, BondDef>();

  constructor(seed: readonly BondDef[], private readonly dualUltimates: readonly DualUltimateDef[]) {
    for (const bond of seed) this.bonds.set(bondKey(bond.commanderA, bond.commanderB), { ...bond });
  }

  bondFor(commanderA: string, commanderB: string): BondDef | undefined {
    return this.bonds.get(bondKey(commanderA, commanderB));
  }

  /** Increases a bond's level by `amount` (default 1), capped at MAX_BOND_LEVEL. Never decreases. */
  growBond(commanderA: string, commanderB: string, amount = 1): void {
    if (amount <= 0) return;
    const bond = this.bondFor(commanderA, commanderB);
    if (!bond) return;
    bond.level = Math.min(MAX_BOND_LEVEL, bond.level + amount);
  }

  isMaxBond(commanderA: string, commanderB: string): boolean {
    return this.bondFor(commanderA, commanderB)?.level === MAX_BOND_LEVEL;
  }

  /** The static Dual Ultimate pairing for this pair, regardless of current bond level. */
  dualUltimateDefFor(commanderA: string, commanderB: string): DualUltimateDef | null {
    const key = bondKey(commanderA, commanderB);
    return this.dualUltimates.find((d) => bondKey(d.commanderA, d.commanderB) === key) ?? null;
  }

  /** The Dual Ultimate, but only once its bond has reached maximum level. */
  unlockedDualUltimateFor(commanderA: string, commanderB: string): DualUltimateDef | null {
    if (!this.isMaxBond(commanderA, commanderB)) return null;
    return this.dualUltimateDefFor(commanderA, commanderB);
  }

  snapshot(): BondNetworkSnapshot {
    let discovered = 0;
    let maxed = 0;
    let levelSum = 0;
    for (const bond of this.bonds.values()) {
      levelSum += bond.level;
      if (bond.level > 0) discovered++;
      if (bond.level === MAX_BOND_LEVEL) maxed++;
    }
    return {
      totalBonds: this.bonds.size,
      discoveredBonds: discovered,
      maxedBonds: maxed,
      averageLevel: this.bonds.size > 0 ? levelSum / this.bonds.size : 0,
    };
  }
}

/**
 * EmotionalMemoryLog (AF-130 §Emotional System) — commanders remember;
 * nothing resets artificially, so this log is strictly append-only.
 */
export interface EmotionalMemoryEntry {
  commanderId: string;
  kind: string;
  description: string;
  sequence: number;
}

export class EmotionalMemoryLog {
  private readonly entries: EmotionalMemoryEntry[] = [];

  record(commanderId: string, kind: string, description: string): void {
    this.entries.push({ commanderId, kind, description, sequence: this.entries.length });
  }

  historyFor(commanderId: string): readonly EmotionalMemoryEntry[] {
    return this.entries.filter((entry) => entry.commanderId === commanderId);
  }

  all(): readonly EmotionalMemoryEntry[] {
    return this.entries;
  }
}
