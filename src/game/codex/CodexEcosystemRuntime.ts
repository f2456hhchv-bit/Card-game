/**
 * Codex Ecosystem runtimes (AF-088). Three small, pure, in-memory
 * runtimes and a set of pure query functions, all built by EXTENDING
 * AF-087's runtimes through composition — never modifying them.
 *
 * `CodexArchiveRuntime` wraps an AF-087 `CodexDiscoveryRuntime` instance
 * and layers the two tiers AF-087 doesn't have (Detected before
 * Observed, Archived after Mastered) around it. `ScientificArchiveRuntime`
 * and `ExpeditionJournalRuntime` are permanent, append-only logs — the
 * seventh and eighth appearances of the pattern first shipped in AF-084.
 * `PlayerNotebookExtensionRuntime` completes AF-087's Player Notebook
 * coverage with the three surfaces the locked journal doesn't carry.
 */
import type { CodexCategory, CodexEntryDef, TimelineEra } from "./codexData";
import type { CodexUnlockReader } from "./CodexRuntime";
import { CodexRuntime } from "./CodexRuntime";
import type { CodexEntryProfileDef, DiscoveryProgressionStage } from "./codexFrameworkData";
import { profileFor } from "./codexFrameworkData";
import type { CodexDiscoveryRuntime, CodexJournalRuntime } from "./CodexProgressionRuntime";
import type { ArchiveRecordKindDef, ExtendedDiscoveryTier, KnowledgeWebNode, TimelineArchiveItem } from "./codexEcosystemData";
import { KNOWLEDGE_WEB_NODES, KNOWLEDGE_WEB_REALISATION, TIMELINE_ARCHIVE_ITEMS, TIMELINE_ARCHIVE_REALISATION } from "./codexEcosystemData";

/** §Discovery Tiers: the 8-tier ladder over AF-087's unchanged 6-stage
 * lattice. Composition, not modification — the wrapped runtime remains
 * the sole authority for its own six stages. */
export class CodexArchiveRuntime {
  private readonly detected = new Set<string>();
  private readonly archived = new Set<string>();

  constructor(private readonly discovery: CodexDiscoveryRuntime) {}

  recordDetected(entryId: string): boolean {
    if (this.detected.has(entryId)) return false;
    this.detected.add(entryId);
    return true;
  }

  /** Archiving is a permanent parallel mark — only possible once AF-087's
   * own lattice has reached "mastered" (archived ⊆ mastered, always). */
  recordArchived(entryId: string): boolean {
    if (this.discovery.stageOf(entryId) !== "mastered") return false;
    if (this.archived.has(entryId)) return false;
    this.archived.add(entryId);
    return true;
  }

  tierOf(entryId: string): ExtendedDiscoveryTier {
    if (this.archived.has(entryId)) return "archived";
    const stage = this.discovery.stageOf(entryId);
    if (stage === "mastered") return "mastered";
    if (stage === "understood") return "understood";
    if (stage === "studied") return "analysed";
    if (stage === "scanned") return "scanned";
    if (stage === "observed") return "observed";
    if (this.detected.has(entryId)) return "detected";
    return "unknown";
  }

  get archivedCount(): number {
    return this.archived.size;
  }

  get detectedCount(): number {
    return this.detected.size;
  }
}

export interface AppendOnlyRecord {
  sequence: number;
  kind: string;
  entryId: string | null;
  description: string;
}

/** A minimal, reusable append-only ledger shape — each named runtime below
 * gets its own class (matching every prior module's precedent of a
 * dedicated class per named system), but shares this same discipline:
 * sequence-monotone, no removal API. */
class AppendOnlyLedger<TKind extends string> {
  private readonly records: AppendOnlyRecord[] = [];

  record(kind: TKind, entryId: string | null, description: string): AppendOnlyRecord {
    const entry: AppendOnlyRecord = { sequence: this.records.length + 1, kind, entryId, description };
    this.records.push(entry);
    return entry;
  }

  get timeline(): readonly AppendOnlyRecord[] {
    return this.records;
  }

  get length(): number {
    return this.records.length;
  }
}

/** §Scientific Archive — permanent, append-only. */
export class ScientificArchiveRuntime extends AppendOnlyLedger<string> {}

/** §Expedition Journal — permanent, append-only, AUTOMATICALLY fed by
 * real gameplay seams (never player-curated — that is the Notebook's
 * job below). */
export class ExpeditionJournalRuntime extends AppendOnlyLedger<string> {}

/** §Player Notebook — the three surfaces AF-087's CodexJournalRuntime
 * doesn't carry. Comparison notes key on an order-independent pair;
 * research goals and expedition plans are simple curated lists. */
export class PlayerNotebookExtensionRuntime {
  private readonly comparisonNotes = new Map<string, string>();
  private readonly researchGoals = new Set<string>();
  private readonly expeditionPlans: string[] = [];

  private static pairKey(a: string, b: string): string {
    return a < b ? `${a}|${b}` : `${b}|${a}`;
  }

  setComparisonNote(entryIdA: string, entryIdB: string, text: string): void {
    const key = PlayerNotebookExtensionRuntime.pairKey(entryIdA, entryIdB);
    if (text.length === 0) this.comparisonNotes.delete(key);
    else this.comparisonNotes.set(key, text);
  }

  comparisonNoteFor(entryIdA: string, entryIdB: string): string | null {
    return this.comparisonNotes.get(PlayerNotebookExtensionRuntime.pairKey(entryIdA, entryIdB)) ?? null;
  }

  toggleResearchGoal(entryId: string): boolean {
    if (this.researchGoals.has(entryId)) {
      this.researchGoals.delete(entryId);
      return false;
    }
    this.researchGoals.add(entryId);
    return true;
  }

  get researchGoalIds(): readonly string[] {
    return [...this.researchGoals];
  }

  addExpeditionPlan(text: string): void {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    this.expeditionPlans.push(trimmed);
  }

  get expeditionPlanList(): readonly string[] {
    return this.expeditionPlans;
  }
}

/** §Knowledge Web: every entry's related entries, grouped by which of the
 * seventeen web nodes their category realises onto. One flat mechanism
 * (AF-043's relatedEntryIds), seventeen readings. */
export function knowledgeWebFor(entry: CodexEntryDef, codexRuntime: CodexRuntime): Readonly<Record<KnowledgeWebNode, readonly CodexEntryDef[]>> {
  const related = codexRuntime.relatedEntries(entry);
  const web: Record<KnowledgeWebNode, CodexEntryDef[]> = {} as Record<KnowledgeWebNode, CodexEntryDef[]>;
  for (const node of KNOWLEDGE_WEB_NODES) web[node] = [];
  for (const target of related) {
    for (const node of KNOWLEDGE_WEB_NODES) {
      const realisation = KNOWLEDGE_WEB_REALISATION[node];
      const matches = realisation.kind === "codexCategory" && target.category === realisation.category;
      if (matches) web[node]!.push(target);
    }
  }
  return web;
}

/** §Timeline Archive: AF-043's static canon timeline, interleaved with
 * the player's own Discovery History from AF-087's journal — "history
 * becomes explorable" as one merged, sorted sequence. */
export interface InteractiveTimelineEntry {
  kind: "canon" | "playerDiscovery";
  sequence: number;
  label: string;
}

export function interactiveTimelineFor(codexRuntime: CodexRuntime, reader: CodexUnlockReader, journal: CodexJournalRuntime): readonly InteractiveTimelineEntry[] {
  const canon: InteractiveTimelineEntry[] = codexRuntime.timeline(reader).map((entry, index) => ({
    kind: "canon",
    sequence: index,
    label: entry.title,
  }));
  const player: InteractiveTimelineEntry[] = journal.discoveryHistoryTimeline.map((record) => ({
    kind: "playerDiscovery",
    sequence: canon.length + record.sequence,
    label: `${record.entryId} → ${record.stage}`,
  }));
  return [...canon, ...player];
}

/** §Timeline Archive totality — every item resolves to a real era or the
 * one honestly dynamic binding; used by tests and the debug overlay. */
export function timelineArchiveCoverage(): Readonly<Record<TimelineArchiveItem, TimelineEra | null>> {
  const coverage: Record<TimelineArchiveItem, TimelineEra | null> = {} as Record<TimelineArchiveItem, TimelineEra | null>;
  for (const item of TIMELINE_ARCHIVE_ITEMS) {
    const realisation = TIMELINE_ARCHIVE_REALISATION[item];
    coverage[item] = realisation.kind === "era" ? realisation.era : null;
  }
  return coverage;
}

/** §Galactic Museum: one derivation function per exhibit that IS live
 * today — ships and weapons galleries, ancient relics, commander
 * memorabilia — assembled from rosters that already exist. Registered
 * future kinds (3D models, fossils) are not called here. */
export interface MuseumWing {
  kind: "shipGalleries" | "weaponGalleries" | "recoveredArtefacts" | "commanderMemorabilia";
  exhibitCount: number;
  items: readonly string[];
}

export function museumWingFor(kind: MuseumWing["kind"], rosterIds: readonly string[]): MuseumWing {
  return { kind, exhibitCount: rosterIds.length, items: rosterIds };
}

/** §Search System: eight real pure query functions over the codex + AF-087
 * profiles + AF-088's own runtimes — not just registered names. */
export function searchByCategory(entries: readonly CodexEntryDef[], category: CodexCategory): readonly CodexEntryDef[] {
  return entries.filter((e) => e.category === category);
}

/** Era-scoped filtering awaits a per-entry era field on `CodexEntryDef`
 * (AF-043 tracks `timelinePosition`, not an era) — today this is
 * category-scoped to the real "timeline" shelf, honestly not yet split
 * by era; the `era` parameter is accepted for the search system's shape
 * and future extension. */
export function searchByTimelineEra(reader: CodexUnlockReader, codexRuntime: CodexRuntime, _era: TimelineEra): readonly CodexEntryDef[] {
  return codexRuntime.timeline(reader);
}

export function searchByFaction(entries: readonly CodexEntryDef[]): readonly CodexEntryDef[] {
  return entries.filter((e) => e.category === "factions");
}

export function searchByDiscoveryStatus(entries: readonly CodexEntryDef[], archive: CodexArchiveRuntime, tier: ExtendedDiscoveryTier): readonly CodexEntryDef[] {
  return entries.filter((e) => archive.tierOf(e.id) === tier);
}

export function searchByBiome(entries: readonly CodexEntryDef[]): readonly CodexEntryDef[] {
  return entries.filter((e) => e.category === "biomes");
}

export function recentDiscoveries(journal: CodexJournalRuntime, count: number): readonly string[] {
  return journal.discoveryHistoryTimeline.slice(-count).map((r) => r.entryId);
}

export function unreadEntries(reader: CodexUnlockReader, codexRuntime: CodexRuntime, archive: CodexArchiveRuntime): readonly CodexEntryDef[] {
  return codexRuntime.unlockedEntries(reader).filter((e) => {
    const tier = archive.tierOf(e.id);
    return tier === "unknown" || tier === "detected";
  });
}

/** §Collection Tracking: twelve percentages, most reading AF-043's own
 * discoveryPercent scoped per category, plus museum/timeline/overall. */
export interface CollectionCompletionSnapshot {
  species: number;
  civilisations: number;
  ships: number;
  weapons: number;
  relics: number;
  equipment: number;
  research: number;
  bosses: number;
  biomes: number;
  timeline: number;
  museum: number;
  overallGalaxyCompletion: number;
}

function categoryPercent(entries: readonly CodexEntryDef[], reader: CodexUnlockReader, codexRuntime: CodexRuntime, category: CodexCategory): number {
  const inCategory = entries.filter((e) => e.category === category);
  if (inCategory.length === 0) return 0;
  const unlocked = inCategory.filter((e) => codexRuntime.isUnlocked(e, reader)).length;
  return (unlocked / inCategory.length) * 100;
}

export function collectionCompletionFor(codexRuntime: CodexRuntime, reader: CodexUnlockReader, museumExhibitTotal: number, museumExhibitLive: number): CollectionCompletionSnapshot {
  const entries = codexRuntime.all;
  const timelinePercent = entries.filter((e) => e.category === "timeline").length > 0 ? (codexRuntime.timeline(reader).length / entries.filter((e) => e.category === "timeline").length) * 100 : 0;
  const museumPercent = museumExhibitTotal > 0 ? (museumExhibitLive / museumExhibitTotal) * 100 : 0;
  const snapshot: CollectionCompletionSnapshot = {
    species: categoryPercent(entries, reader, codexRuntime, "eliteVariants"),
    civilisations: categoryPercent(entries, reader, codexRuntime, "factions"),
    ships: categoryPercent(entries, reader, codexRuntime, "ships"),
    weapons: categoryPercent(entries, reader, codexRuntime, "weapons"),
    relics: categoryPercent(entries, reader, codexRuntime, "relics"),
    equipment: categoryPercent(entries, reader, codexRuntime, "equipment"),
    research: categoryPercent(entries, reader, codexRuntime, "research"),
    bosses: categoryPercent(entries, reader, codexRuntime, "bosses"),
    biomes: categoryPercent(entries, reader, codexRuntime, "biomes"),
    timeline: timelinePercent,
    museum: museumPercent,
    overallGalaxyCompletion: codexRuntime.discoveryPercent(reader),
  };
  return snapshot;
}

/** Re-exported for callers that only import the ecosystem runtime module. */
export type { CodexEntryProfileDef, DiscoveryProgressionStage, ArchiveRecordKindDef };
export { profileFor };
