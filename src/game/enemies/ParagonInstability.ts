/**
 * Paragon Instability runtime (AF-053 §Containment System / §Adaptive
 * Technology): the one genuinely new mechanical surface of the Paragon
 * Protocol framework, and the eighth distinct faction doctrine. Every
 * prior doctrine is a smooth curve. This one is a single discrete,
 * IRREVERSIBLE threshold event: Reactor Stability depletes from incoming
 * damage (Adaptive Technology's live input) and its own inherent
 * instability, and the instant it reaches zero, Containment Collapse
 * fires exactly once — permanently inverting the unit's character from
 * defended-but-fragile (Adaptive Shields) to unshielded-but-far-more-
 * dangerous (Energy Overload). No prior faction reverses direction this
 * way. A Containment Sentinel actively repairs Stability while it lives;
 * killing it removes that repair without touching Stability directly,
 * echoing the "kill changes a rate, not a value" shape AF-052 introduced,
 * applied here to a depleting-toward-catastrophe meter instead of an
 * accumulating currency. Pure and bus-free, like every prior *Runtime.
 */
import { PARAGON_INSTABILITY_TUNING } from "./paragonData";

export interface InstabilitySnapshot {
  protocolId: string;
  membersRemaining: number;
  sentinelsRemaining: number;
  stability: number;
  collapsed: boolean;
  incomingDamageReduction: number;
  damageBonus: number;
  speedBonus: number;
}

export class ParagonInstabilityRuntime {
  private readonly members: Set<string>;
  private readonly sentinels: Set<string>;
  private stability: number = PARAGON_INSTABILITY_TUNING.maxStability;
  private collapsed = false;
  private collapseJustTriggered = false;

  constructor(
    readonly protocolId: string,
    memberIds: readonly string[],
    sentinelIds: readonly string[],
  ) {
    this.members = new Set(memberIds);
    this.sentinels = new Set(sentinelIds);
  }

  /** Stability decays on its own and is repaired while any Containment
   * Sentinel lives; once collapsed, it never recovers and never needs to move again. */
  update(dtMs: number): void {
    if (this.collapsed) return;
    const dt = dtMs / 1000;
    const repair = this.sentinels.size * PARAGON_INSTABILITY_TUNING.sentinelRepairPerSecondPerSentinel;
    const delta = (repair - PARAGON_INSTABILITY_TUNING.passiveDecayPerSecond) * dt;
    this.stability = Math.min(PARAGON_INSTABILITY_TUNING.maxStability, Math.max(0, this.stability + delta));
    this.checkCollapse();
  }

  /** Adaptive Technology's live input — every point of incoming damage cracks containment further. */
  recordIncomingDamage(amount: number): void {
    if (this.collapsed) return;
    this.stability = Math.max(0, this.stability - amount * PARAGON_INSTABILITY_TUNING.stabilityLossPerDamage);
    this.checkCollapse();
  }

  private checkCollapse(): void {
    if (!this.collapsed && this.stability <= 0) {
      this.collapsed = true;
      this.collapseJustTriggered = true;
    }
  }

  /** Returns true exactly once, the tick Containment Collapse first fires —
   * the composition root's hook for a one-time Singularity Charge detonation. */
  consumeCollapseEvent(): boolean {
    if (!this.collapseJustTriggered) return false;
    this.collapseJustTriggered = false;
    return true;
  }

  /** Returns which role fell so the caller can react; a Sentinel's death
   * removes future repair without touching Stability's current value at all. */
  notifyDroneDestroyed(droneId: string): "sentinel" | "member" | null {
    const wasSentinel = this.sentinels.delete(droneId);
    const wasMember = this.members.delete(droneId);
    if (!wasMember) return null;
    return wasSentinel ? "sentinel" : "member";
  }

  isMember(droneId: string): boolean {
    return this.members.has(droneId);
  }

  isSentinel(droneId: string): boolean {
    return this.sentinels.has(droneId);
  }

  enrolMember(droneId: string): void {
    this.members.add(droneId);
  }

  get eliminated(): boolean {
    return this.members.size === 0;
  }

  get stabilityLevel(): number {
    return this.stability;
  }

  get isCollapsed(): boolean {
    return this.collapsed;
  }

  /** Adaptive Shields — pre-collapse only, degrading toward zero as Stability falls. */
  get incomingDamageReduction(): number {
    if (this.collapsed) return 0;
    return (this.stability / PARAGON_INSTABILITY_TUNING.maxStability) * PARAGON_INSTABILITY_TUNING.preCollapseShieldReductionAtFullStability;
  }

  /** Energy Overload — post-collapse only, a large permanent damage spike. */
  get damageBonus(): number {
    return this.collapsed ? PARAGON_INSTABILITY_TUNING.postCollapseDamageBonus : 0;
  }

  /** Unstable Reactors — post-collapse only, alongside the damage spike. */
  get speedBonus(): number {
    return this.collapsed ? PARAGON_INSTABILITY_TUNING.postCollapseSpeedBonus : 0;
  }

  get snapshot(): InstabilitySnapshot {
    return {
      protocolId: this.protocolId,
      membersRemaining: this.members.size,
      sentinelsRemaining: this.sentinels.size,
      stability: this.stability,
      collapsed: this.collapsed,
      incomingDamageReduction: this.incomingDamageReduction,
      damageBonus: this.damageBonus,
      speedBonus: this.speedBonus,
    };
  }
}
