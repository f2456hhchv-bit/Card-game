import { hashString } from '../icons/hash';

const HUES = [190, 265, 10, 150, 45, 320, 110, 280, 20, 200];

/** A deterministic hex-badge crest derived from the fleet's id — every fleet gets a distinct, stable emblem. */
export function FactionCrest({ seed, tag, size = 44 }: { seed: string; tag: string; size?: number }) {
  const h = hashString(seed);
  const hue = HUES[h % HUES.length];
  const hue2 = (hue + 35 + (h % 40)) % 360;
  const rotate = h % 2 === 0 ? 0 : 90;
  const gradientId = `crest-grad-${seed}`;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="faction-crest" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 70% 55%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2} 70% 38%)`} />
        </linearGradient>
      </defs>
      <polygon
        points="24,2 44,13 44,35 24,46 4,35 4,13"
        fill={`url(#${gradientId})`}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        transform={rotate ? `rotate(${rotate} 24 24)` : undefined}
      />
      <text x="24" y="29" textAnchor="middle" fontSize="14" fontWeight="700" fill="#05060c">
        {tag.slice(0, 3).toUpperCase()}
      </text>
    </svg>
  );
}
