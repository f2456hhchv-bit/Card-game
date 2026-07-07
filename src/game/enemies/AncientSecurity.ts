/**
 * Ancient Security runtime (AF-050 §Security System / §Ancient Network):
 * the one genuinely new mechanical surface of the Ancient Custodian
 * framework, and the fifth distinct faction doctrine — the mirror-opposite
 * direction of every prior one. Outlaw squads SCATTER (weaker, binary),
 * Machine networks DEGRADE (weaker, discrete steps), the Crystal Ecosystem
 * WEAKENS (weaker, continuous), the Void Swarm CORRUPTS (stronger with
 * time, contained by kills) — the Ancient Custodians ESCALATE: a five-stage
 * ladder that climbs while the player lingers near a defended site and
 * continuously de-escalates the moment they leave, permanently capped
 * lower every time a network node (a Shield Architect) is destroyed. Pure
 * and bus-free, like every prior *Runtime.
 */
import { ANCIENT_SECURITY_TUNING, SECURITY_STAGES, SECURITY_STAGE_THRESHOLDS, type SecurityStage } from "./ancientData";

export interface SecuritySnapshot {
  siteId: string;
  membersRemaining: number;
  nodesRemaining: number;
  alertLevel: number;
  stage: SecurityStage;
  ceiling: number;
  healPerSecond: number;
  damageBonus: number;
  incomingDamageReduction: number;
  guardiansDeployed: number;
}

export class AncientSecurityRuntime {
  private readonly members: Set<string>;
  private readonly nodes: Set<string>;
  private readonly totalNodes: number;
  private alert = 0;
  private deployClockMs = 0;
  private deployCount = 0;

  constructor(
    readonly siteId: string,
    memberIds: readonly string[],
    nodeIds: readonly string[],
  ) {
    this.members = new Set(memberIds);
    this.nodes = new Set(nodeIds);
    this.totalNodes = nodeIds.length;
  }

  /** Alert climbs while the player trespasses, de-escalates the moment they
   * leave — regardless of how many Custodians remain, unlike every prior
   * doctrine's kill-driven state. Always clamped to the node-derived ceiling. */
  update(dtMs: number, playerPresent: boolean): void {
    const dt = dtMs / 1000;
    if (playerPresent) {
      this.alert = Math.min(this.ceiling, this.alert + ANCIENT_SECURITY_TUNING.escalatePerSecondPresent * dt);
    } else {
      this.alert = Math.max(0, this.alert - ANCIENT_SECURITY_TUNING.deescalatePerSecondAbsent * dt);
    }
    if (this.stageIndex >= 3) this.deployClockMs += dtMs;
    else this.deployClockMs = 0;
  }

  /** Returns which role fell so the caller can react; a node kill permanently
   * shrinks the ceiling and immediately clamps current alert down to match —
   * "destroying network nodes weakens the defence grid", literally. */
  notifyDroneDestroyed(droneId: string): "node" | "member" | null {
    const wasNode = this.nodes.delete(droneId);
    const wasMember = this.members.delete(droneId);
    if (!wasMember) return null;
    if (wasNode) this.alert = Math.min(this.alert, this.ceiling);
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

  /** The ceiling shrinks in proportion to surviving nodes; a site with no
   * registered nodes has no structural cap at all (it never had a network to break). */
  get ceiling(): number {
    if (this.totalNodes === 0) return ANCIENT_SECURITY_TUNING.maxAlert;
    return ANCIENT_SECURITY_TUNING.maxAlert * (this.nodes.size / this.totalNodes);
  }

  get alertLevel(): number {
    return this.alert;
  }

  get stageIndex(): number {
    let index = 0;
    for (let i = SECURITY_STAGES.length - 1; i >= 0; i -= 1) {
      if (this.alert >= SECURITY_STAGE_THRESHOLDS[SECURITY_STAGES[i]!] * ANCIENT_SECURITY_TUNING.maxAlert) {
        index = i;
        break;
      }
    }
    return index;
  }

  get stage(): SecurityStage {
    return SECURITY_STAGES[this.stageIndex]!;
  }

  private get stageRatio(): number {
    return this.stageIndex / (SECURITY_STAGES.length - 1);
  }

  /** Repair Functions — one of three mechanically live Ancient Network traits, stepped by stage. */
  get healPerSecond(): number {
    return this.stageRatio * ANCIENT_SECURITY_TUNING.healPerSecondAtMaxResponse;
  }

  /** Target Information — composes into the same multiplier point every prior faction's bonus already uses. */
  get damageBonus(): number {
    return this.stageRatio * ANCIENT_SECURITY_TUNING.damageBonusAtMaxResponse;
  }

  /** Shield Capacity — the network's incoming-damage reduction, stepped by stage. */
  get incomingDamageReduction(): number {
    return this.stageRatio * ANCIENT_SECURITY_TUNING.incomingDamageReductionAtMaxResponse;
  }

  /** Guardian Deployment (stage 3+) gets real teeth: a capped, cadence-gated
   * reinforcement, reusing AF-047's Drone Factory cadence pattern. */
  tryDeployGuardian(): boolean {
    if (this.stageIndex < 3) return false;
    if (this.deployCount >= ANCIENT_SECURITY_TUNING.maxGuardianDeployments) return false;
    if (this.deployClockMs < ANCIENT_SECURITY_TUNING.guardianDeployIntervalMs) return false;
    this.deployClockMs = 0;
    this.deployCount += 1;
    return true;
  }

  get snapshot(): SecuritySnapshot {
    return {
      siteId: this.siteId,
      membersRemaining: this.members.size,
      nodesRemaining: this.nodes.size,
      alertLevel: this.alert,
      stage: this.stage,
      ceiling: this.ceiling,
      healPerSecond: this.healPerSecond,
      damageBonus: this.damageBonus,
      incomingDamageReduction: this.incomingDamageReduction,
      guardiansDeployed: this.deployCount,
    };
  }
}
