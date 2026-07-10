/**
 * The Chronicle of Humanity (AF-135). The definitive historical
 * record — built to compose with, and never duplicate, the real
 * pieces AF-130/AF-133/AF-134 already established this session:
 *
 * - "Timeline" (date/location/participants/outcome/significance/
 *   museum ref/news archive/photos/voice) is exactly AF-133's
 *   `OfficialHistoricalRecord`/`GalacticHistoryLog` shape — reused
 *   directly, no new Timeline type.
 * - "Player Biography" builds on AF-133's real `PlayerChronicle` and
 *   `LegacyProgressTracker` rather than re-tracking favourite planets/
 *   ships/victories from scratch.
 * - "Commander Histories" compose AF-130's real `EmotionalMemoryLog`
 *   (Commander Memories) with AF-133's `GiftLedger` (donations) and
 *   AF-130's `BondNetworkRuntime` (relationships) — no new per-
 *   commander storage.
 * - "Oral History," "Book Publishing," and "Player Writable Entries"
 *   all reuse AF-134's generic `MuseumCollectionRegistry<K>` class
 *   with their own new K types, rather than three more near-duplicate
 *   registries.
 * - "Anniversary Publications" reuses AF-133's real `ANNIVERSARY_KINDS`
 *   /`isAnniversary` directly.
 * - "Generational History" composes AF-133's real
 *   `exportLegacySnapshot`/`inheritedFlavourLines`.
 *
 * What genuinely does not exist anywhere yet is the "Dynamic Writing"
 * mechanic itself — entries that expand over time without ever
 * overwriting older versions — which is also exactly what "Academic
 * Debates" needs (a debate is simply a new, differently-voiced version
 * added to an existing entry). `EvolvingEntry` below is the one truly
 * new primitive this module adds.
 */

export const CHRONICLE_STRUCTURE_SECTIONS = [
  "The Age of Earth",
  "The Collapse",
  "The First Expedition",
  "The Atlas Initiative",
  "Commander Histories",
  "Planetary Records",
  "Species Database",
  "Technology Archive",
  "Scientific Discoveries",
  "Engineering Projects",
  "Wars and Peace",
  "Diplomatic Records",
  "Companion Archive",
  "Expedition Records",
  "Player Legacy",
  "Future Civilisation",
] as const;
export type ChronicleStructureSection = (typeof CHRONICLE_STRUCTURE_SECTIONS)[number];

export const AUTHOR_VOICES = [
  "Scientists",
  "Military historians",
  "Children",
  "Explorers",
  "Engineers",
  "Commanders",
  "Citizens",
] as const;
export type AuthorVoice = (typeof AUTHOR_VOICES)[number];

export const PERSPECTIVE_KINDS = [
  "Military",
  "Scientific",
  "Civilian",
  "Political",
  "Commander recollections",
  "Museum interpretation",
] as const;
export type PerspectiveKind = (typeof PERSPECTIVE_KINDS)[number];

export const ORAL_HISTORY_TOPICS = [
  "Early life",
  "First expedition",
  "Failures",
  "Funny stories",
  "Personal fears",
  "Future hopes",
  "Player influence",
  "Friendships",
] as const;
export type OralHistoryTopic = (typeof ORAL_HISTORY_TOPICS)[number];

export const PUBLISHER_VOICES = [
  "Scientists",
  "Engineers",
  "Explorers",
  "Children",
  "Historians",
] as const;
export type PublisherVoice = (typeof PUBLISHER_VOICES)[number];

export const LIVING_MAP_OVERLAY_KINDS = [
  "Old borders",
  "Former colonies",
  "Ancient expeditions",
  "Historic battles",
  "Species migration",
  "Scientific discoveries",
  "Civilisation growth",
] as const;
export type LivingMapOverlayKind = (typeof LIVING_MAP_OVERLAY_KINDS)[number];

export const GENERATIONAL_REFERENCE_KINDS = [
  "Parents",
  "Teachers",
  "Historic heroes",
  "Previous expeditions",
  "Commander stories",
  "Player legacy",
] as const;
export type GenerationalReferenceKind = (typeof GENERATIONAL_REFERENCE_KINDS)[number];

export const PLAYER_WRITABLE_ENTRY_KINDS = [
  "Notes",
  "Letters",
  "Expedition journals",
  "Memorials",
  "Scientific observations",
  "Personal reflections",
] as const;
export type PlayerWritableEntryKind = (typeof PLAYER_WRITABLE_ENTRY_KINDS)[number];

export const PLANETARY_HISTORY_FIELDS = [
  "Discovery",
  "Settlement",
  "Population",
  "Expansion",
  "Wars",
  "Recovery",
  "Wildlife",
  "Research",
  "Architecture",
  "Government",
  "Major disasters",
  "Restoration",
] as const;
export type PlanetaryHistoryField = (typeof PLANETARY_HISTORY_FIELDS)[number];

/**
 * "Entries never overwrite. They expand. Older versions remain
 * archived." One version per call to `expand()`; `latest()` reads the
 * newest without ever discarding history. Also serves Academic
 * Debates: a disagreeing historian simply adds another version.
 */
export interface EntryVersion {
  text: string;
  epoch: number;
  authorVoice: AuthorVoice;
}

export class EvolvingEntry {
  private readonly versions: EntryVersion[] = [];

  constructor(public readonly subjectId: string) {}

  expand(text: string, epoch: number, authorVoice: AuthorVoice): void {
    this.versions.push({ text, epoch, authorVoice });
  }

  latest(): EntryVersion | null {
    return this.versions.at(-1) ?? null;
  }

  allVersions(): readonly EntryVersion[] {
    return this.versions;
  }
}

/** "No event has only one voice." */
export class MultiPerspectiveRecord {
  private readonly perspectives = new Map<PerspectiveKind, string>();

  constructor(public readonly eventId: string) {}

  addPerspective(kind: PerspectiveKind, description: string): void {
    this.perspectives.set(kind, description);
  }

  perspectiveFor(kind: PerspectiveKind): string | undefined {
    return this.perspectives.get(kind);
  }

  voiceCount(): number {
    return this.perspectives.size;
  }

  allPerspectives(): ReadonlyMap<PerspectiveKind, string> {
    return this.perspectives;
  }
}
