interface OriginRecord {
  entityId: string;
  founder: string;
  reason: string;
  location: string;
  epoch: number;
  inspiration: string;
  doubters: readonly string[];
  believers: readonly string[];
}

/** "Who began it. Why it began. Where it began. When it began. What
 * inspired it. Who doubted it. Who believed in it. These become
 * permanent history." Confirmed genuinely new (see
 * atlasGenesisData.ts module doc comment): write-once per entity —
 * once an origin is recorded, a second `recordOrigin` call for the
 * same id is a no-op, so a founding story is never silently
 * rewritten. */
export class GenesisRegistry {
  private readonly records = new Map<string, OriginRecord>();

  recordOrigin(entityId: string, founder: string, reason: string, location: string, epoch: number, inspiration: string, doubters: readonly string[], believers: readonly string[]): void {
    if (this.records.has(entityId)) return;
    this.records.set(entityId, { entityId, founder, reason, location, epoch, inspiration, doubters, believers });
  }

  originOf(entityId: string): OriginRecord | null {
    return this.records.get(entityId) ?? null;
  }

  all(): readonly OriginRecord[] {
    return [...this.records.values()];
  }
}
