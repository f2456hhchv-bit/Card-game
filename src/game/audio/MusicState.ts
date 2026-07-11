/**
 * Adaptive Music state resolution (AF-045 §Adaptive Music): a pure function
 * over state AF-016 (game state), AF-017 (Director phase), and AF-035
 * (boss phase) already expose — zero new state machine. Research/Crafting/
 * Credits music states are registered (`MUSIC_STATES`) but have no live
 * producer: AF-016's GalaxyCommand hosts research/crafting inline rather
 * than as distinct game states, and no credits sequence exists yet.
 */
import type { MusicState } from "./audioData";

export interface MusicStateInputs {
  gameState: string;
  directorPhase: string | null;
  bossActive: boolean;
  bossPhase: number | null;
  runResult: "victory" | "defeat" | null;
}

export function resolveMusicState(inputs: MusicStateInputs): MusicState {
  if (inputs.runResult === "victory") return "victory";
  if (inputs.runResult === "defeat") return "defeat";
  if (inputs.gameState !== "Gameplay") return "galaxyCommand";
  if (inputs.bossActive) {
    if (inputs.bossPhase === null || inputs.bossPhase <= 1) return "bossIntroduction";
    if (inputs.bossPhase === 2) return "bossPhase";
    // GP-002: phase 3 ("Chaos") and phase 4+ ("Signature") each get their own
    // distinct cue — the boss's own biggest beats no longer share one generic state.
    if (inputs.bossPhase === 3) return "bossPhaseChaos";
    return "bossPhaseSignature";
  }
  if (inputs.directorPhase === "ElitePressure") return "eliteEncounter";
  if (inputs.directorPhase === "HeavyCombat") return "heavyCombat";
  if (inputs.directorPhase === "Combat" || inputs.directorPhase === "LightContact") return "combat";
  return "exploration";
}

/** Distance Attenuation (AF-045 §Positional Audio) — linear falloff, pure. */
export function distanceAttenuation(distance: number, maxDistance: number): number {
  if (maxDistance <= 0) return distance <= 0 ? 1 : 0;
  return Math.max(0, Math.min(1, 1 - distance / maxDistance));
}
