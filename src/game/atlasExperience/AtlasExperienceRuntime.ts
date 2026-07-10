import type { AtmosphericDesignDimension, ExperienceStateSnapshot, FirstTimeMomentKind } from "./atlasExperienceData";

/** Mirrors AF-154's real `PlayerExperienceTracker` shape (latest
 * snapshot + history) but over this module's own `ExperienceStateSnapshot`
 * (see atlasExperienceData.ts module doc comment). */
export class ExperienceStateTracker {
  private latestSnapshot: ExperienceStateSnapshot | null = null;
  private readonly records: ExperienceStateSnapshot[] = [];

  record(snapshot: ExperienceStateSnapshot): void {
    this.latestSnapshot = snapshot;
    this.records.push(snapshot);
  }

  latest(): ExperienceStateSnapshot | null {
    return this.latestSnapshot;
  }

  history(): readonly ExperienceStateSnapshot[] {
    return this.records;
  }
}

interface FirstTimeRecord {
  kind: FirstTimeMomentKind;
  epoch: number;
}

/** "Protect moments that only happen once... never diminish them
 * through repetition." Confirmed genuinely new — nothing in the
 * codebase already guards a first-occurrence moment against being
 * re-triggered with the same special treatment. */
export class FirstTimeMomentTracker {
  private readonly records = new Map<FirstTimeMomentKind, FirstTimeRecord>();

  markOccurred(kind: FirstTimeMomentKind, epoch: number): boolean {
    if (this.records.has(kind)) return false;
    this.records.set(kind, { kind, epoch });
    return true;
  }

  hasOccurred(kind: FirstTimeMomentKind): boolean {
    return this.records.has(kind);
  }

  all(): readonly FirstTimeRecord[] {
    return Array.from(this.records.values());
  }
}

/** "Coordinate lighting, music, weather... atmosphere supports
 * experience." Confirmed genuinely new — nothing in the codebase
 * already coordinates these 7 dimensions together. */
export class AtmosphereCoordinator {
  private readonly levels = new Map<AtmosphericDesignDimension, number>();

  setLevel(dimension: AtmosphericDesignDimension, value: number): void {
    this.levels.set(dimension, value);
  }

  levelFor(dimension: AtmosphericDesignDimension): number {
    return this.levels.get(dimension) ?? 0;
  }
}
