export const ALIGNMENT_MIN = -100;
export const ALIGNMENT_MAX = 100;

export function shiftAlignment(current: number, delta: number): number {
  return Math.max(ALIGNMENT_MIN, Math.min(ALIGNMENT_MAX, current + delta));
}

export function alignmentLabel(score: number): string {
  if (score >= 60) return 'Beacon of the Frontier';
  if (score >= 20) return 'Steady Hand';
  if (score > -20) return 'Undecided';
  if (score > -60) return 'Ruthless Opportunist';
  return 'Tyrant of the Reach';
}
