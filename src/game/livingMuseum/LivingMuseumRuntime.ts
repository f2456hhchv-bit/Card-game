/**
 * LivingMuseumRuntime pieces (AF-134). Composes with AF-130's real
 * BondNetworkRuntime and AF-133's real GiftLedger/PlayerChronicle/
 * PhotoAlbum — never duplicates them.
 */
import type { BondNetworkRuntime } from "../commanders/BondNetworkRuntime";
import type { CommanderDef } from "../commanders/commanderData";
import { GiftLedger } from "../legacy/LegacyEngineRuntime";
import { clampProgress, type CommanderDonationSeed, type RestorationArtifactType, type RestorationProject, type VisitorType } from "./livingMuseumData";

/** Restoration is its own progression system — progress only ever
 * grows, capped at 100 (complete). */
export class RestorationLab {
  private readonly projects = new Map<string, RestorationProject>();

  beginRestoration(id: string, artifactType: RestorationArtifactType): void {
    if (this.projects.has(id)) return;
    this.projects.set(id, { id, artifactType, progress: 0 });
  }

  advance(id: string, amount: number): void {
    const project = this.projects.get(id);
    if (!project || amount <= 0) return;
    project.progress = clampProgress(project.progress + amount);
  }

  isComplete(id: string): boolean {
    return (this.projects.get(id)?.progress ?? 0) >= 100;
  }

  allProjects(): readonly RestorationProject[] {
    return [...this.projects.values()];
  }

  completedCount(): number {
    return this.allProjects().filter((p) => p.progress >= 100).length;
  }
}

/** A commander's Commander Hall room "expands alongside Bond Level" —
 * computed as their strongest bond with any other real roster
 * commander, using only BondNetworkRuntime's existing public API. */
export function strongestBondLevelFor(commanderId: string, roster: readonly CommanderDef[], bondNetwork: BondNetworkRuntime): number {
  let best = 0;
  for (const other of roster) {
    if (other.id === commanderId) continue;
    const level = bondNetwork.bondFor(commanderId, other.id)?.level ?? 0;
    if (level > best) best = level;
  }
  return best;
}

/** Commander donations reuse AF-133's real GiftLedger/PersonalGiftDef —
 * "donates items over time" and "presents gifts" are the same concept. */
export function seedCommanderDonations(examples: readonly CommanderDonationSeed[]): GiftLedger {
  const ledger = new GiftLedger();
  for (const [i, example] of examples.entries()) {
    ledger.receive({
      id: `museum-donation-${i}`,
      kind: "Historical artifacts",
      commanderId: example.commanderId,
      museumDescription: example.item,
    });
  }
  return ledger;
}

export interface VisitorArrival {
  visitorType: VisitorType;
  sequence: number;
}

export class VisitorLog {
  private readonly arrivals: VisitorArrival[] = [];

  arrive(visitorType: VisitorType): void {
    this.arrivals.push({ visitorType, sequence: this.arrivals.length });
  }

  countFor(visitorType: VisitorType): number {
    return this.arrivals.filter((a) => a.visitorType === visitorType).length;
  }

  totalVisitors(): number {
    return this.arrivals.length;
  }
}

/** One small, reusable registry — Theater programs, Library books, and
 * the Audio Archive are all "collect real items of kind K" shaped the
 * same way, so this one generic class serves all three rather than
 * three near-identical copies. */
export class MuseumCollectionRegistry<K extends string> {
  private readonly items: Array<{ kind: K; title: string }> = [];

  collect(kind: K, title: string): void {
    this.items.push({ kind, title });
  }

  all(): readonly { kind: K; title: string }[] {
    return this.items;
  }

  countFor(kind: K): number {
    return this.items.filter((i) => i.kind === kind).length;
  }
}

/** Higher museum quality (0-100) improves every galactic-impact metric
 * proportionally — additive to this module only. */
export function galacticImpactFor(museumQuality: number): Record<string, number> {
  const clamped = clampProgress(museumQuality);
  return {
    Research: clamped * 0.01,
    Tourism: clamped * 0.015,
    "Faction relations": clamped * 0.008,
    "Commander morale": clamped * 0.01,
    "Scientific discoveries": clamped * 0.012,
    "Historic preservation": clamped * 0.01,
  };
}

export class MuseumQualityTracker {
  private quality = 10;

  improve(amount: number): void {
    if (amount <= 0) return;
    this.quality = clampProgress(this.quality + amount);
  }

  value(): number {
    return this.quality;
  }
}
