import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = process.env.NOVA_CITY_DATA_DIR ?? path.resolve(process.cwd(), '.data');

/**
 * A tiny synchronous, write-through JSON-file-backed collection. All reads hit
 * an in-memory Map; every mutation flushes the full collection to disk. Fine
 * at NOVA CITY's target scale — swap for a real database by reimplementing
 * this class's public surface against SQL, nothing above this layer changes.
 */
export class Collection<T extends { id: string }> {
  private items = new Map<string, T>();
  private file: string;

  constructor(name: string, seed: T[] = []) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    this.file = path.join(DATA_DIR, `${name}.json`);
    if (fs.existsSync(this.file)) {
      const raw = JSON.parse(fs.readFileSync(this.file, 'utf-8')) as T[];
      for (const item of raw) this.items.set(item.id, item);
    } else {
      for (const item of seed) this.items.set(item.id, item);
      this.flush();
    }
  }

  all(): T[] {
    return [...this.items.values()];
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    for (const item of this.items.values()) {
      if (predicate(item)) return item;
    }
    return undefined;
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.all().filter(predicate);
  }

  put(item: T): T {
    this.items.set(item.id, item);
    this.flush();
    return item;
  }

  delete(id: string): void {
    this.items.delete(id);
    this.flush();
  }

  private flush(): void {
    fs.writeFileSync(this.file, JSON.stringify(this.all(), null, 2));
  }
}
