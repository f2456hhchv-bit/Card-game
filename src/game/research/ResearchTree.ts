/**
 * Research tree engine (AF-024 §3). Prerequisite gating, graph validation
 * (cycles / dangling prerequisites fail loudly), hidden discoveries, point
 * spending, full reset with refund + preserved discoveries, and save-slice
 * serialisation. The engine is content-agnostic; trees are data.
 */
import type { ResearchNodeDef } from "./researchData";

export type ResearchNodeState = "unlocked" | "available" | "locked" | "hidden";

export interface ResearchSaveData {
  points: number;
  unlocked: string[];
  revealed: string[];
  totalPointsEarned: number;
}

export interface ResearchSnapshot {
  points: number;
  totalPointsEarned: number;
  unlockedCount: number;
  availableCount: number;
  lockedCount: number;
  hiddenCount: number;
}

export class ResearchTree {
  private readonly nodes = new Map<string, ResearchNodeDef>();
  private readonly unlocked = new Set<string>();
  private readonly revealed = new Set<string>();
  private points = 0;
  private totalEarned = 0;

  constructor(
    definitions: readonly ResearchNodeDef[],
    private readonly onUnlocked?: (node: ResearchNodeDef) => void,
  ) {
    for (const def of definitions) {
      if (this.nodes.has(def.id)) throw new Error(`ResearchTree: duplicate node "${def.id}"`);
      this.nodes.set(def.id, def);
    }
    const errors = this.validate();
    if (errors.length > 0) throw new Error(`ResearchTree: invalid tree — ${errors.join("; ")}`);
  }

  /** Graph validation: unknown prerequisites and cycles (AF-001 §9). */
  validate(): string[] {
    const errors: string[] = [];
    for (const node of this.nodes.values()) {
      for (const prerequisite of node.prerequisites) {
        if (!this.nodes.has(prerequisite)) {
          errors.push(`"${node.id}" requires unknown node "${prerequisite}"`);
        }
      }
    }
    const visiting = new Set<string>();
    const done = new Set<string>();
    const visit = (id: string): boolean => {
      if (done.has(id)) return true;
      if (visiting.has(id)) return false; // cycle
      visiting.add(id);
      for (const prerequisite of this.nodes.get(id)?.prerequisites ?? []) {
        if (this.nodes.has(prerequisite) && !visit(prerequisite)) return false;
      }
      visiting.delete(id);
      done.add(id);
      return true;
    };
    for (const id of this.nodes.keys()) {
      if (!visit(id)) {
        errors.push(`cycle involving "${id}"`);
        break;
      }
    }
    return errors;
  }

  addPoints(amount: number): void {
    if (amount <= 0) return;
    this.points += amount;
    this.totalEarned += amount;
  }

  stateOf(id: string): ResearchNodeState {
    const node = this.nodes.get(id);
    if (!node) return "hidden";
    if (this.unlocked.has(id)) return "unlocked";
    if (node.hidden && !this.revealed.has(id)) return "hidden";
    const prerequisitesMet = node.prerequisites.every((p) => this.unlocked.has(p));
    return prerequisitesMet ? "available" : "locked";
  }

  canUnlock(id: string): { ok: true } | { ok: false; reason: string } {
    const node = this.nodes.get(id);
    if (!node) return { ok: false, reason: "unknown node" };
    const state = this.stateOf(id);
    if (state === "unlocked") return { ok: false, reason: "already unlocked" };
    if (state === "hidden") return { ok: false, reason: "not yet discovered" };
    if (state === "locked") return { ok: false, reason: "prerequisites not met" };
    if (this.points < node.cost) return { ok: false, reason: "insufficient points" };
    return { ok: true };
  }

  unlock(id: string): boolean {
    const check = this.canUnlock(id);
    if (!check.ok) return false;
    const node = this.nodes.get(id) as ResearchNodeDef;
    this.points -= node.cost;
    this.unlocked.add(id);
    this.onUnlocked?.(node);
    return true;
  }

  /** Discovery trigger (boss defeat, artifact, rare event — via the bus). */
  reveal(id: string): boolean {
    const node = this.nodes.get(id);
    if (!node || !node.hidden || this.revealed.has(id)) return false;
    this.revealed.add(id);
    return true;
  }

  /**
   * Full reset (AF-024 §3): refunds every spent point; discoveries and
   * lifetime statistics are preserved. Caller shows the destructive-action
   * warning first (AF-003 §8).
   */
  reset(): number {
    let refund = 0;
    for (const id of this.unlocked) refund += this.nodes.get(id)?.cost ?? 0;
    this.unlocked.clear();
    this.points += refund;
    return refund;
  }

  isUnlocked(id: string): boolean {
    return this.unlocked.has(id);
  }

  get unlockedNodes(): ResearchNodeDef[] {
    return [...this.unlocked].map((id) => this.nodes.get(id) as ResearchNodeDef);
  }

  /** Nodes visible on the research screen (everything except undiscovered). */
  get visibleNodes(): ResearchNodeDef[] {
    return [...this.nodes.values()].filter((n) => this.stateOf(n.id) !== "hidden");
  }

  get snapshot(): ResearchSnapshot {
    let available = 0;
    let locked = 0;
    let hidden = 0;
    for (const id of this.nodes.keys()) {
      const state = this.stateOf(id);
      if (state === "available") available += 1;
      else if (state === "locked") locked += 1;
      else if (state === "hidden") hidden += 1;
    }
    return {
      points: this.points,
      totalPointsEarned: this.totalEarned,
      unlockedCount: this.unlocked.size,
      availableCount: available,
      lockedCount: locked,
      hiddenCount: hidden,
    };
  }

  toSave(): ResearchSaveData {
    return {
      points: this.points,
      unlocked: [...this.unlocked],
      revealed: [...this.revealed],
      totalPointsEarned: this.totalEarned,
    };
  }

  /** Restore from a save slice; unknown ids are dropped (deprecation-safe,
   * AF-013 §5 — old saves always load). */
  loadSave(data: ResearchSaveData): void {
    this.points = Math.max(0, data.points);
    this.totalEarned = Math.max(0, data.totalPointsEarned);
    this.unlocked.clear();
    this.revealed.clear();
    for (const id of data.unlocked) if (this.nodes.has(id)) this.unlocked.add(id);
    for (const id of data.revealed) if (this.nodes.has(id)) this.revealed.add(id);
  }
}
