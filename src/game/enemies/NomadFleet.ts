/**
 * Nomad Fleet runtime (AF-052 §Fleet Coordination / §Special Mechanics):
 * the one genuinely new mechanical surface of the Stellar Nomad framework,
 * and the seventh distinct faction doctrine. Every prior faction computes
 * a passive bonus from a single state (a timer, a flag set, a living
 * count, a decaying level, an escalating stage, a monotonic ratchet). The
 * Nomads instead earn an actively-SPENT resource — Scrap — and gate three
 * discrete tactical actions on both affordability and cooldown: Deployable
 * Turrets, Scrap Shields, Emergency Repairs. Destroying the Command Ship
 * doesn't touch any existing value — it throttles the fleet's future
 * income rate ("disrupts fleet cohesion"), a fresh mechanical shape none
 * of AF-046 → AF-051 used. Escort Protection is a second, fully
 * independent input: a pure headcount of living Escort Fighters, never
 * derived from Scrap. Pure and bus-free, like every prior *Runtime.
 */
import { NOMAD_FLEET_TUNING } from "./nomadData";

export interface FleetSnapshot {
  fleetId: string;
  membersRemaining: number;
  escortsRemaining: number;
  commandShipAlive: boolean;
  scrap: number;
  targetPriorityBonus: number;
  escortDamageReduction: number;
}

export class NomadFleetRuntime {
  private readonly members: Set<string>;
  private readonly escorts: Set<string>;
  private commandDown = false;
  private scrap = 0;
  private turretClockMs: number = NOMAD_FLEET_TUNING.turretCooldownMs;
  private shieldClockMs: number = NOMAD_FLEET_TUNING.shieldCooldownMs;
  private repairClockMs: number = NOMAD_FLEET_TUNING.repairCooldownMs;

  constructor(
    readonly fleetId: string,
    memberIds: readonly string[],
    private readonly commandShipId: string,
    escortIds: readonly string[],
  ) {
    this.members = new Set(memberIds);
    this.escorts = new Set(escortIds);
  }

  /** Scrap climbs from Salvage Recovery; the Command Ship's death throttles
   * (not zeroes) future income — "disrupts", not erases, fleet cohesion.
   * Action cooldowns tick down independently of affordability. */
  update(dtMs: number): void {
    const dt = dtMs / 1000;
    const rate = NOMAD_FLEET_TUNING.scrapPerSecond * (this.commandDown ? NOMAD_FLEET_TUNING.disruptedIncomeFactor : 1);
    this.scrap = Math.min(NOMAD_FLEET_TUNING.maxScrap, this.scrap + rate * dt);
    this.turretClockMs += dtMs;
    this.shieldClockMs += dtMs;
    this.repairClockMs += dtMs;
  }

  /** Returns which role fell so the caller can react. The Command Ship
   * throttles income; an Escort Fighter's death still counts as a member
   * loss but is reported distinctly so the composition root can react. */
  notifyDroneDestroyed(droneId: string): "commandShip" | "escort" | "member" | null {
    if (!this.members.delete(droneId)) return null;
    if (droneId === this.commandShipId && !this.commandDown) {
      this.commandDown = true;
      return "commandShip";
    }
    if (this.escorts.delete(droneId)) return "escort";
    return "member";
  }

  isMember(droneId: string): boolean {
    return this.members.has(droneId);
  }

  isCommandShip(droneId: string): boolean {
    return droneId === this.commandShipId;
  }

  enrolMember(droneId: string): void {
    this.members.add(droneId);
  }

  get eliminated(): boolean {
    return this.members.size === 0;
  }

  get scrapLevel(): number {
    return this.scrap;
  }

  get commandShipAlive(): boolean {
    return !this.commandDown;
  }

  /** Target Priority — continuous, scales with how well-resourced the fleet currently is (Scrap-derived). */
  get targetPriorityBonus(): number {
    return (this.scrap / NOMAD_FLEET_TUNING.maxScrap) * NOMAD_FLEET_TUNING.targetPriorityBonusAtFullScrap;
  }

  /** Escort Protection — continuous, scales purely with living Escort Fighter headcount, never with Scrap. */
  get escortDamageReduction(): number {
    return Math.min(
      NOMAD_FLEET_TUNING.maxEscortDamageReduction,
      this.escorts.size * NOMAD_FLEET_TUNING.escortDamageReductionPerEscort,
    );
  }

  /** Deployable Turrets — gated on both affordability and cooldown, the doctrine's defining shape. */
  tryDeployTurret(): boolean {
    if (this.scrap < NOMAD_FLEET_TUNING.turretCost || this.turretClockMs < NOMAD_FLEET_TUNING.turretCooldownMs) return false;
    this.scrap -= NOMAD_FLEET_TUNING.turretCost;
    this.turretClockMs = 0;
    return true;
  }

  /** Scrap Shields — spends Scrap for an instant shield-capacity burst applied by the composition root. */
  tryRaiseScrapShield(): boolean {
    if (this.scrap < NOMAD_FLEET_TUNING.shieldCost || this.shieldClockMs < NOMAD_FLEET_TUNING.shieldCooldownMs) return false;
    this.scrap -= NOMAD_FLEET_TUNING.shieldCost;
    this.shieldClockMs = 0;
    return true;
  }

  /** Emergency Repairs — spends Scrap for an instant heal burst applied by the composition root. */
  tryEmergencyRepair(): boolean {
    if (this.scrap < NOMAD_FLEET_TUNING.repairCost || this.repairClockMs < NOMAD_FLEET_TUNING.repairCooldownMs) return false;
    this.scrap -= NOMAD_FLEET_TUNING.repairCost;
    this.repairClockMs = 0;
    return true;
  }

  get snapshot(): FleetSnapshot {
    return {
      fleetId: this.fleetId,
      membersRemaining: this.members.size,
      escortsRemaining: this.escorts.size,
      commandShipAlive: this.commandShipAlive,
      scrap: this.scrap,
      targetPriorityBonus: this.targetPriorityBonus,
      escortDamageReduction: this.escortDamageReduction,
    };
  }
}
