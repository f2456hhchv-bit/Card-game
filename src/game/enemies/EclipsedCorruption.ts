/**
 * Eclipsed Corruption runtime (AF-055 §Corruption Levels / §Memory System /
 * §Special Mechanics: Ability Mimicry): the one genuinely new mechanical
 * surface of the Eclipsed framework, and the tenth distinct faction
 * doctrine — a mirror, not a force. It is new in two independent ways.
 * First, corruption is a PERSONAL timeline: every member walks its own
 * five-stage fall (Recently Lost → Irrecoverable), staggered at spawn,
 * slowed while the Memory Warden lives, and jumped forward by grief every
 * time an ally dies — per-entity like AF-054's graph, but driven by each
 * member's own history rather than its position in a pattern, and it never
 * walks backward. Second, Ability Mimicry is the first mechanic whose
 * strength reads what the player has BECOME: the composition root feeds in
 * the player's progression level and the mirror scales with it, hard-capped
 * for fairness (AF-050 read only where the player *is*; this reads what
 * they *are*). Memory Echoes reuse AF-053's one-shot consume-event shape as
 * a cadence-gated, lifetime-capped, deterministic text feed — never an
 * interruption. Pure and bus-free, like every prior *Runtime.
 */
import { ECLIPSED_CORRUPTION_STAGES, ECLIPSED_CORRUPTION_TUNING, ECLIPSED_ECHO_LINES, type EclipsedCorruptionStage } from "./eclipsedData";

export interface EclipsedMemberSnapshot {
  droneId: string;
  stage: EclipsedCorruptionStage;
}

export interface EclipsedSnapshot {
  eclipsedId: string;
  membersRemaining: number;
  wardenAlive: boolean;
  mimicryDamageBonus: number;
  echoesEmitted: number;
  members: readonly EclipsedMemberSnapshot[];
}

export class EclipsedCorruptionRuntime {
  private readonly clocks = new Map<string, number>();
  private readonly alive: Set<string>;
  private wardenDown = false;
  private playerLevel = 0;
  private echoClockMs = 0;
  private echoCount = 0;

  constructor(
    readonly eclipsedId: string,
    memberIds: readonly string[],
    private readonly championId: string,
    private readonly wardenId: string | null,
  ) {
    this.alive = new Set(memberIds);
    // No two Eclipsed begin at the same point in their fall (§Corruption Levels).
    memberIds.forEach((id, index) => this.clocks.set(id, index * ECLIPSED_CORRUPTION_TUNING.memberStaggerMs));
    if (wardenId === null) this.wardenDown = true;
  }

  /** Every survivor's own fall advances — at half rate while the Warden
   * still reads them the manifest. The echo cadence ticks alongside. */
  update(dtMs: number): void {
    const rate = this.wardenDown ? 1 : ECLIPSED_CORRUPTION_TUNING.wardenSlowFactor;
    for (const id of this.alive) {
      this.clocks.set(id, (this.clocks.get(id) ?? 0) + dtMs * rate);
    }
    this.echoClockMs += dtMs;
  }

  /** Ability Mimicry's input — the composition root reports what the player has become. */
  recordPlayerLevel(level: number): void {
    this.playerLevel = Math.max(this.playerLevel, level);
  }

  /** Returns which role fell so the caller can react. Grief is mechanical:
   * every survivor's own clock jumps forward on any ally's death. */
  notifyDroneDestroyed(droneId: string): "champion" | "warden" | "member" | null {
    if (!this.alive.delete(droneId)) return null;
    for (const id of this.alive) {
      this.clocks.set(id, (this.clocks.get(id) ?? 0) + ECLIPSED_CORRUPTION_TUNING.griefJumpMs);
    }
    if (droneId === this.wardenId) {
      this.wardenDown = true;
      return "warden";
    }
    if (droneId === this.championId) return "champion";
    return "member";
  }

  isMember(droneId: string): boolean {
    return this.clocks.has(droneId);
  }

  get eliminated(): boolean {
    return this.alive.size === 0;
  }

  get wardenAlive(): boolean {
    return !this.wardenDown;
  }

  /** The member's own stage index (0..4) — personal, monotonic, capped at Irrecoverable. */
  stageIndexFor(droneId: string): number {
    if (!this.alive.has(droneId)) return 0;
    const clock = this.clocks.get(droneId) ?? 0;
    return Math.min(ECLIPSED_CORRUPTION_STAGES.length - 1, Math.floor(clock / ECLIPSED_CORRUPTION_TUNING.stageDurationMs));
  }

  stageFor(droneId: string): EclipsedCorruptionStage {
    return ECLIPSED_CORRUPTION_STAGES[this.stageIndexFor(droneId)]!;
  }

  /** Ability Mimicry — the mirror's share, from the player's own progression, hard-capped. */
  get mimicryDamageBonus(): number {
    return Math.min(
      ECLIPSED_CORRUPTION_TUNING.maxMimicryDamageBonus,
      this.playerLevel * ECLIPSED_CORRUPTION_TUNING.mimicryDamagePerPlayerLevel,
    );
  }

  /** Per-member damage bonus: its own fall plus the group's mirror of the player. */
  damageBonusFor(droneId: string): number {
    if (!this.alive.has(droneId)) return 0;
    return this.stageIndexFor(droneId) * ECLIPSED_CORRUPTION_TUNING.damageBonusPerStage + this.mimicryDamageBonus;
  }

  /** Per-member speed bonus — desperation moves faster the further gone it is. */
  speedBonusFor(droneId: string): number {
    if (!this.alive.has(droneId)) return 0;
    return this.stageIndexFor(droneId) * ECLIPSED_CORRUPTION_TUNING.speedBonusPerStage;
  }

  /** Memory Echoes — returns the next line exactly once per cadence, lifetime-capped,
   * cycling deterministically (AF-053's consume-event shape, as world-building). */
  consumeEchoEvent(): string | null {
    if (this.echoCount >= ECLIPSED_CORRUPTION_TUNING.maxEchoesPerEncounter) return null;
    if (this.echoClockMs < ECLIPSED_CORRUPTION_TUNING.echoIntervalMs) return null;
    if (this.alive.size === 0) return null;
    this.echoClockMs = 0;
    const line = ECLIPSED_ECHO_LINES[this.echoCount % ECLIPSED_ECHO_LINES.length]!;
    this.echoCount += 1;
    return line;
  }

  get echoesEmitted(): number {
    return this.echoCount;
  }

  get snapshot(): EclipsedSnapshot {
    const members: EclipsedMemberSnapshot[] = [];
    for (const droneId of this.alive) members.push({ droneId, stage: this.stageFor(droneId) });
    return {
      eclipsedId: this.eclipsedId,
      membersRemaining: this.alive.size,
      wardenAlive: this.wardenAlive,
      mimicryDamageBonus: this.mimicryDamageBonus,
      echoesEmitted: this.echoCount,
      members,
    };
  }
}
