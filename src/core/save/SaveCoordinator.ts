/**
 * Save Coordinator (AF-044): cross-slice bookkeeping and Milestone Backups.
 * Every existing slice already autosaves itself immediately after its own
 * meaningful mutation (§Autosave is already satisfied, distributed across
 * every `persistX()` call site since AF-024/025/026/027/042) — this class
 * doesn't change *when* anything saves. It records *that* a save happened
 * (Autosave Status, AF-044 §DEBUG) and, separately, can snapshot every
 * registered unit's current data into one aggregate, checksum-protected
 * blob for Major Milestone Backups — reusing AF-024's exact `checksumOf`
 * rather than inventing a second integrity scheme.
 */
import { checksumOf } from "./SaveSlice";
import type { SaveStorage } from "./SaveStorage";

export const AUTOSAVE_TRIGGERS = [
  "missionCompletion",
  "research",
  "crafting",
  "purchases",
  "achievements",
  "collections",
  "galaxyProgress",
  "settingsChanges",
] as const;
export type AutosaveTrigger = (typeof AUTOSAVE_TRIGGERS)[number];

export interface SaveUnit<T = unknown> {
  id: string;
  toSave(): T;
  loadSave(data: T): void;
}

/** Only exists once at least one save has been recorded — status() returns
 * null entirely until then, so lastSavedAtMs is never null on a real status. */
export interface SaveUnitStatus {
  id: string;
  lastSavedAtMs: number;
  saveCount: number;
}

export interface MilestoneBackupEnvelope {
  version: number;
  takenAtMs: number;
  units: Record<string, unknown>;
}

const MILESTONE_BACKUP_VERSION = 1;

export class SaveCoordinator {
  private readonly units = new Map<string, SaveUnit>();
  private readonly statuses = new Map<string, SaveUnitStatus>();

  constructor(private readonly now: () => number = Date.now) {}

  /** Generic so the caller's own toSave/loadSave keep their concrete type —
   * only the internal registry (necessarily heterogeneous) erases to unknown. */
  register<T>(unit: SaveUnit<T>): void {
    this.units.set(unit.id, unit as SaveUnit);
  }

  /** Call once per persistX() — bookkeeping only, never changes what/when a slice saves. */
  recordSave(unitId: string): void {
    const previous = this.statuses.get(unitId);
    this.statuses.set(unitId, { id: unitId, lastSavedAtMs: this.now(), saveCount: (previous?.saveCount ?? 0) + 1 });
  }

  status(unitId: string): SaveUnitStatus | null {
    return this.statuses.get(unitId) ?? null;
  }

  get allStatuses(): readonly SaveUnitStatus[] {
    return [...this.statuses.values()];
  }

  /** A full cross-slice snapshot — the Major Milestone Backup payload. */
  snapshotAll(): MilestoneBackupEnvelope {
    const units: Record<string, unknown> = {};
    for (const [id, unit] of this.units) units[id] = unit.toSave();
    return { version: MILESTONE_BACKUP_VERSION, takenAtMs: this.now(), units };
  }

  /** Restores every currently-registered unit found in the envelope; units
   * the envelope doesn't mention (e.g. content added since the backup) are left untouched. */
  restoreAll(envelope: MilestoneBackupEnvelope): void {
    for (const [id, unit] of this.units) {
      if (id in envelope.units) unit.loadSave(envelope.units[id]);
    }
  }

  async writeMilestoneBackup(storage: SaveStorage, key: string): Promise<void> {
    const envelope = this.snapshotAll();
    const dataJson = JSON.stringify(envelope);
    const checksum = checksumOf(envelope.version, dataJson);
    await storage.write(key, JSON.stringify({ checksum, envelope }));
  }

  /** Returns null (never throws) if the backup is missing, corrupt, or checksum-mismatched. */
  async readMilestoneBackup(storage: SaveStorage, key: string): Promise<MilestoneBackupEnvelope | null> {
    const raw = await storage.read(key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { checksum: string; envelope: MilestoneBackupEnvelope };
      const dataJson = JSON.stringify(parsed.envelope);
      if (checksumOf(parsed.envelope.version, dataJson) !== parsed.checksum) return null;
      return parsed.envelope;
    } catch {
      return null;
    }
  }
}
