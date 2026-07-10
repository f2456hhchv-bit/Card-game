import type { LongTermMissionTracker } from "../atlasPurpose/AtlasPurposeRuntime";
import type { MysteryLog } from "../atlasPossibility/AtlasPossibilityRuntime";
import type { MysteryKind } from "../atlasPossibility/atlasPossibilityData";

/** "The Horizon Principle": every completed objective reveals a new
 * horizon. The one genuinely new piece of this capstone module — a
 * thin function chaining a real `LongTermMissionTracker` completion
 * (AF-162) to a real `MysteryLog.open` call (AF-159), rather than
 * building a third tracking system. Opens the next horizon exactly
 * once per completed mission id. */
export function ensureNextHorizonOpen(missions: LongTermMissionTracker, completedMissionId: string, mysteries: MysteryLog, nextMysteryId: string, nextMysteryKind: MysteryKind, nextMysteryDescription: string, epoch: number): boolean {
  if (!missions.isComplete(completedMissionId)) return false;
  if (mysteries.all().some((m) => m.id === nextMysteryId)) return false;
  mysteries.open(nextMysteryId, nextMysteryKind, nextMysteryDescription, epoch);
  return true;
}

interface NextGenerationRecord {
  description: string;
  epoch: number;
}

/** "The Never-Ending Story": a child opening a book, a new Commander
 * stepping aboard. Scoped specifically to moments that mark a new
 * generation beginning — distinct from AF-168's real
 * `MomentsOfHumanityLog`, which witnesses any small human moment. */
export class NextGenerationLog {
  private readonly records: NextGenerationRecord[] = [];

  witness(description: string, epoch: number): void {
    this.records.push({ description, epoch });
  }

  all(): readonly NextGenerationRecord[] {
    return this.records;
  }
}
