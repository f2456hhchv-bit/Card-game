/**
 * Roster runtime (AF-072). Pure and deterministic — recruitment and usage
 * over the launch roster, in the AF-068→071 ledger discipline:
 * - Recruitment is append-only: commanders join and never leave (no
 *   removal operation exists). The starting trio is recruited from
 *   construction; everyone else gates on their registered source.
 * - Usage statistics (§Commander Statistics) accumulate per commander —
 *   uses and victories, the inputs "statistics inform future balancing"
 *   needs — with win rate derived, never stored.
 * - "Every Commander remains viable forever" is a property of the data
 *   this runtime never touches: it records how commanders are USED and
 *   has no operation that could buff, nerf, retire, or gate one.
 */
import type { RecruitmentDef, RecruitmentSource } from "./rosterData";

export interface CommanderUsageStats {
  commanderId: string;
  uses: number;
  victories: number;
  winRate: number;
}

export interface RosterSnapshot {
  rosterSize: number;
  recruitedCount: number;
  totalUses: number;
  mostUsedCommanderId: string | null;
}

export class RosterRuntime {
  private readonly recruited = new Set<string>();
  private readonly uses = new Map<string, number>();
  private readonly victories = new Map<string, number>();
  private readonly recruitmentByCommander = new Map<string, RecruitmentDef>();

  constructor(recruitmentTable: readonly RecruitmentDef[], startingIds: readonly string[]) {
    for (const entry of recruitmentTable) this.recruitmentByCommander.set(entry.commanderId, entry);
    for (const id of startingIds) {
      if (!this.recruitmentByCommander.has(id)) throw new Error(`starting commander ${id} missing from recruitment table`);
      this.recruited.add(id);
    }
  }

  /** Recruit when the commander's registered source has been reached. Append-only. */
  tryRecruit(commanderId: string, unlockedSources: ReadonlySet<RecruitmentSource>): boolean {
    if (this.recruited.has(commanderId)) return false;
    const entry = this.recruitmentByCommander.get(commanderId);
    if (!entry || !unlockedSources.has(entry.source)) return false;
    this.recruited.add(commanderId);
    return true;
  }

  isRecruited(commanderId: string): boolean {
    return this.recruited.has(commanderId);
  }

  get recruitedIds(): readonly string[] {
    return [...this.recruited];
  }

  /** §Commander Statistics: usage and outcomes accumulate; win rate is derived, never stored. */
  recordUse(commanderId: string, victory: boolean): void {
    if (!this.recruited.has(commanderId)) return;
    this.uses.set(commanderId, (this.uses.get(commanderId) ?? 0) + 1);
    if (victory) this.victories.set(commanderId, (this.victories.get(commanderId) ?? 0) + 1);
  }

  statsFor(commanderId: string): CommanderUsageStats {
    const uses = this.uses.get(commanderId) ?? 0;
    const victories = this.victories.get(commanderId) ?? 0;
    return { commanderId, uses, victories, winRate: uses === 0 ? 0 : victories / uses };
  }

  get snapshot(): RosterSnapshot {
    let totalUses = 0;
    let mostUsed: string | null = null;
    let mostUses = 0;
    for (const [id, count] of this.uses) {
      totalUses += count;
      if (count > mostUses) {
        mostUses = count;
        mostUsed = id;
      }
    }
    return {
      rosterSize: this.recruitmentByCommander.size,
      recruitedCount: this.recruited.size,
      totalUses,
      mostUsedCommanderId: mostUsed,
    };
  }
}
