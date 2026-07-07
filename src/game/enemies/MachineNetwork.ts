/**
 * Machine Network runtime (AF-047 §Network Command / §Special Mechanics /
 * §Adaptive AI): the one genuinely new mechanical surface of the Machine
 * Collective framework, and the deliberate mirror-opposite of AF-046's
 * OutlawSquadRuntime — where a broken squad SCATTERS (fear), a broken
 * network DEGRADES (logic): units keep fighting, but Target
 * Synchronisation, Shared Shields, Self Repair, and the Drone Factory all
 * stop the moment the Command Core dies. Adaptive AI tracks incoming
 * damage by school and builds a hard-capped resistance — "adapts without
 * becoming unfair" is a numeric cap, not a promise. Pure and bus-free,
 * like every prior *Runtime.
 */
import type { DamageSchool } from "../combat/combatTuning";
import { MACHINE_ADAPTATION_TUNING, MACHINE_NETWORK_TUNING, type NetworkCommand } from "./machineData";

export type NetworkState = "linked" | "degraded" | "eliminated";

export interface NetworkSnapshot {
  networkId: string;
  state: NetworkState;
  coreOnline: boolean;
  membersRemaining: number;
  shieldNetworkUp: boolean;
  repairUp: boolean;
  factoryUp: boolean;
  adaptation: Readonly<Record<DamageSchool, number>>;
  factorySpawns: number;
}

export class MachineNetworkRuntime {
  private networkState: NetworkState = "linked";
  private coreDown = false;
  private readonly members: Set<string>;
  private readonly damageCounts: Record<DamageSchool, number> = { physical: 0, energy: 0 };
  private factoryClockMs = 0;
  private factorySpawnCount = 0;

  constructor(
    readonly networkId: string,
    private readonly commandCoreId: string,
    memberIds: readonly string[],
    private shieldGeneratorId: string | null,
    private repairDroneId: string | null,
    private constructorId: string | null,
  ) {
    this.members = new Set(memberIds);
  }

  update(fixedDtMs: number): void {
    if (this.factoryUp) this.factoryClockMs += fixedDtMs;
  }

  /** Returns which function fell so the caller can react; degrading is silent logic, not panic. */
  notifyDroneDestroyed(droneId: string): "core" | "member" | null {
    if (droneId === this.commandCoreId && !this.coreDown) {
      this.coreDown = true;
      this.networkState = this.members.size > 0 ? "degraded" : "eliminated";
      return "core";
    }
    if (this.members.delete(droneId)) {
      if (droneId === this.shieldGeneratorId) this.shieldGeneratorId = null;
      if (droneId === this.repairDroneId) this.repairDroneId = null;
      if (droneId === this.constructorId) this.constructorId = null;
      if (this.coreDown && this.members.size === 0) this.networkState = "eliminated";
      return "member";
    }
    return null;
  }

  isMember(droneId: string): boolean {
    return droneId === this.commandCoreId || this.members.has(droneId);
  }

  isCore(droneId: string): boolean {
    return droneId === this.commandCoreId;
  }

  /** Factory-built drones enrol as ordinary members. */
  enrolMember(droneId: string): void {
    this.members.add(droneId);
  }

  get state(): NetworkState {
    return this.networkState;
  }

  /** Target Synchronisation — coordinated fire only while the Core routes it. */
  get targetSyncActive(): boolean {
    return this.networkState === "linked";
  }

  get targetSyncDamageBonus(): number {
    return this.targetSyncActive ? MACHINE_NETWORK_TUNING.targetSyncDamageBonus : 0;
  }

  /** Shared Shields — requires both the Core (routing) and the Generator (lattice). */
  get shieldNetworkUp(): boolean {
    return this.networkState === "linked" && this.shieldGeneratorId !== null;
  }

  /** Self Repair — requires both the Core (allocation) and the Repair Drone. */
  get repairUp(): boolean {
    return this.networkState === "linked" && this.repairDroneId !== null;
  }

  /** Drone Factory — requires both the Core (deployment) and the Constructor. */
  get factoryUp(): boolean {
    return (
      this.networkState === "linked" &&
      this.constructorId !== null &&
      this.factorySpawnCount < MACHINE_NETWORK_TUNING.maxFactorySpawnsPerNetwork
    );
  }

  /** Fires at most once per factory interval while the factory runs. */
  tryConstructDrone(): boolean {
    if (!this.factoryUp || this.factoryClockMs < MACHINE_NETWORK_TUNING.factoryIntervalMs) return false;
    this.factoryClockMs = 0;
    this.factorySpawnCount += 1;
    return true;
  }

  get constructorDroneId(): string | null {
    return this.constructorId;
  }

  /** Adaptive AI — record what hurt the network; only counts while linked. */
  recordIncomingDamage(school: DamageSchool): void {
    if (this.networkState !== "linked") return;
    this.damageCounts[school] += 1;
  }

  /** Adapted resistance to a school, hard-capped for fairness; drops entirely once degraded. */
  adaptedReduction(school: DamageSchool): number {
    if (this.networkState !== "linked") return 0;
    const steps = Math.floor(this.damageCounts[school] / MACHINE_ADAPTATION_TUNING.hitsPerStep);
    return Math.min(MACHINE_ADAPTATION_TUNING.maxReduction, steps * MACHINE_ADAPTATION_TUNING.reductionPerStep);
  }

  /** Combined incoming-damage factor for a networked machine hit by `school`. */
  incomingDamageFactor(school: DamageSchool): number {
    const shieldFactor = this.shieldNetworkUp ? MACHINE_NETWORK_TUNING.sharedShieldDamageFactor : 1;
    return shieldFactor * (1 - this.adaptedReduction(school));
  }

  get currentCommand(): NetworkCommand {
    if (this.networkState === "linked") return "firePriority";
    return "movement"; // degraded machines still compute — they just stop coordinating
  }

  get snapshot(): NetworkSnapshot {
    return {
      networkId: this.networkId,
      state: this.networkState,
      coreOnline: !this.coreDown,
      membersRemaining: this.members.size,
      shieldNetworkUp: this.shieldNetworkUp,
      repairUp: this.repairUp,
      factoryUp: this.factoryUp,
      adaptation: { ...this.damageCounts },
      factorySpawns: this.factorySpawnCount,
    };
  }
}
