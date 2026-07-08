/**
 * Live Operations registry (AF-070). Pure and deterministic — the third
 * ledger runtime (AF-068/069 discipline). Every content pack passes a
 * registration gauntlet; a rejected pack changes NOTHING (validation is
 * all-or-nothing, checked before any mutation).
 *
 * The gauntlet enforces the spec:
 * 1. All six QA gates must pass — "regression testing becomes mandatory".
 * 2. No addition may reuse an already-registered id — "never invalidate
 *    previous content"; a colliding id is a replacement attempt.
 * 3. Only `temporaryChallenges` additions may be temporary — temporary
 *    GAMEPLAY content would be FOMO, and the shape rejects it.
 * 4. Duplicate pack ids are rejected — the timeline is append-only history.
 *
 * Ten-year support is structural, not aspirational: versions are unbounded
 * integers, the registry never grows a special case per year, and
 * compatibility is monotone — every save from every older version stays
 * loadable because packs only ever ADD (§Roadmap Support, §QA).
 */
import { QA_GATES, type ContentPackDef, type PackRegistrationResult, type SeasonDef } from "./liveOpsData";

export interface TimelineEntry {
  version: number;
  packId: string;
  packName: string;
  tier: string;
  additionCount: number;
}

export interface LiveOpsSnapshot {
  liveVersion: number;
  packCount: number;
  contentCount: number;
  activeSeason: string | null;
  retiredTemporaryCount: number;
  timelineLength: number;
}

export class LiveOpsRegistry {
  private version = 0;
  private readonly packs = new Map<string, ContentPackDef>();
  private readonly contentIds = new Map<string, string>(); // content id → owning pack id
  private readonly timeline: TimelineEntry[] = [];
  private readonly retiredTemporaryIds = new Set<string>();
  private activeSeasonDef: SeasonDef | null = null;
  private seasonsCompleted = 0;

  /** The registration gauntlet — all-or-nothing; a rejected pack mutates nothing. */
  registerPack(pack: ContentPackDef): PackRegistrationResult {
    const reasons: string[] = [];
    if (this.packs.has(pack.id)) reasons.push(`duplicate pack id "${pack.id}" — the timeline is append-only history`);
    for (const gate of QA_GATES) {
      if (!pack.qa[gate]) reasons.push(`QA gate "${gate}" failed — regression testing is mandatory`);
    }
    const seenInPack = new Set<string>();
    for (const addition of pack.additions) {
      const owner = this.contentIds.get(addition.id);
      if (owner) reasons.push(`addition "${addition.id}" already shipped in pack "${owner}" — never invalidate previous content`);
      if (seenInPack.has(addition.id)) reasons.push(`addition "${addition.id}" duplicated within the pack`);
      seenInPack.add(addition.id);
      if (addition.temporary && addition.kind !== "temporaryChallenges") {
        reasons.push(`addition "${addition.id}" is temporary but not a challenge — temporary gameplay content is FOMO`);
      }
    }
    if (reasons.length > 0) return { ok: false, reasons };

    this.version += 1;
    this.packs.set(pack.id, pack);
    for (const addition of pack.additions) this.contentIds.set(addition.id, pack.id);
    this.timeline.push({
      version: this.version,
      packId: pack.id,
      packName: pack.name,
      tier: pack.tier,
      additionCount: pack.additions.length,
    });
    return { ok: true, version: this.version };
  }

  /** Seasons wrap registered packs; beginning one never gates anything else. */
  beginSeason(season: SeasonDef): boolean {
    if (this.activeSeasonDef) return false;
    for (const packId of season.packIds) {
      if (!this.packs.has(packId)) return false;
    }
    this.activeSeasonDef = season;
    return true;
  }

  /** Ending a season retires ONLY its temporary challenges. Permanent
   * discoveries, cosmetics, lore, and every prior pack remain — core
   * progression never resets, and this class has no operation that could. */
  endSeason(): readonly string[] {
    if (!this.activeSeasonDef) return [];
    const retired: string[] = [];
    for (const packId of this.activeSeasonDef.packIds) {
      const pack = this.packs.get(packId);
      if (!pack) continue;
      for (const addition of pack.additions) {
        if (addition.temporary && addition.kind === "temporaryChallenges") {
          this.retiredTemporaryIds.add(addition.id);
          retired.push(addition.id);
        }
      }
    }
    this.seasonsCompleted += 1;
    this.activeSeasonDef = null;
    return retired;
  }

  get activeSeason(): SeasonDef | null {
    return this.activeSeasonDef;
  }

  isContentLive(contentId: string): boolean {
    return this.contentIds.has(contentId) && !this.retiredTemporaryIds.has(contentId);
  }

  isContentRegistered(contentId: string): boolean {
    return this.contentIds.has(contentId);
  }

  /** Additive packs mean every older save stays loadable — compatibility is monotone. */
  compatibilityFor(saveVersion: number): { compatible: boolean; packsSince: number } {
    return {
      compatible: saveVersion >= 0 && saveVersion <= this.version,
      packsSince: Math.max(0, this.version - saveVersion),
    };
  }

  /** §Accessibility: "players should never feel lost returning after months away" —
   * everything shipped since their save version, in order. */
  returningPlayerRecap(sinceVersion: number): readonly TimelineEntry[] {
    return this.timeline.filter((entry) => entry.version > sinceVersion);
  }

  /** §Accessibility: Season Archive / Content Timeline — the full append-only history. */
  get contentTimeline(): readonly TimelineEntry[] {
    return this.timeline;
  }

  get snapshot(): LiveOpsSnapshot {
    return {
      liveVersion: this.version,
      packCount: this.packs.size,
      contentCount: this.contentIds.size,
      activeSeason: this.activeSeasonDef ? `S${this.activeSeasonDef.number} "${this.activeSeasonDef.name}"` : null,
      retiredTemporaryCount: this.retiredTemporaryIds.size,
      timelineLength: this.timeline.length,
    };
  }
}
