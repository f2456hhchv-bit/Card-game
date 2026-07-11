/**
 * Standalone Artifact registry (GP-004 §Content Engine). Distinct from
 * bossArtifacts.ts's five hand-authored, boss-kill-gated rewards — this is
 * the generic, addressable "completely changes your build" category the
 * audit found missing: any future Artifact becomes mechanically real just
 * by setting `effect` on its own def, dispatched by kind through the same
 * real events (EnemyKilled/PlayerDamaged/ShieldBroken/CommanderLevelUp)
 * every other permanent-passive system in this codebase already emits — no
 * new state machine, no per-id main.ts branch. Bought at the mid-run
 * Travelling Merchant: a real acquisition point, distinct from the Boss's
 * own once-per-run reward ceremony.
 */
export const ARTIFACT_EFFECT_KINDS = ["novaOnKill", "barrierOnDamage", "healOnShieldBreak", "critOnLevelUp"] as const;
export type ArtifactEffectKind = (typeof ARTIFACT_EFFECT_KINDS)[number];

export interface ArtifactEffect {
  kind: ArtifactEffectKind;
  value: number;
  /** novaOnKill only — the AoE radius centred on the player. */
  radius?: number;
}

export interface ArtifactDef {
  id: string;
  name: string;
  description: string;
  /** Credits, at the mid-run Travelling Merchant. */
  price: number;
  effect: ArtifactEffect;
}

export const SANDBOX_ARTIFACTS: readonly ArtifactDef[] = [
  {
    id: "artifact-shrapnel-core",
    name: "Shrapnel Core",
    description: "Every kill sends out a damaging pulse.",
    price: 180,
    effect: { kind: "novaOnKill", value: 22, radius: 4 },
  },
  {
    id: "artifact-reactive-plating",
    name: "Reactive Plating",
    description: "Taking damage instantly raises your barrier.",
    price: 160,
    effect: { kind: "barrierOnDamage", value: 6 },
  },
  {
    id: "artifact-fail-safe-cell",
    name: "Fail-Safe Cell",
    description: "Losing your shield triggers an emergency hull repair.",
    price: 200,
    effect: { kind: "healOnShieldBreak", value: 25 },
  },
  {
    id: "artifact-ascension-matrix",
    name: "Ascension Matrix",
    description: "Every level gained permanently sharpens your aim.",
    price: 170,
    effect: { kind: "critOnLevelUp", value: 0.03 },
  },
];

/** Run-scoped: which Artifacts the player has bought. Held permanently for the run. */
export class ArtifactRuntime {
  private readonly held = new Set<string>();

  choose(id: string): boolean {
    if (this.held.has(id)) return false;
    if (!SANDBOX_ARTIFACTS.some((a) => a.id === id)) return false;
    this.held.add(id);
    return true;
  }

  has(id: string): boolean {
    return this.held.has(id);
  }

  get heldIds(): readonly string[] {
    return [...this.held];
  }
}
