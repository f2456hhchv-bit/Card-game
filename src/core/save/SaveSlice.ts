/**
 * Versioned save slice (AF-001 §8, implemented for AF-024). Envelope
 * {version, checksum, data}; pure chained migrations; corruption is
 * quarantined (kept for diagnosis), the rolling backup restores, and only
 * if both fail does THIS slice alone reset — corruption never cascades.
 */
import type { SaveStorage } from "./SaveStorage";

export interface SliceEnvelope {
  version: number;
  checksum: string;
  data: unknown;
}

export type Migration = (oldData: unknown) => unknown;

export interface SaveSliceOptions<T> {
  key: string;
  currentVersion: number;
  /** migrations[n] upgrades data from version n to n+1. */
  migrations: Readonly<Record<number, Migration>>;
  defaultData: () => T;
  storage: SaveStorage;
  onWarning?: (message: string, detail?: unknown) => void;
}

/** FNV-1a over version + payload — integrity + casual-tamper detection. */
export function checksumOf(version: number, dataJson: string): string {
  const text = `${version}:${dataJson}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export class SaveSlice<T> {
  constructor(private readonly options: SaveSliceOptions<T>) {}

  async load(): Promise<T> {
    const primary = await this.tryRead(this.options.key);
    if (primary !== null) return primary;

    this.options.onWarning?.(`slice "${this.options.key}": primary unreadable, trying backup`);
    const backup = await this.tryRead(this.backupKey());
    if (backup !== null) return backup;

    this.options.onWarning?.(`slice "${this.options.key}": reset to defaults (primary and backup unreadable)`);
    return this.options.defaultData();
  }

  async save(data: T): Promise<void> {
    // Rolling backup: the last known-good envelope survives one bad write.
    const current = await this.options.storage.read(this.options.key);
    if (current !== null) await this.options.storage.write(this.backupKey(), current);

    const dataJson = JSON.stringify(data);
    const envelope: SliceEnvelope = {
      version: this.options.currentVersion,
      checksum: checksumOf(this.options.currentVersion, dataJson),
      data: JSON.parse(dataJson) as unknown,
    };
    await this.options.storage.write(this.options.key, JSON.stringify(envelope));
  }

  private backupKey(): string {
    return `${this.options.key}.backup`;
  }

  private quarantineKey(): string {
    return `${this.options.key}.quarantine`;
  }

  private async tryRead(key: string): Promise<T | null> {
    const raw = await this.options.storage.read(key);
    if (raw === null) return null;
    try {
      const envelope = JSON.parse(raw) as SliceEnvelope;
      const dataJson = JSON.stringify(envelope.data);
      if (checksumOf(envelope.version, dataJson) !== envelope.checksum) {
        throw new Error("checksum mismatch");
      }
      let data: unknown = envelope.data;
      let version = envelope.version;
      while (version < this.options.currentVersion) {
        const migrate = this.options.migrations[version];
        if (!migrate) throw new Error(`missing migration from v${version}`);
        data = migrate(data);
        version += 1;
      }
      if (version > this.options.currentVersion) {
        throw new Error(`save from future version v${version}`);
      }
      return data as T;
    } catch (error) {
      // Quarantine for diagnosis — never silently destroy player data.
      await this.options.storage.write(this.quarantineKey(), raw);
      this.options.onWarning?.(`slice "${this.options.key}": quarantined corrupt payload`, error);
      return null;
    }
  }
}
