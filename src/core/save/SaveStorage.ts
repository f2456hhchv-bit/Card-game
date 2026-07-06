/**
 * Storage interface for save slices (AF-001 §8 / AF-024 §2). The interface
 * is the contract future backends implement: IndexedDB, Steam Cloud,
 * account sync. Async by design so those backends slot in unchanged.
 */
export interface SaveStorage {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

/** In-memory storage — tests and headless runs. */
export class MemoryStorage implements SaveStorage {
  private readonly map = new Map<string, string>();

  read(key: string): Promise<string | null> {
    return Promise.resolve(this.map.get(key) ?? null);
  }

  write(key: string, value: string): Promise<void> {
    this.map.set(key, value);
    return Promise.resolve();
  }

  remove(key: string): Promise<void> {
    this.map.delete(key);
    return Promise.resolve();
  }
}

/** Browser localStorage adapter — the walking skeleton's persistence.
 * IndexedDB replaces it behind the same interface with the full save module. */
export class LocalStorageAdapter implements SaveStorage {
  constructor(private readonly prefix = "afterlight:") {}

  read(key: string): Promise<string | null> {
    try {
      return Promise.resolve(window.localStorage.getItem(this.prefix + key));
    } catch {
      return Promise.resolve(null); // storage unavailable → graceful default
    }
  }

  write(key: string, value: string): Promise<void> {
    try {
      window.localStorage.setItem(this.prefix + key, value);
    } catch {
      // Quota/privacy-mode failures are logged by the caller; never throw.
    }
    return Promise.resolve();
  }

  remove(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(this.prefix + key);
    } catch {
      // Ignore — see write().
    }
    return Promise.resolve();
  }
}
