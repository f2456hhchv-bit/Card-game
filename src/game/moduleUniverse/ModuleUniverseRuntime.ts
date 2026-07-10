/**
 * ModuleUniverseRuntime pieces (AF-142). `ModuleRegistry` is the genuine
 * new territory this module fills — AF-070's real `LiveOpsRegistry`
 * registers content PACKS (no dependency graph, no cross-system tags);
 * this registers whole MODULES with both.
 */
import { systemCompatibilityFor, type ContentDiscoveryKind, type ModuleRegistrationDef } from "./moduleUniverseData";

export type ModuleRegistrationResult = { ok: true; systemCompatibility: readonly string[] } | { ok: false; reasons: readonly string[] };

/**
 * Kahn's-algorithm topological sort over `dependencies` edges — the
 * same grey/black-DFS spirit AF-024's real `ResearchTree.validate()`
 * already established for prerequisite graphs, adapted to this
 * module's own registration shape. Returns `null` on a cycle.
 */
function topologicalOrderOver(modules: ReadonlyMap<string, ModuleRegistrationDef>): string[] | null {
  const ids = [...modules.keys()];
  const dependents = new Map<string, string[]>();
  const remainingDeps = new Map<string, number>();
  for (const id of ids) {
    const realDeps = modules.get(id)!.dependencies.filter((d) => modules.has(d));
    remainingDeps.set(id, realDeps.length);
    for (const dep of realDeps) dependents.set(dep, [...(dependents.get(dep) ?? []), id]);
  }
  const queue = ids.filter((id) => remainingDeps.get(id) === 0);
  const order: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const dependent of dependents.get(id) ?? []) {
      const remaining = remainingDeps.get(dependent)! - 1;
      remainingDeps.set(dependent, remaining);
      if (remaining === 0) queue.push(dependent);
    }
  }
  return order.length === ids.length ? order : null;
}

/**
 * "Every module automatically registers." An all-or-nothing gauntlet in
 * the same spirit as AF-070's `LiveOpsRegistry.registerPack` — a
 * rejected module changes nothing. "Modules load dynamically, inactive
 * content remains unloaded" is modelled honestly as a real
 * loaded/unloaded flag per module, not literal bundler code-splitting.
 */
export class ModuleRegistry {
  private readonly modules = new Map<string, ModuleRegistrationDef>();
  private readonly compatibility = new Map<string, readonly string[]>();
  private readonly loaded = new Set<string>();

  register(def: ModuleRegistrationDef): ModuleRegistrationResult {
    const reasons: string[] = [];
    if (this.modules.has(def.id)) reasons.push(`duplicate module id "${def.id}" — every module registers exactly once`);
    if (def.dependencies.includes(def.id)) reasons.push(`module "${def.id}" cannot depend on itself`);
    if (reasons.length > 0) return { ok: false, reasons };

    const candidate = new Map(this.modules);
    candidate.set(def.id, def);
    if (topologicalOrderOver(candidate) === null) {
      return { ok: false, reasons: [`registering "${def.id}" would create a dependency cycle`] };
    }

    this.modules.set(def.id, def);
    const systemCompatibility = systemCompatibilityFor(def);
    this.compatibility.set(def.id, systemCompatibility);
    this.loaded.add(def.id);
    return { ok: true, systemCompatibility };
  }

  moduleFor(id: string): ModuleRegistrationDef | null {
    return this.modules.get(id) ?? null;
  }

  all(): readonly ModuleRegistrationDef[] {
    return [...this.modules.values()];
  }

  compatibilityFor(id: string): readonly string[] {
    return this.compatibility.get(id) ?? [];
  }

  missingDependenciesFor(id: string): readonly string[] {
    const def = this.modules.get(id);
    if (!def) return [];
    return def.dependencies.filter((d) => !this.modules.has(d));
  }

  dependenciesResolved(id: string): boolean {
    return this.missingDependenciesFor(id).length === 0;
  }

  /** "Streaming... memory usage scales intelligently" — real toggle, not
   * a literal asset-streaming pipeline (AF-094 honestly still lacks one). */
  unloadModule(id: string): void {
    this.loaded.delete(id);
  }

  loadModule(id: string): void {
    if (this.modules.has(id)) this.loaded.add(id);
  }

  isLoaded(id: string): boolean {
    return this.loaded.has(id);
  }

  loadedCount(): number {
    return this.loaded.size;
  }

  topologicalLoadOrder(): string[] | null {
    return topologicalOrderOver(this.modules);
  }
}

export interface ModuleQaCheckResult {
  dependenciesResolved: boolean;
  gameplayTagsDeclared: boolean;
  narrativeTagsDeclared: boolean;
  accessibilityDeclared: boolean;
  museumIntegrated: boolean;
  chronicleIntegrated: boolean;
  legacyIntegrated: boolean;
  passed: boolean;
}

/**
 * "Every new module automatically validates..." — genuinely fulfils the
 * "Dependencies" and "Museum integration" gates AF-095's
 * `qualityAssuranceData.ts` explicitly flagged as still-future, without
 * modifying that locked data. Dialogue/Performance/Narrative-consistency
 * checks are not independently re-implemented here — they have no
 * generic, content-agnostic analog at this registration's granularity.
 */
export function moduleQaReport(def: ModuleRegistrationDef, registry: ModuleRegistry): ModuleQaCheckResult {
  const checks = {
    dependenciesResolved: registry.dependenciesResolved(def.id),
    gameplayTagsDeclared: def.gameplayTags.length > 0,
    narrativeTagsDeclared: def.narrativeTags.length > 0,
    accessibilityDeclared: def.accessibilityMetadata.length > 0,
    museumIntegrated: def.museumCompatible,
    chronicleIntegrated: def.chronicleSupport,
    legacyIntegrated: def.legacySupport,
  };
  const passed = Object.values(checks).every(Boolean);
  return { ...checks, passed };
}

export interface ContentDiscoveryRecord {
  kind: ContentDiscoveryKind;
  description: string;
  epoch: number;
  sequence: number;
}

/** "New content appears naturally... no immersion-breaking DLC prompts."
 * Append-only, deliberately separate from AF-132's real
 * `NEWS_CATEGORIES`/`DISCOVERY_KINDS` (see module doc comment). */
export class ContentDiscoveryFeed {
  private readonly records: ContentDiscoveryRecord[] = [];

  discover(kind: ContentDiscoveryKind, description: string, epoch: number): ContentDiscoveryRecord {
    const record: ContentDiscoveryRecord = { kind, description, epoch, sequence: this.records.length };
    this.records.push(record);
    return record;
  }

  all(): readonly ContentDiscoveryRecord[] {
    return this.records;
  }

  countFor(kind: ContentDiscoveryKind): number {
    return this.records.filter((r) => r.kind === kind).length;
  }
}
