/**
 * Void Corruption runtime (AF-049 §Void Network / §Corruption System): the
 * one genuinely new mechanical surface of the Void Swarm framework, and the
 * fourth distinct faction doctrine. Where Outlaw squads SCATTER (a binary
 * timer), Machine networks DEGRADE (discrete per-service steps), and the
 * Crystal Ecosystem WEAKENS (continuous, recomputed purely from a living
 * count), the Void Swarm CORRUPTS: a level that climbs over time while
 * Beacons live, decays once every Beacon is contained, and steps down
 * immediately on any single Beacon kill — time itself is part of this
 * doctrine, not just who is still alive. Pure and bus-free, like every
 * prior *Runtime.
 */
import { VOID_CORRUPTION_TUNING } from "./voidData";

export interface CorruptionSnapshot {
  swarmId: string;
  membersRemaining: number;
  beaconsRemaining: number;
  corruptionLevel: number;
  healPerSecond: number;
  damageBonus: number;
  incomingDamageReduction: number;
}

export class VoidCorruptionRuntime {
  private readonly members: Set<string>;
  private readonly beacons: Set<string>;
  private level = 0;

  constructor(
    readonly swarmId: string,
    memberIds: readonly string[],
    beaconIds: readonly string[],
  ) {
    this.members = new Set(memberIds);
    this.beacons = new Set(beaconIds);
  }

  /** Corruption climbs while Beacons live, in proportion to how many remain; it
   * only decays once every Beacon is gone — containment, not an instant reset. */
  update(dtMs: number): void {
    const dt = dtMs / 1000;
    if (this.beacons.size > 0) {
      this.level = Math.min(
        VOID_CORRUPTION_TUNING.maxCorruption,
        this.level + VOID_CORRUPTION_TUNING.growthPerSecondPerBeacon * this.beacons.size * dt,
      );
    } else {
      this.level = Math.max(0, this.level - VOID_CORRUPTION_TUNING.decayPerSecondWhenContained * dt);
    }
  }

  /** Returns which role fell so the caller can react; a Beacon kill both removes
   * a growth source AND immediately weakens surrounding corruption (a real step). */
  notifyDroneDestroyed(droneId: string): "beacon" | "member" | null {
    const wasBeacon = this.beacons.delete(droneId);
    const wasMember = this.members.delete(droneId);
    if (!wasMember) return null;
    if (wasBeacon) {
      this.level = Math.max(0, this.level - VOID_CORRUPTION_TUNING.beaconDestroyedStep);
      return "beacon";
    }
    return "member";
  }

  isMember(droneId: string): boolean {
    return this.members.has(droneId);
  }

  isBeacon(droneId: string): boolean {
    return this.beacons.has(droneId);
  }

  enrolMember(droneId: string): void {
    this.members.add(droneId);
  }

  get eliminated(): boolean {
    return this.members.size === 0;
  }

  get corruptionLevel(): number {
    return this.level;
  }

  private get corruptionRatio(): number {
    return this.level / VOID_CORRUPTION_TUNING.maxCorruption;
  }

  /** Healing — one of three mechanically live Void Network traits, scaling continuously. */
  get healPerSecond(): number {
    return this.corruptionRatio * VOID_CORRUPTION_TUNING.healPerSecondAtFullCorruption;
  }

  /** Damage Amplification — composes into the same multiplier point as every prior faction's bonus. */
  get damageBonus(): number {
    return this.corruptionRatio * VOID_CORRUPTION_TUNING.damageBonusAtFullCorruption;
  }

  /** Reality Stability — the Swarm's own incoming-damage reduction, corruption-scaled rather than hit-school-scaled. */
  get incomingDamageReduction(): number {
    return this.corruptionRatio * VOID_CORRUPTION_TUNING.incomingDamageReductionAtFullCorruption;
  }

  get snapshot(): CorruptionSnapshot {
    return {
      swarmId: this.swarmId,
      membersRemaining: this.members.size,
      beaconsRemaining: this.beacons.size,
      corruptionLevel: this.level,
      healPerSecond: this.healPerSecond,
      damageBonus: this.damageBonus,
      incomingDamageReduction: this.incomingDamageReduction,
    };
  }
}
