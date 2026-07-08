/**
 * Endgame runtime (AF-069). Pure, bus-free, and deterministic under an
 * injected Rng (world events only) — the AF-068 discipline continued.
 *
 * Design constraints made structural:
 * - "The endgame begins after the main campaign": the runtime constructs
 *   LOCKED and every progression operation no-ops until
 *   notifyCampaignComplete() — the gate is a state, not a convention.
 * - "Resets expedition progression. Retains permanent progression.":
 *   two SEPARATE maps. ascend() clears exactly one of them. The permanent
 *   map has no clearing operation at all.
 * - "Not inflated health. Not inflated damage.": AscensionModifierDef has
 *   no numeric field — difficulty escalates only along the five registered
 *   axes, and there is nowhere in the type to put a multiplier.
 * - "Never repetitive grinding. Never artificial progression walls.":
 *   ascension requirements and research costs are smooth escalating
 *   formulas (linear milestones, geometric node cost) — no caps, no
 *   cliffs, no daily gates. Levels beyond the authored defs generate
 *   forever ("Unlimited future expansion").
 * - "The player's journey becomes part of the universe": the legacy log is
 *   append-only; like AF-068, the class exposes no removal operation.
 */
import {
  ENDGAME_WORLD_EVENTS,
  ascensionLevelFor,
  milestonesRequiredFor,
  researchNodeCostFor,
  type AscensionLevelDef,
  type InfiniteResearchBranch,
  type LegacyRecordKind,
  type LegendaryExpeditionKind,
  type WorldEvolutionKind,
} from "./endgameData";
import type { Rng } from "../../core/rng/Rng";

export interface LegacyRecord {
  kind: LegacyRecordKind;
  text: string;
}

export interface EndgameSnapshot {
  unlocked: boolean;
  ascensionLevel: number;
  ascensionName: string;
  milestonesThisAscension: number;
  milestonesRequired: number;
  canAscend: boolean;
  expeditionsThisAscension: number;
  expeditionsLifetime: number;
  researchNodesTotal: number;
  worldEvolutionCount: number;
  legacyCount: number;
  activeModifierCount: number;
}

export class EndgameRuntime {
  private unlockedFlag = false;
  private ascensionLevel = 0;
  private milestonesThisAscension = 0;
  /** Per-ascension expedition progression — the ONLY thing ascend() resets. */
  private readonly expeditionProgress = new Map<LegendaryExpeditionKind, number>();
  /** Permanent progression — no operation on this class ever clears it. */
  private readonly lifetimeExpeditions = new Map<LegendaryExpeditionKind, number>();
  private readonly researchNodes = new Map<InfiniteResearchBranch, number>();
  private researchPointsBanked = 0;
  private readonly evolutionLog: WorldEvolutionKind[] = [];
  private readonly legacyLog: LegacyRecord[] = [];

  constructor(private readonly authoredAscensions: readonly AscensionLevelDef[]) {}

  /** The endgame begins after the main campaign — everything below no-ops until this fires. */
  notifyCampaignComplete(): void {
    this.unlockedFlag = true;
  }

  get isUnlocked(): boolean {
    return this.unlockedFlag;
  }

  /** Major milestones (boss defeats, expedition victories) feed the next ascension climb. */
  recordMilestone(): boolean {
    if (!this.unlockedFlag) return false;
    this.milestonesThisAscension += 1;
    return true;
  }

  get canAscend(): boolean {
    return this.unlockedFlag && this.milestonesThisAscension >= milestonesRequiredFor(this.ascensionLevel + 1);
  }

  /** Ascend: resets EXPEDITION progression, retains PERMANENT progression — the two-map split. */
  ascend(): AscensionLevelDef | null {
    if (!this.canAscend) return null;
    this.ascensionLevel += 1;
    this.milestonesThisAscension = 0;
    this.expeditionProgress.clear(); // resets expedition progression…
    // …and deliberately touches nothing else: lifetime totals, research,
    // evolution, and legacy all persist. Each ascension changes gameplay
    // through its def's axis modifiers, never through stats.
    return ascensionLevelFor(this.ascensionLevel, this.authoredAscensions);
  }

  get currentAscension(): AscensionLevelDef | null {
    return this.ascensionLevel === 0 ? null : ascensionLevelFor(this.ascensionLevel, this.authoredAscensions);
  }

  /** All modifiers accumulated across every ascension so far — escalation compounds. */
  activeModifiers(): readonly { axis: string; description: string }[] {
    const modifiers: { axis: string; description: string }[] = [];
    for (let level = 1; level <= this.ascensionLevel; level += 1) {
      modifiers.push(...ascensionLevelFor(level, this.authoredAscensions).modifiers);
    }
    return modifiers;
  }

  /** Legendary expeditions — the primary endgame activity. Lifetime totals never reset. */
  completeExpedition(kind: LegendaryExpeditionKind): boolean {
    if (!this.unlockedFlag) return false;
    this.expeditionProgress.set(kind, (this.expeditionProgress.get(kind) ?? 0) + 1);
    this.lifetimeExpeditions.set(kind, (this.lifetimeExpeditions.get(kind) ?? 0) + 1);
    return true;
  }

  expeditionsThisAscension(kind?: LegendaryExpeditionKind): number {
    if (kind) return this.expeditionProgress.get(kind) ?? 0;
    let total = 0;
    for (const count of this.expeditionProgress.values()) total += count;
    return total;
  }

  expeditionsLifetime(kind?: LegendaryExpeditionKind): number {
    if (kind) return this.lifetimeExpeditions.get(kind) ?? 0;
    let total = 0;
    for (const count of this.lifetimeExpeditions.values()) total += count;
    return total;
  }

  /** Infinite research: bank points, buy nodes at a smooth geometric cost — no cap, no wall. */
  investResearch(points: number): void {
    if (!this.unlockedFlag || points <= 0) return;
    this.researchPointsBanked += points;
  }

  tryUnlockResearchNode(branch: InfiniteResearchBranch): boolean {
    if (!this.unlockedFlag) return false;
    const owned = this.researchNodes.get(branch) ?? 0;
    const cost = researchNodeCostFor(owned);
    if (this.researchPointsBanked < cost) return false;
    this.researchPointsBanked -= cost;
    this.researchNodes.set(branch, owned + 1);
    return true;
  }

  researchNodesFor(branch: InfiniteResearchBranch): number {
    return this.researchNodes.get(branch) ?? 0;
  }

  get bankedResearchPoints(): number {
    return this.researchPointsBanked;
  }

  /** The post-campaign galaxy continues evolving — an append-only record. */
  recordEvolution(kind: WorldEvolutionKind): boolean {
    if (!this.unlockedFlag) return false;
    this.evolutionLog.push(kind);
    return true;
  }

  get worldEvolution(): readonly WorldEvolutionKind[] {
    return this.evolutionLog;
  }

  /** Seeded weighted world-event pick — AF-036's event-pool discipline, deterministic under the injected Rng. */
  nextWorldEvent(rng: Rng): string {
    const totalWeight = ENDGAME_WORLD_EVENTS.reduce((sum, e) => sum + e.weight, 0);
    let roll = rng.next() * totalWeight;
    for (const event of ENDGAME_WORLD_EVENTS) {
      roll -= event.weight;
      if (roll <= 0) return event.kind;
    }
    return ENDGAME_WORLD_EVENTS[ENDGAME_WORLD_EVENTS.length - 1]!.kind;
  }

  /** The journey becomes part of the universe — append-only, like everything else here. */
  recordLegacy(kind: LegacyRecordKind, text: string): boolean {
    if (!this.unlockedFlag) return false;
    this.legacyLog.push({ kind, text });
    return true;
  }

  get legacy(): readonly LegacyRecord[] {
    return this.legacyLog;
  }

  get snapshot(): EndgameSnapshot {
    let researchTotal = 0;
    for (const count of this.researchNodes.values()) researchTotal += count;
    return {
      unlocked: this.unlockedFlag,
      ascensionLevel: this.ascensionLevel,
      ascensionName: this.currentAscension?.name ?? "—",
      milestonesThisAscension: this.milestonesThisAscension,
      milestonesRequired: milestonesRequiredFor(this.ascensionLevel + 1),
      canAscend: this.canAscend,
      expeditionsThisAscension: this.expeditionsThisAscension(),
      expeditionsLifetime: this.expeditionsLifetime(),
      researchNodesTotal: researchTotal,
      worldEvolutionCount: this.evolutionLog.length,
      legacyCount: this.legacyLog.length,
      activeModifierCount: this.activeModifiers().length,
    };
  }
}
