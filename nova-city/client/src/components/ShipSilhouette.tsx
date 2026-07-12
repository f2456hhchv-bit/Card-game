import { hashString } from '../icons/hash';
import type { HullClass } from '../types';

const HULL_PATHS: Record<HullClass, string> = {
  scout: 'M20 2 L26 16 L20 34 L14 16 Z M11 20 L20 24 L11 26 Z M29 20 L20 24 L29 26 Z',
  frigate: 'M20 1 L27 14 L27 30 L20 38 L13 30 L13 14 Z M6 19 L13 17 L13 27 L6 24 Z M34 19 L27 17 L27 27 L34 24 Z',
  cruiser:
    'M20 1 L29 12 L29 30 L23 38 L17 38 L11 30 L11 12 Z M4 16 L11 14 L11 28 L4 25 Z M36 16 L29 14 L29 28 L36 25 Z M17 8 L23 8 L23 14 L17 14 Z',
  dreadnought:
    'M20 0 L31 10 L33 32 L26 39 L14 39 L7 32 L9 10 Z M1 14 L9 12 L9 30 L1 27 Z M39 14 L31 12 L31 30 L39 27 Z M15 6 L25 6 L25 13 L15 13 Z M13 30 L27 30 L27 35 L13 35 Z',
};

const HULL_ACCENT_COUNT: Record<HullClass, number> = { scout: 0, frigate: 1, cruiser: 2, dreadnought: 4 };

/** A deterministic per-ship silhouette — distinct shape by hull class, distinct hue by ship id, so a fleet roster reads at a glance. */
export function ShipSilhouette({
  seed,
  hullClass,
  size = 36,
}: {
  seed: string;
  hullClass: HullClass;
  size?: number;
}) {
  const h = hashString(seed);
  const hue = (h + 200) % 360;
  const accentCount = HULL_ACCENT_COUNT[hullClass];

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="ship-silhouette" aria-hidden="true">
      <path
        d={HULL_PATHS[hullClass]}
        fill={`hsl(${hue} 45% 42%)`}
        stroke={`hsl(${hue} 70% 72%)`}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {Array.from({ length: accentCount }).map((_, i) => (
        <circle
          key={i}
          cx={16 + i * 3}
          cy={20 + ((h >> (i * 2)) % 6) - 3}
          r="1"
          fill={`hsl(${(hue + 150) % 360} 90% 70%)`}
        />
      ))}
    </svg>
  );
}
