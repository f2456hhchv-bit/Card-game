import { hashString } from '../icons/hash';

/** A station glyph that grows more elaborate with tier — more docking arms and ring layers as your hold on a sector deepens. */
export function StationGlyph({ seed, tier, size = 36 }: { seed: string; tier: number; size?: number }) {
  const h = hashString(seed);
  const hue = (h + 60) % 360;
  const clampedTier = Math.max(1, Math.min(5, tier));
  const armCount = 2 + clampedTier;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="station-glyph" aria-hidden="true">
      {clampedTier >= 3 && (
        <circle cx="20" cy="20" r="17" fill="none" stroke={`hsl(${hue} 60% 60%)`} strokeWidth="0.8" opacity="0.35" strokeDasharray="1.5 2.5" />
      )}
      {Array.from({ length: armCount }).map((_, i) => {
        const angle = (i / armCount) * Math.PI * 2;
        const x2 = 20 + Math.cos(angle) * 15;
        const y2 = 20 + Math.sin(angle) * 15;
        return (
          <line
            key={i}
            x1={20 + Math.cos(angle) * 7}
            y1={20 + Math.sin(angle) * 7}
            x2={x2}
            y2={y2}
            stroke={`hsl(${hue} 55% 62%)`}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="20" cy="20" r="7" fill={`hsl(${hue} 50% 40%)`} stroke={`hsl(${hue} 70% 72%)`} strokeWidth="1" />
      <circle cx="20" cy="20" r="2.2" fill={`hsl(${(hue + 40) % 360} 85% 68%)`} />
    </svg>
  );
}
