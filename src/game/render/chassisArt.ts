/**
 * Original, parametric SVG ship art for the Ships (chassis) select screen.
 * One authored silhouette per class, tinted by the chassis hue — layered hull,
 * cockpit, wing accents and engine glow, so each ship reads as a real craft
 * rather than a primitive shape. Returned as a data-URI for an <img>.
 */
export type Silhouette = "dart" | "broad" | "bulky" | "podded" | "winged";

/** Per-silhouette hull paths (viewBox 0 0 100 120, nose up). */
const HULLS: Record<Silhouette, string> = {
  // Sleek interceptor dart.
  dart: "M50 8 C58 26 60 54 58 82 L64 104 L50 96 L36 104 L42 82 C40 54 42 26 50 8 Z",
  // Balanced fighter with swept wings.
  broad:
    "M50 12 C57 30 58 52 57 74 L86 96 L72 98 L58 88 L58 100 L50 108 L42 100 L42 88 L28 98 L14 96 L43 74 C42 52 43 30 50 12 Z",
  // Heavy blocky capital hull.
  bulky:
    "M38 14 L62 14 L70 30 L70 82 L80 100 L62 96 L58 106 L42 106 L38 96 L20 100 L30 82 L30 30 Z",
  // Wide carrier with drone pods.
  podded:
    "M50 14 C56 30 57 50 56 70 L56 96 L44 96 L44 70 C43 50 44 30 50 14 Z M18 52 L30 50 L32 88 L20 90 Z M82 52 L70 50 L68 88 L80 90 Z",
  // Warded defender with side shield plates.
  winged:
    "M50 12 C56 28 57 50 56 76 L62 100 L50 94 L38 100 L44 76 C43 50 44 28 50 12 Z M24 40 L34 46 L34 92 L22 86 Z M76 40 L66 46 L66 92 L78 86 Z",
};

/** Engine-glow anchor points per silhouette (rear thrusters). */
const ENGINES: Record<Silhouette, [number, number][]> = {
  dart: [[50, 100]],
  broad: [[50, 104], [30, 96], [70, 96]],
  bulky: [[42, 104], [58, 104]],
  podded: [[50, 96], [26, 90], [74, 90]],
  winged: [[50, 98], [28, 90], [72, 90]],
};

export function chassisSvg(silhouette: Silhouette, hue: number): string {
  const light = `hsl(${hue} 85% 68%)`;
  const mid = `hsl(${hue} 62% 42%)`;
  const dark = `hsl(${hue} 55% 18%)`;
  const glow = `hsl(${(hue + 20) % 360} 100% 70%)`;
  const engines = ENGINES[silhouette]
    .map(
      ([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="6" fill="${glow}" opacity="0.9"/>` +
        `<circle cx="${x}" cy="${y + 5}" r="10" fill="url(#eg)" opacity="0.7"/>`,
    )
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120">` +
    `<defs>` +
    `<linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${light}"/><stop offset="0.5" stop-color="${mid}"/>` +
    `<stop offset="1" stop-color="${dark}"/></linearGradient>` +
    `<radialGradient id="eg" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="${glow}"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `<radialGradient id="ck" cx="0.4" cy="0.35" r="0.7">` +
    `<stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="${light}"/>` +
    `<stop offset="1" stop-color="${dark}"/></radialGradient>` +
    `</defs>` +
    engines +
    `<path d="${HULLS[silhouette]}" fill="url(#hull)" stroke="${light}" stroke-width="1.5" stroke-opacity="0.6"/>` +
    // Fuselage highlight.
    `<path d="M50 16 C54 40 54 68 52 90" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2" stroke-linecap="round"/>` +
    // Cockpit.
    `<ellipse cx="50" cy="42" rx="7" ry="11" fill="url(#ck)" stroke="${light}" stroke-width="1"/>` +
    `</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
