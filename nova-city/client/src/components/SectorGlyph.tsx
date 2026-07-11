import { hashString } from '../icons/hash';

const DANGER_HUE = 355;
const CLEAR_HUE = 175;

/**
 * A per-sector glyph that reads at a glance: fogged/unknown until scouted,
 * then color-shifts from reclaimed cyan (cleared) to Hollow-red (heavily
 * infested) based on `presence` (0..1 of max alien strength).
 */
export function SectorGlyph({ seed, presence, size = 36 }: { seed: string; presence: number | null; size?: number }) {
  const h = hashString(seed);
  const ringHue = h % 360;

  if (presence === null) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" className="sector-glyph sector-glyph-fog" aria-hidden="true">
        <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(139,147,184,0.5)" strokeWidth="1.4" strokeDasharray="3 3" />
        <text x="20" y="25" textAnchor="middle" fontSize="14" fill="rgba(139,147,184,0.7)">
          ?
        </text>
      </svg>
    );
  }

  const clamped = Math.max(0, Math.min(1, presence));
  const hue = CLEAR_HUE + (DANGER_HUE - CLEAR_HUE) * clamped;
  const glow = 0.3 + clamped * 0.5;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="sector-glyph" aria-hidden="true">
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="4.2"
        fill="none"
        stroke={`hsl(${ringHue} 50% 55%)`}
        strokeWidth="1"
        opacity="0.3"
        transform="rotate(-16 20 20)"
      />
      <circle cx="20" cy="20" r="10" fill={`hsl(${hue} 65% ${Math.round(45 - clamped * 10)}%)`} />
      <circle cx="20" cy="20" r="10" fill="none" stroke={`hsl(${hue} 80% 70%)`} strokeWidth="0.8" opacity={glow} />
      {clamped > 0.05 && (
        <circle cx="20" cy="20" r="13" fill="none" stroke={`hsl(${hue} 90% 60%)`} strokeWidth="1" opacity={glow * 0.5} />
      )}
      {clamped <= 0.02 && <circle cx={16} cy={16} r="2.6" fill={`hsl(${hue} 70% 75%)`} opacity="0.4" />}
    </svg>
  );
}
