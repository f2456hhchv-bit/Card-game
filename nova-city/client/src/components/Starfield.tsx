import { hashString } from '../icons/hash';

/** Deterministic pseudo-random stream seeded from a string — same shape as the rest of the procedural-art system. */
function seededStream(seed: string) {
  let state = hashString(seed) || 1;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * A full-bleed procedural starfield with a couple of soft nebula blobs — decorative
 * backdrop for the auth screens. Absolutely positioned; the caller needs
 * `position: relative; overflow: hidden` and a z-indexed foreground.
 */
export function Starfield({ seed = 'nova-city-starfield', density = 90 }: { seed?: string; density?: number }) {
  const rand = seededStream(seed);
  const stars = Array.from({ length: density }, (_, i) => ({
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    r: 0.3 + rand() * 1.1,
    opacity: 0.25 + rand() * 0.65,
  }));
  const nebulaHues = [200, 280, 330];

  return (
    <svg className="starfield" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {nebulaHues.map((hue, i) => (
          <radialGradient key={hue} id={`nebula-${seed}-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`hsl(${hue} 80% 55%)`} stopOpacity="0.16" />
            <stop offset="100%" stopColor={`hsl(${hue} 80% 55%)`} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {nebulaHues.map((hue, i) => (
        <ellipse
          key={hue}
          cx={20 + i * 30 + (rand() * 10 - 5)}
          cy={15 + i * 25}
          rx={38}
          ry={30}
          fill={`url(#nebula-${seed}-${i})`}
        />
      ))}
      {stars.map((s) => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="#e8f2ff" opacity={s.opacity} />
      ))}
    </svg>
  );
}
