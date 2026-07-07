/**
 * Crystal Resonance runtime (AF-048 §Resonance Network / §Special Mechanics):
 * the one genuinely new mechanical surface of the Crystal Ascendancy
 * framework, and the third distinct faction doctrine — where Outlaw squads
 * SCATTER (fear, binary) and Machine networks DEGRADE (logic, discrete
 * per-service steps), the Crystal Ecosystem WEAKENS CONTINUOUSLY: no state
 * machine at all, just a strength value proportional to how many living
 * resonance-node units remain, hard-capped for fairness exactly like AF-047's
 * Adaptive AI. "Destroying resonance nodes weakens nearby organisms" is a
 * number that recomputes every time a node dies, not a flag. Pure and
 * bus-free, like every prior *Runtime.
 */
import { RESONANCE_TUNING } from "./crystalData";

export interface ResonanceSnapshot {
  ecosystemId: string;
  membersRemaining: number;
  nodesRemaining: number;
  resonanceStrength: number;
  healPerSecond: number;
  speedBonus: number;
  damageBonus: number;
}

export class CrystalResonanceRuntime {
  private readonly members: Set<string>;
  private readonly nodes: Set<string>;

  constructor(
    readonly ecosystemId: string,
    memberIds: readonly string[],
    nodeIds: readonly string[],
  ) {
    this.members = new Set(memberIds);
    this.nodes = new Set(nodeIds);
  }

  /** Returns which role fell so the caller can react; nodes weaken the network on death, not on any threshold. */
  notifyDroneDestroyed(droneId: string): "node" | "member" | null {
    const wasNode = this.nodes.delete(droneId);
    const wasMember = this.members.delete(droneId);
    if (!wasMember) return null;
    return wasNode ? "node" : "member";
  }

  isMember(droneId: string): boolean {
    return this.members.has(droneId);
  }

  isNode(droneId: string): boolean {
    return this.nodes.has(droneId);
  }

  /** A node built by a Growth Seeder or any other producer enrols like any member. */
  enrolMember(droneId: string, isNode = false): void {
    this.members.add(droneId);
    if (isNode) this.nodes.add(droneId);
  }

  get eliminated(): boolean {
    return this.members.size === 0;
  }

  /** Continuous strength — no steps, no state, capped for fairness like AF-047's Adaptive AI. */
  get resonanceStrength(): number {
    return Math.min(RESONANCE_TUNING.maxResonanceStrength, this.nodes.size * RESONANCE_TUNING.perNodeBonus);
  }

  private get strengthRatio(): number {
    return this.resonanceStrength / RESONANCE_TUNING.maxResonanceStrength;
  }

  /** Self Repair scales continuously with resonance strength, never a flat on/off. */
  get healPerSecond(): number {
    return this.strengthRatio * RESONANCE_TUNING.healPerSecondAtFullResonance;
  }

  get speedBonus(): number {
    return this.strengthRatio * RESONANCE_TUNING.speedBonusAtFullResonance;
  }

  /** Damage bonus composes into the same multiplier point as Focus Fire / Target Synchronisation. */
  get damageBonus(): number {
    return this.resonanceStrength;
  }

  get snapshot(): ResonanceSnapshot {
    return {
      ecosystemId: this.ecosystemId,
      membersRemaining: this.members.size,
      nodesRemaining: this.nodes.size,
      resonanceStrength: this.resonanceStrength,
      healPerSecond: this.healPerSecond,
      speedBonus: this.speedBonus,
      damageBonus: this.damageBonus,
    };
  }
}
