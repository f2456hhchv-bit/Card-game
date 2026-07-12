import { hashString } from '../icons/hash';

const CALM_HUE = 155;
const HOLLOW_HUE = 355;

/**
 * A per-hostile portrait that grows more menacing with tier: more spikes, a
 * wider glow, and a color shift from a muted tier-1 green toward Hollow-red
 * at tier 5, so the threat level reads before you even check the stats.
 */
export function NpcPortrait({ seed, tier, size = 36 }: { seed: string; tier: number; size?: number }) {
  const h = hashString(seed);
  const clampedTier = Math.max(1, Math.min(5, tier));
  const menace = (clampedTier - 1) / 4;
  const hue = CALM_HUE + (HOLLOW_HUE - CALM_HUE) * menace;
  const spikeCount = 4 + clampedTier * 2;
  const jitter = 1 + menace * 2.5;

  const spikes = Array.from({ length: spikeCount }, (_, i) => {
    const angle = (i / spikeCount) * Math.PI * 2;
    const wobble = ((h >> (i % 8)) % 10) / 10 - 0.5;
    const rOuter = 13 + wobble * jitter;
    return [20 + Math.cos(angle) * rOuter, 20 + Math.sin(angle) * rOuter];
  });
  const points = spikes.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="npc-portrait" aria-hidden="true">
      {menace > 0.3 && <circle cx="20" cy="20" r="16" fill={`hsl(${hue} 90% 55%)`} opacity={menace * 0.25} />}
      <polygon points={points} fill={`hsl(${hue} 55% ${Math.round(38 - menace * 8)}%)`} stroke={`hsl(${hue} 75% 68%)`} strokeWidth="1" strokeLinejoin="round" />
      <circle cx={17} cy={19} r={1.4 + menace} fill="#05060c" />
      <circle cx={23} cy={19} r={1.4 + menace} fill="#05060c" />
      {clampedTier >= 4 && <circle cx={20} cy={24} r={1.1} fill="#05060c" />}
    </svg>
  );
}
