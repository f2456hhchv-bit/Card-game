/**
 * Controller vibration tuning — GP-001 §Game Feel. `hapticIntensity` was
 * registered on `InputTuning` (AF-019 §6) with no producer until now.
 * Reuses hitStopTuning.ts's own `HitStopSource` vocabulary directly rather
 * than inventing a second "impactful moment" union — the same events that
 * freeze a frame and shake the camera also pulse the controller.
 */
import type { HitStopSource } from "../feel/hitStopTuning";

export interface HapticEffectDef {
  durationMs: number;
  strongMagnitude: number;
  weakMagnitude: number;
}

export const HAPTIC_EFFECTS: Readonly<Record<HitStopSource, HapticEffectDef>> = {
  criticalHit: { durationMs: 60, strongMagnitude: 0.3, weakMagnitude: 0.2 },
  eliteKill: { durationMs: 120, strongMagnitude: 0.5, weakMagnitude: 0.35 },
  bossPhaseChange: { durationMs: 220, strongMagnitude: 0.7, weakMagnitude: 0.5 },
  bossDefeated: { durationMs: 320, strongMagnitude: 0.9, weakMagnitude: 0.6 },
  playerDefeated: { durationMs: 400, strongMagnitude: 1, weakMagnitude: 0.7 },
};

/** Pure: the actual effect to play, scaled by the player's own intensity setting — null means "don't vibrate". */
export function hapticEffectFor(source: HitStopSource, intensityScale: number): HapticEffectDef | null {
  if (intensityScale <= 0) return null;
  const def = HAPTIC_EFFECTS[source];
  return {
    durationMs: def.durationMs,
    strongMagnitude: Math.min(1, def.strongMagnitude * intensityScale),
    weakMagnitude: Math.min(1, def.weakMagnitude * intensityScale),
  };
}
