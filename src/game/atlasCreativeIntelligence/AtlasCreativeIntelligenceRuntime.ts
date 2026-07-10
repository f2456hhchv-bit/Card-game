import type { CreativeDomain, CreativeHeritageOutcome } from "./atlasCreativeIntelligenceData";

interface CreativeContributionRecord {
  entityId: string;
  domain: CreativeDomain;
  description: string;
  epoch: number;
}

/** The module's own genuinely new mechanic: one generic append-only
 * log, keyed by entity id and `CreativeDomain`, serving every "X
 * Creativity" section (Commander/Scientific/Engineering/Educational)
 * uniformly rather than four near-identical trackers (see
 * atlasCreativeIntelligenceData.ts module doc comment). Never wired to
 * AF-030's real `PersonalityTrait` — creative expression may reflect
 * personality only as flavour, never a stat. */
export class CreativeContributionLog {
  private readonly records: CreativeContributionRecord[] = [];

  contribute(entityId: string, domain: CreativeDomain, description: string, epoch: number): void {
    this.records.push({ entityId, domain, description, epoch });
  }

  contributionsFor(entityId: string): readonly CreativeContributionRecord[] {
    return this.records.filter((r) => r.entityId === entityId);
  }

  countForDomain(domain: CreativeDomain): number {
    return this.records.filter((r) => r.domain === domain).length;
  }
}

interface CreativeHeritageRecord {
  creationId: string;
  outcomes: readonly CreativeHeritageOutcome[];
  epoch: number;
}

/** The SIXTH mirrored "completed work becomes a named output" archive
 * in this codebase, after AF-157/158/159/160/162's real memory-archive
 * classes (see atlasCreativeIntelligenceData.ts module doc comment). */
export class CreativeHeritageArchive {
  private readonly records: CreativeHeritageRecord[] = [];

  archive(creationId: string, outcomes: readonly CreativeHeritageOutcome[], epoch: number): void {
    this.records.push({ creationId, outcomes, epoch });
  }

  outcomesFor(creationId: string): readonly CreativeHeritageOutcome[] {
    return this.records.find((r) => r.creationId === creationId)?.outcomes ?? [];
  }

  all(): readonly CreativeHeritageRecord[] {
    return this.records;
  }
}
