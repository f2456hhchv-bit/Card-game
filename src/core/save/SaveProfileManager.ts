/**
 * Save Profiles (AF-044 §Save Slots): isolated progress profiles sharing
 * the same `SaveStorage` backend and the exact same `SaveSlice` contract —
 * isolation is achieved purely by key-prefixing (`storageFor`), so no
 * existing slice's code changes to become profile-aware. Settings are
 * deliberately NOT profile-scoped (see `settingsData.ts`).
 */
import type { SaveStorage } from "./SaveStorage";

export const SAVE_PROFILE_KINDS = ["primary", "additional", "challenge", "developer"] as const;
export type SaveProfileKind = (typeof SAVE_PROFILE_KINDS)[number];

export interface SaveProfileMeta {
  id: string;
  name: string;
  kind: SaveProfileKind;
  createdAtMs: number;
  lastPlayedAtMs: number;
}

interface SaveProfileRegistry {
  profiles: SaveProfileMeta[];
  activeProfileId: string | null;
}

const REGISTRY_KEY = "profiles";

export class SaveProfileManager {
  constructor(
    private readonly storage: SaveStorage,
    private readonly now: () => number = Date.now,
  ) {}

  /** A profile's own storage — every existing SaveSlice works unchanged against this. */
  storageFor(profileId: string): SaveStorage {
    const prefix = `profile:${profileId}:`;
    return {
      read: (key) => this.storage.read(`${prefix}${key}`),
      write: (key, value) => this.storage.write(`${prefix}${key}`, value),
      remove: (key) => this.storage.remove(`${prefix}${key}`),
    };
  }

  async list(): Promise<readonly SaveProfileMeta[]> {
    return (await this.readRegistry()).profiles;
  }

  async create(name: string, kind: SaveProfileKind = "additional"): Promise<SaveProfileMeta> {
    const registry = await this.readRegistry();
    const meta: SaveProfileMeta = {
      id: `profile-${this.now()}-${Math.floor(Math.random() * 1_000_000)}`,
      name,
      kind,
      createdAtMs: this.now(),
      lastPlayedAtMs: this.now(),
    };
    registry.profiles.push(meta);
    if (registry.activeProfileId === null) registry.activeProfileId = meta.id;
    await this.writeRegistry(registry);
    return meta;
  }

  async rename(profileId: string, name: string): Promise<boolean> {
    const registry = await this.readRegistry();
    const profile = registry.profiles.find((p) => p.id === profileId);
    if (!profile) return false;
    profile.name = name;
    await this.writeRegistry(registry);
    return true;
  }

  /** Unregisters the profile. Its underlying slice data is left in storage,
   * untouched — this module does not enumerate every slice a profile might
   * own, so it never guesses which keys are safe to delete. */
  async remove(profileId: string): Promise<boolean> {
    const registry = await this.readRegistry();
    const before = registry.profiles.length;
    registry.profiles = registry.profiles.filter((p) => p.id !== profileId);
    if (registry.activeProfileId === profileId) {
      registry.activeProfileId = registry.profiles[0]?.id ?? null;
    }
    await this.writeRegistry(registry);
    return registry.profiles.length < before;
  }

  async setActive(profileId: string): Promise<boolean> {
    const registry = await this.readRegistry();
    const profile = registry.profiles.find((p) => p.id === profileId);
    if (!profile) return false;
    profile.lastPlayedAtMs = this.now();
    registry.activeProfileId = profileId;
    await this.writeRegistry(registry);
    return true;
  }

  async activeProfileId(): Promise<string | null> {
    return (await this.readRegistry()).activeProfileId;
  }

  private async readRegistry(): Promise<SaveProfileRegistry> {
    const raw = await this.storage.read(REGISTRY_KEY);
    if (!raw) return { profiles: [], activeProfileId: null };
    try {
      return JSON.parse(raw) as SaveProfileRegistry;
    } catch {
      return { profiles: [], activeProfileId: null };
    }
  }

  private async writeRegistry(registry: SaveProfileRegistry): Promise<void> {
    await this.storage.write(REGISTRY_KEY, JSON.stringify(registry));
  }
}
