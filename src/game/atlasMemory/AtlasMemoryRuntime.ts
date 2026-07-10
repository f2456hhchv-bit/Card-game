import type { InstitutionalMemoryCategory } from "./atlasMemoryData";

interface DistortedMemoryRecord {
  objectiveDescription: string;
  subjectiveDescription: string;
  epoch: number;
}

/** "People may remember events differently... objective history
 * remains protected, personal memory remains human." Deliberately
 * separate from AF-135's real `EvolvingEntry` (see atlasMemoryData.ts
 * module doc comment): the objective description is stored once and
 * never touched, while `drift` records a SUBJECTIVE current version
 * alongside it — the opposite guarantee from AF-135's append-only
 * "depth, not contradiction". */
export class MemoryDistortionTracker {
  private readonly records = new Map<string, DistortedMemoryRecord>();

  remember(memoryId: string, objectiveDescription: string, epoch: number): void {
    if (!this.records.has(memoryId)) this.records.set(memoryId, { objectiveDescription, subjectiveDescription: objectiveDescription, epoch });
  }

  drift(memoryId: string, subjectiveDescription: string): void {
    const record = this.records.get(memoryId);
    if (record) record.subjectiveDescription = subjectiveDescription;
  }

  objectiveOf(memoryId: string): string | null {
    return this.records.get(memoryId)?.objectiveDescription ?? null;
  }

  subjectiveOf(memoryId: string): string | null {
    return this.records.get(memoryId)?.subjectiveDescription ?? null;
  }
}

/** The genuinely new numeric Player Memory quantities — visit/photo/
 * revisit counts that nothing else in the codebase tracks (the
 * "Favourite X" categories are instead served directly by AF-163's
 * real `MeaningCurator`, see atlasMemoryData.ts module doc comment). */
export class PlayerMemoryTracker {
  private readonly visitCounts = new Map<string, number>();
  private readonly photoCounts = new Map<string, number>();

  visit(planetId: string): void {
    this.visitCounts.set(planetId, (this.visitCounts.get(planetId) ?? 0) + 1);
  }

  visitsFor(planetId: string): number {
    return this.visitCounts.get(planetId) ?? 0;
  }

  photograph(locationId: string): void {
    this.photoCounts.set(locationId, (this.photoCounts.get(locationId) ?? 0) + 1);
  }

  photoCountFor(locationId: string): number {
    return this.photoCounts.get(locationId) ?? 0;
  }

  mostVisitedPlanet(): string | null {
    let best: string | null = null;
    let bestCount = 0;
    for (const [planetId, count] of this.visitCounts) {
      if (count > bestCount) {
        best = planetId;
        bestCount = count;
      }
    }
    return best;
  }
}

interface InstitutionalMemoryRecord {
  category: InstitutionalMemoryCategory;
  description: string;
  epoch: number;
}

/** "Institutions gain identity." Confirmed genuinely new at this
 * granularity (see atlasMemoryData.ts module doc comment). */
export class InstitutionalMemoryTracker {
  private readonly records = new Map<string, InstitutionalMemoryRecord[]>();

  remember(institutionId: string, category: InstitutionalMemoryCategory, description: string, epoch: number): void {
    const history = this.records.get(institutionId) ?? [];
    history.push({ category, description, epoch });
    this.records.set(institutionId, history);
  }

  memoriesFor(institutionId: string): readonly InstitutionalMemoryRecord[] {
    return this.records.get(institutionId) ?? [];
  }
}
