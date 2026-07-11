import { hashString } from '../icons/hash';

/** A deterministic little "planet" glyph derived from the location's id — each place in the sprawl reads distinctly at a glance. */
export function LocationGlyph({ seed, size = 36 }: { seed: string; size?: number }) {
  const h = hashString(seed);
  const hue = h % 360;
  const hasRing = h % 3 !== 0;
  const moonCount = h % 3;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="location-glyph" aria-hidden="true">
      {hasRing && (
        <ellipse
          cx="20"
          cy="20"
          rx="17"
          ry="4.2"
          fill="none"
          stroke={`hsl(${(hue + 40) % 360} 65% 65%)`}
          strokeWidth="1.4"
          opacity="0.75"
          transform="rotate(-16 20 20)"
        />
      )}
      <circle cx="20" cy="20" r="10" fill={`hsl(${hue} 55% 46%)`} />
      <circle cx="20" cy="20" r="10" fill="none" stroke={`hsl(${hue} 70% 75%)`} strokeWidth="0.6" opacity="0.5" />
      <circle cx={17} cy={17} r="3.2" fill={`hsl(${hue} 60% 60%)`} opacity="0.35" />
      {Array.from({ length: moonCount }).map((_, i) => (
        <circle
          key={i}
          cx={6 + i * 5}
          cy={7 + ((h >> (i * 3)) % 5)}
          r="1.3"
          fill={`hsl(${(hue + i * 70 + 40) % 360} 65% 72%)`}
        />
      ))}
    </svg>
  );
}
