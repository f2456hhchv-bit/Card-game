/**
 * Outlaw Squad runtime (AF-046 §Command Structure / §Combat Style): the one
 * genuinely new mechanical surface of the Human Outlaw framework. A squad
 * is a Captain plus members; while the Captain lives the squad is
 * coordinated (Formation Flying — feeding AF-033's reserved, never-before-
 * used formationAnchor/formationOffset movement context), and destroying
 * the Captain scatters it (Retreat orders through AF-033's existing
 * `retreat` AI state — "destroying leaders weakens formations", literal and
 * mechanical). Pure and bus-free, mirroring every prior *Runtime: the
 * composition root reads its state and drives the existing enemy systems.
 */
import type { CommandOrder } from "./outlawData";

export type SquadState = "forming" | "coordinated" | "scattered" | "eliminated";

export interface SquadSnapshot {
  squadId: string;
  state: SquadState;
  order: CommandOrder;
  captainAlive: boolean;
  membersRemaining: number;
}

export class OutlawSquadRuntime {
  private squadState: SquadState = "forming";
  private formUpRemainingMs: number;
  private scatterRemainingMs = 0;
  private captainDown = false;
  private readonly members: Set<string>;
  private readonly offsets = new Map<string, { x: number; y: number }>();

  constructor(
    readonly squadId: string,
    private readonly captainId: string,
    memberIds: readonly string[],
    formUpMs = 1500,
    private readonly scatterMs = 4000,
  ) {
    this.members = new Set(memberIds);
    this.formUpRemainingMs = formUpMs;
    const offsets = OutlawSquadRuntime.formationOffsets(memberIds.length);
    memberIds.forEach((id, index) => this.offsets.set(id, offsets[index]!));
  }

  /** Wedge formation behind the Captain — pure, deterministic per member count. */
  static formationOffsets(count: number, spacing = 2.2): ReadonlyArray<{ x: number; y: number }> {
    const offsets: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < count; i += 1) {
      const rank = Math.floor(i / 2) + 1;
      const side = i % 2 === 0 ? 1 : -1;
      offsets.push({ x: -rank * spacing, y: side * rank * spacing });
    }
    return offsets;
  }

  update(fixedDtMs: number): void {
    if (this.squadState === "forming") {
      this.formUpRemainingMs = Math.max(0, this.formUpRemainingMs - fixedDtMs);
      if (this.formUpRemainingMs === 0) this.squadState = "coordinated";
    } else if (this.squadState === "scattered" && this.scatterRemainingMs > 0) {
      this.scatterRemainingMs = Math.max(0, this.scatterRemainingMs - fixedDtMs);
    }
  }

  /** Returns which role fell so the caller can react ("captain" breaks the squad). */
  notifyDroneDestroyed(droneId: string): "captain" | "member" | null {
    if (droneId === this.captainId && !this.captainDown) {
      this.captainDown = true;
      this.squadState = this.members.size > 0 ? "scattered" : "eliminated";
      this.scatterRemainingMs = this.scatterMs;
      return "captain";
    }
    if (this.members.delete(droneId)) {
      if (this.captainDown && this.members.size === 0) this.squadState = "eliminated";
      return "member";
    }
    return null;
  }

  isCaptain(droneId: string): boolean {
    return droneId === this.captainId;
  }

  isMember(droneId: string): boolean {
    return droneId === this.captainId || this.members.has(droneId);
  }

  /** The member's assigned Formation Flying slot relative to the Captain. */
  offsetFor(droneId: string): { x: number; y: number } | null {
    return this.offsets.get(droneId) ?? null;
  }

  /** Formation Flying + coordinated fire only hold while the Captain lives. */
  get commandActive(): boolean {
    return this.squadState === "coordinated";
  }

  /** Retreat orders are in effect — members hold retreat regardless of their own hull. */
  get scatterActive(): boolean {
    return this.squadState === "scattered" && this.scatterRemainingMs > 0;
  }

  get state(): SquadState {
    return this.squadState;
  }

  get currentOrder(): CommandOrder {
    if (this.squadState === "forming") return "shieldCoordination";
    if (this.squadState === "coordinated") return "attackOrders";
    return "retreatOrders";
  }

  get snapshot(): SquadSnapshot {
    return {
      squadId: this.squadId,
      state: this.squadState,
      order: this.currentOrder,
      captainAlive: !this.captainDown,
      membersRemaining: this.members.size,
    };
  }
}
