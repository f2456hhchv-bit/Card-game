/**
 * Hive Evolution runtime (AF-051 §Evolution System / §Hive Network): the
 * one genuinely new mechanical surface of the Xenomorph framework, and the
 * sixth distinct faction doctrine. Every prior doctrine has a way down —
 * Outlaw scatter times out, Machine services degrade, Crystal strength
 * recomputes with a dying count, Void corruption decays, Ancient alert
 * de-escalates and its very ceiling shrinks. The Hive's Biomass has none:
 * it only ever grows, fed by every death including the Hive's own —
 * "the Hive never wastes biomass" is literal. Evolution Stage is a pure
 * ratchet over that pool, hard-capped for fairness like every prior
 * doctrine's number. The one thing that CAN be lost tactically is the Hive
 * Node's network link (AF-047's discrete on/off flag technique, reused) —
 * losing it cuts shared Healing/Target Information/Aggression to whatever
 * is left in the current encounter, without ever touching Biomass itself.
 * Pure and bus-free, like every prior *Runtime.
 */
import { EVOLUTION_STAGES, EVOLUTION_STAGE_THRESHOLDS, HIVE_EVOLUTION_TUNING, type EvolutionStage } from "./xenoData";

export interface HiveSnapshot {
  hiveId: string;
  membersRemaining: number;
  nodesRemaining: number;
  nodeLinked: boolean;
  biomass: number;
  stage: EvolutionStage;
  healPerSecond: number;
  damageBonus: number;
  speedBonus: number;
  reinforcementsCalled: number;
}

export class HiveEvolutionRuntime {
  private readonly members: Set<string>;
  private readonly nodes: Set<string>;
  private biomass = 0;
  private reinforceClockMs = 0;
  private reinforceCount = 0;

  constructor(
    readonly hiveId: string,
    memberIds: readonly string[],
    nodeIds: readonly string[],
  ) {
    this.members = new Set(memberIds);
    this.nodes = new Set(nodeIds);
  }

  /** Biomass trickles up on its own (the "Encounter Duration" input);
   * Rapid Reinforcement only clocks up once evolved enough and still linked. */
  update(dtMs: number): void {
    const dt = dtMs / 1000;
    this.biomass = Math.min(HIVE_EVOLUTION_TUNING.maxBiomass, this.biomass + HIVE_EVOLUTION_TUNING.biomassPerSecond * dt);
    if (this.nodeLinked && this.stageIndex >= 2) this.reinforceClockMs += dtMs;
    else this.reinforceClockMs = 0;
  }

  /** Returns which role fell so the caller can react. Every death feeds
   * Biomass — "the Hive never wastes biomass" applies even to its own losses.
   * A Node's death additionally severs the network link immediately. */
  notifyDroneDestroyed(droneId: string): "node" | "member" | null {
    const wasNode = this.nodes.delete(droneId);
    const wasMember = this.members.delete(droneId);
    if (!wasMember) return null;
    this.biomass = Math.min(HIVE_EVOLUTION_TUNING.maxBiomass, this.biomass + HIVE_EVOLUTION_TUNING.biomassPerDeath);
    return wasNode ? "node" : "member";
  }

  isMember(droneId: string): boolean {
    return this.members.has(droneId);
  }

  isNode(droneId: string): boolean {
    return this.nodes.has(droneId);
  }

  enrolMember(droneId: string): void {
    this.members.add(droneId);
  }

  get eliminated(): boolean {
    return this.members.size === 0;
  }

  /** The network link — severed the instant every registered Node is dead. */
  get nodeLinked(): boolean {
    return this.nodes.size > 0;
  }

  get biomassLevel(): number {
    return this.biomass;
  }

  get stageIndex(): number {
    let index = 0;
    for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i -= 1) {
      if (this.biomass >= EVOLUTION_STAGE_THRESHOLDS[EVOLUTION_STAGES[i]!] * HIVE_EVOLUTION_TUNING.maxBiomass) {
        index = i;
        break;
      }
    }
    return index;
  }

  get stage(): EvolutionStage {
    return EVOLUTION_STAGES[this.stageIndex]!;
  }

  private get stageRatio(): number {
    return this.stageIndex / (EVOLUTION_STAGES.length - 1);
  }

  /** Organic Regeneration — gated on the network link, magnitude from the permanent Evolution Stage. */
  get healPerSecond(): number {
    return this.nodeLinked ? this.stageRatio * HIVE_EVOLUTION_TUNING.healPerSecondAtMaxEvolution : 0;
  }

  /** Target Information — composes into the same multiplier point every prior faction's bonus already uses. */
  get damageBonus(): number {
    return this.nodeLinked ? this.stageRatio * HIVE_EVOLUTION_TUNING.damageBonusAtMaxEvolution : 0;
  }

  /** Aggression — the Hive's own speed trait; also gated on the link. */
  get speedBonus(): number {
    return this.nodeLinked ? this.stageRatio * HIVE_EVOLUTION_TUNING.speedBonusAtMaxEvolution : 0;
  }

  /** Rapid Reinforcement, cadence-gated and lifetime-capped — the fifth reuse of AF-047's Drone Factory shape. */
  tryReinforce(): boolean {
    if (!this.nodeLinked || this.stageIndex < 2) return false;
    if (this.reinforceCount >= HIVE_EVOLUTION_TUNING.maxReinforcements) return false;
    if (this.reinforceClockMs < HIVE_EVOLUTION_TUNING.reinforceIntervalMs) return false;
    this.reinforceClockMs = 0;
    this.reinforceCount += 1;
    return true;
  }

  get snapshot(): HiveSnapshot {
    return {
      hiveId: this.hiveId,
      membersRemaining: this.members.size,
      nodesRemaining: this.nodes.size,
      nodeLinked: this.nodeLinked,
      biomass: this.biomass,
      stage: this.stage,
      healPerSecond: this.healPerSecond,
      damageBonus: this.damageBonus,
      speedBonus: this.speedBonus,
      reinforcementsCalled: this.reinforceCount,
    };
  }
}
