/**
 * GalacticCreatorRuntime pieces (AF-141). Composes with real state via
 * plain ids/values passed in by the caller (main.ts) — the decoupled-
 * composition discipline established by AF-137 and continued through
 * AF-138/139/140.
 */
import { COMMUNITY_PROJECT_EXAMPLES, type FlagDisplayLocationKind, type PlaylistContextKind } from "./galacticCreatorData";

export interface PhotoAlbumDef {
  id: string;
  title: string;
  caption: string;
  photoIds: string[];
}

/** "Photos can be grouped into albums... albums receive captions." Genuinely
 * new — AF-133's real `PhotoAlbum` is a flat map keyed by photo id with no
 * grouping concept. This composes it by referencing real photo ids rather
 * than storing photo data a second time. */
export class PhotoAlbumCurator {
  private readonly albums = new Map<string, PhotoAlbumDef>();

  createAlbum(albumId: string, title: string, caption = ""): PhotoAlbumDef {
    const album: PhotoAlbumDef = { id: albumId, title, caption, photoIds: [] };
    this.albums.set(albumId, album);
    return album;
  }

  addPhoto(albumId: string, photoId: string): void {
    const album = this.albums.get(albumId);
    if (!album) return;
    if (!album.photoIds.includes(photoId)) album.photoIds.push(photoId);
  }

  caption(albumId: string, caption: string): void {
    const album = this.albums.get(albumId);
    if (album) album.caption = caption;
  }

  albumFor(albumId: string): PhotoAlbumDef | null {
    return this.albums.get(albumId) ?? null;
  }

  all(): readonly PhotoAlbumDef[] {
    return [...this.albums.values()];
  }
}

export interface CuratedExhibitionDef {
  id: string;
  theme: string;
  artifactTitles: string[];
  lighting: string;
  narration: string;
  music: string;
  educationalNotes: string;
}

/** "Players curate exhibitions... theme, artifacts, lighting, narration,
 * music, educational notes." Genuinely new — AF-134's real
 * `MuseumCollectionRegistry` only tallies `{kind, title}`; AF-140's
 * `temporaryExhibitionThemeFor` only cycles a flavour theme. Neither
 * carries curatorial detail. */
export class ExhibitionCuratorRuntime {
  private readonly exhibitions = new Map<string, CuratedExhibitionDef>();

  curate(id: string, theme: string): CuratedExhibitionDef {
    const exhibition: CuratedExhibitionDef = { id, theme, artifactTitles: [], lighting: "", narration: "", music: "", educationalNotes: "" };
    this.exhibitions.set(id, exhibition);
    return exhibition;
  }

  addArtifact(id: string, title: string): void {
    this.exhibitions.get(id)?.artifactTitles.push(title);
  }

  setLighting(id: string, lighting: string): void {
    const exhibition = this.exhibitions.get(id);
    if (exhibition) exhibition.lighting = lighting;
  }

  setNarration(id: string, narration: string): void {
    const exhibition = this.exhibitions.get(id);
    if (exhibition) exhibition.narration = narration;
  }

  exhibitionFor(id: string): CuratedExhibitionDef | null {
    return this.exhibitions.get(id) ?? null;
  }

  all(): readonly CuratedExhibitionDef[] {
    return [...this.exhibitions.values()];
  }
}

export interface FlagDef {
  id: string;
  ownerId: string;
  colours: string[];
  symbol: string;
  motto: string;
  epoch: number;
}

/** Expedition Flags — genuinely new, no flag/banner concept exists
 * anywhere. Uses a `flag-*` id namespace, deliberately distinct from
 * `FactionDef.symbol`'s real `icon-*-sigil` asset ids. */
export class ExpeditionFlagRegistry {
  private readonly flags = new Map<string, FlagDef>();
  private readonly displayLocations = new Map<string, Set<FlagDisplayLocationKind>>();

  design(id: string, ownerId: string, colours: string[], symbol: string, motto: string, epoch: number): FlagDef {
    const flag: FlagDef = { id, ownerId, colours, symbol, motto, epoch };
    this.flags.set(id, flag);
    return flag;
  }

  flagFor(id: string): FlagDef | null {
    return this.flags.get(id) ?? null;
  }

  displayAt(id: string, location: FlagDisplayLocationKind): void {
    const locations = this.displayLocations.get(id) ?? new Set<FlagDisplayLocationKind>();
    locations.add(location);
    this.displayLocations.set(id, locations);
  }

  locationsFor(id: string): readonly FlagDisplayLocationKind[] {
    return [...(this.displayLocations.get(id) ?? [])];
  }

  all(): readonly FlagDef[] {
    return [...this.flags.values()];
  }
}

/** A single generic element-selection studio, reused for both Garden
 * Design and Observatory Design — the same "one generic class over
 * several K types" discipline AF-134's `MuseumCollectionRegistry`
 * established (its 7th-and-8th-style reuse, here as a sibling generic
 * rather than the same class, since these track selected elements per
 * creation rather than a flat collected tally). */
export class CreationElementStudio<TElement extends string> {
  private readonly selections = new Map<string, TElement[]>();

  select(creationId: string, element: TElement): void {
    const elements = this.selections.get(creationId) ?? [];
    if (!elements.includes(element)) elements.push(element);
    this.selections.set(creationId, elements);
  }

  elementsFor(creationId: string): readonly TElement[] {
    return this.selections.get(creationId) ?? [];
  }
}

/** Music playlists — genuinely new/cosmetic; AF-045's audio module has
 * no real track catalog yet, so track titles are free strings. */
export class SoundtrackPlaylistRegistry {
  private readonly playlists = new Map<PlaylistContextKind, string[]>();

  addTrack(context: PlaylistContextKind, title: string): void {
    const tracks = this.playlists.get(context) ?? [];
    tracks.push(title);
    this.playlists.set(context, tracks);
  }

  tracksFor(context: PlaylistContextKind): readonly string[] {
    return this.playlists.get(context) ?? [];
  }
}

export interface CommanderContributionRecord {
  commanderId: string;
  idea: string;
  epoch: number;
}

/** "Commanders contribute ideas... relationships influence
 * collaboration." Append-only; eligibility is gated by
 * `contributionEligible` (real AF-130 bond level) at the call site. */
export class CommanderCreativeContributionLog {
  private readonly records: CommanderContributionRecord[] = [];

  contribute(commanderId: string, idea: string, epoch: number): CommanderContributionRecord {
    const record: CommanderContributionRecord = { commanderId, idea, epoch };
    this.records.push(record);
    return record;
  }

  contributionsFor(commanderId: string): readonly CommanderContributionRecord[] {
    return this.records.filter((r) => r.commanderId === commanderId);
  }

  all(): readonly CommanderContributionRecord[] {
    return this.records;
  }
}

/** "Large-scale creations... each requires contributions over time."
 * Mirrors AF-138's real `MegaprojectTracker` accumulate-progress pattern
 * exactly, over this module's own, distinctly-idd roster. */
export class CommunityProjectTracker {
  private readonly progress = new Map<string, number>();

  contribute(projectId: string, amount: number): boolean {
    const def = COMMUNITY_PROJECT_EXAMPLES.find((p) => p.id === projectId);
    if (!def || this.isComplete(projectId)) return false;
    this.progress.set(projectId, Math.min(def.threshold, this.progressFor(projectId) + Math.max(0, amount)));
    return true;
  }

  progressFor(projectId: string): number {
    return this.progress.get(projectId) ?? 0;
  }

  isComplete(projectId: string): boolean {
    const def = COMMUNITY_PROJECT_EXAMPLES.find((p) => p.id === projectId);
    return def ? this.progressFor(projectId) >= def.threshold : false;
  }

  completedCount(): number {
    return COMMUNITY_PROJECT_EXAMPLES.filter((p) => this.isComplete(p.id)).length;
  }
}

export interface HeritageTransitionRecord {
  creationId: string;
  stage: string;
  epoch: number;
}

/** "As decades pass... older creations become protected landmarks...
 * museum entries... tourist destinations." Structurally parallel to
 * AF-139's settlement-keyed `HistoricalArchitectureLedger`, but kept as
 * its own class since it is keyed by individual creation id, not
 * settlement id — a genuinely different granularity, not a reusable
 * store. */
export class CreationHeritageLedger {
  private readonly records: HeritageTransitionRecord[] = [];

  recordTransition(creationId: string, stage: string, epoch: number): void {
    const history = this.historyFor(creationId);
    if (history.at(-1)?.stage === stage) return;
    this.records.push({ creationId, stage, epoch });
  }

  historyFor(creationId: string): readonly HeritageTransitionRecord[] {
    return this.records.filter((r) => r.creationId === creationId);
  }

  currentStageFor(creationId: string): string | null {
    return this.historyFor(creationId).at(-1)?.stage ?? null;
  }

  all(): readonly HeritageTransitionRecord[] {
    return this.records;
  }
}
