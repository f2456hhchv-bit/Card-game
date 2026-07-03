/**
 * Hand-inked UI art for the Journey screen — original, procedural SVG rendered
 * to data-URIs. Recreates the designed look: a marbled nebula backdrop, rough
 * "stone slab" panels with sketchy ink outlines, and hand-drawn stroke icons
 * for the tab bar. Everything is generated in-code (offline, no assets).
 */

function uri(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * The marbled nebula backdrop: deep violet base with patchy cyan + magenta
 * fractal-noise wisps (feTurbulence), like ink swirled through dark water.
 */
export function nebulaBg(): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1400'>` +
    `<defs>` +
    `<filter id='cy' x='0' y='0' width='100%' height='100%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.0028 0.0042' numOctaves='5' seed='11'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 0.10  0 0 0 0 0.80  0 0 0 0 0.88  2.1 0 0 0 -1.05'/>` +
    `</filter>` +
    `<filter id='mg' x='0' y='0' width='100%' height='100%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.0036 0.0026' numOctaves='5' seed='37'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 0.76  0 0 0 0 0.16  0 0 0 0 0.84  2.0 0 0 0 -1.1'/>` +
    `</filter>` +
    `<filter id='vi' x='0' y='0' width='100%' height='100%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.005 0.006' numOctaves='4' seed='5'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 0.24  0 0 0 0 0.10  0 0 0 0 0.42  1.1 0 0 0 -0.55'/>` +
    `</filter>` +
    `</defs>` +
    `<rect width='900' height='1400' fill='#0b0716'/>` +
    `<rect width='900' height='1400' filter='url(#vi)' opacity='0.9'/>` +
    `<rect width='900' height='1400' filter='url(#cy)' opacity='0.62'/>` +
    `<rect width='900' height='1400' filter='url(#mg)' opacity='0.55'/>` +
    `</svg>`;
  return uri(svg);
}

/** Deterministic tiny PRNG so slab wobble is stable across renders. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}


/**
 * The shared hand-drawn wavy loop: walk a rounded-rect perimeter, pushing each
 * sampled point out along its normal by a gentle sine wave plus a little jitter,
 * then smooth it with quadratics through the segment midpoints. One organic
 * squiggly outline — never a geometric box. Returns the SVG path `d`.
 */
function wavyRectPath(w: number, h: number, seed: number, amp = 2.1, wl = 34): string {
  const r = rng(seed * 2654435 + 7);
  const m = Math.max(4, Math.min(7, w * 0.05, h * 0.14));
  const rc = Math.max(8, Math.min(28, w * 0.09, h * 0.28));
  const x0 = m;
  const y0 = m;
  const x1 = w - m;
  const y1 = h - m;
  const pts: [number, number][] = [];
  let len = 0;
  const add = (x: number, y: number, nx: number, ny: number, step: number): void => {
    len += step;
    const off = Math.sin((len / wl) * Math.PI * 2) * amp + (r() - 0.5) * 1.5;
    pts.push([x + nx * off, y + ny * off]);
  };
  const edge = (ax: number, ay: number, bx: number, by: number, nx: number, ny: number): void => {
    const d = Math.hypot(bx - ax, by - ay);
    const segs = Math.max(3, Math.round(d / 12));
    for (let i = 0; i < segs; i++) {
      const t = i / segs;
      add(ax + (bx - ax) * t, ay + (by - ay) * t, nx, ny, d / segs);
    }
  };
  const corner = (cx: number, cy: number, a0: number): void => {
    const segs = 4;
    for (let i = 0; i <= segs; i++) {
      const a = a0 + (i / segs) * (Math.PI / 2);
      add(cx + Math.cos(a) * rc, cy + Math.sin(a) * rc, Math.cos(a), Math.sin(a), (rc * Math.PI) / 2 / segs);
    }
  };
  edge(x0 + rc, y0, x1 - rc, y0, 0, -1);
  corner(x1 - rc, y0 + rc, -Math.PI / 2);
  edge(x1, y0 + rc, x1, y1 - rc, 1, 0);
  corner(x1 - rc, y1 - rc, 0);
  edge(x1 - rc, y1, x0 + rc, y1, 0, 1);
  corner(x0 + rc, y1 - rc, Math.PI / 2);
  edge(x0, y1 - rc, x0, y0 + rc, -1, 0);
  corner(x0 + rc, y0 + rc, Math.PI);
  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ];
  const n = pts.length;
  let d = `M${mid(pts[n - 1], pts[0]).map((v) => v.toFixed(1)).join(",")}`;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const mp = mid(cur, pts[(i + 1) % n]);
    d += ` Q${cur[0].toFixed(1)},${cur[1].toFixed(1)} ${mp[0].toFixed(1)},${mp[1].toFixed(1)}`;
  }
  return d + " Z";
}

/**
 * A single hand-drawn neon outline sized to the element's ACTUAL pixels, so it
 * never stretches into a bulging rounded rectangle. Filled with the dark panel
 * colour and stroked once in the accent — no nested line, no geometric box.
 */
export function inkSquiggle(
  w: number,
  h: number,
  accent: string,
  seed = 1,
  fill = "rgba(13,11,26,0.9)",
): string {
  const d = wavyRectPath(w, h, seed);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
    `<path d='${d}' fill='${fill}' stroke='${accent}' stroke-width='2.4' ` +
    `stroke-linejoin='round' stroke-linecap='round'/>` +
    `</svg>`;
  return uri(svg);
}

/**
 * A neutral squiggly "stone plaque" for buttons and small tiles — the same
 * hand-drawn wavy edge as the cards (so the whole app is one squiggly language)
 * but with a soft light stroke instead of a neon accent. Fixed viewBox, stretched
 * to fit via background-size:100% 100%; kept wide-ish so buttons don't distort.
 */
export function slabSquiggle(
  seed = 1,
  fill = "rgba(16,13,30,0.94)",
  h = 66,
  stroke = "rgba(198,194,232,0.5)",
): string {
  const w = 300;
  const d = wavyRectPath(w, h, seed, 1.7, 30);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'>` +
    `<path d='${d}' fill='${fill}' stroke='#060409' stroke-width='4' stroke-linejoin='round'/>` +
    `<path d='${d}' fill='none' stroke='${stroke}' stroke-width='1.4' stroke-linejoin='round'/>` +
    `</svg>`;
  return uri(svg);
}

/** Sketchy padlock (emblem overlay + the big right-side lock on locked slabs). */
export function lockSvg(size = 34): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    // Shackle first (behind the body), light ink so it reads on dark slabs.
    `<path d="M8 11V7.6a4 4 0 0 1 8 0V11" stroke="#a7adc6" stroke-width="2.3"/>` +
    // Body with a heavy ink outline.
    `<rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2.4" fill="#5d6379" stroke="#0c0d16" stroke-width="1.8"/>` +
    `<rect x="6" y="11.8" width="12" height="7.4" rx="1.6" fill="none" stroke="rgba(220,224,240,0.25)" stroke-width="1"/>` +
    // Keyhole.
    `<circle cx="12" cy="14.6" r="1.5" fill="#12131e"/>` +
    `<path d="M12 15.6v2.4" stroke="#12131e" stroke-width="2"/>` +
    `</svg>`
  );
}

/** Hand-drawn stroke icons for the tab bar (map/swords/medal/rocket/puzzle/cart/menu). */
export function tabIcon(name: string): string {
  const open =
    `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" ` +
    `fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">`;
  const close = `</svg>`;
  switch (name) {
    case "journey": // folded map
      return (
        open +
        `<path d="M3.5 6.2 9 4.2l6 2 5.5-2v13.6L15 19.8l-6-2-5.5 2Z"/>` +
        `<path d="M9 4.2v13.6M15 6.2v13.6"/>` +
        close
      );
    case "play": // crossed swords
      return (
        open +
        `<path d="M4.5 4.5 16 16m0 0 2.6 2.6M16 16l2.2-2.2M19.5 4.5 8 16m0 0-2.6 2.6M8 16l-2.2-2.2"/>` +
        `<path d="M4 20l1.4-1.4M20 20l-1.4-1.4"/>` +
        close
      );
    case "wardens": // medal
      return (
        open +
        `<circle cx="12" cy="14.6" r="4.6"/>` +
        `<path d="m12 12.6.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3Z" stroke-width="1.1"/>` +
        `<path d="M8.4 10.8 6 3.8h4l2 4.4 2-4.4h4l-2.4 7"/>` +
        close
      );
    case "ships": // rocket
      return (
        open +
        `<path d="M12 3.2c2.8 1.8 4 4.8 4 8l-1.4 5H9.4L8 11.2c0-3.2 1.2-6.2 4-8Z"/>` +
        `<circle cx="12" cy="9.6" r="1.7"/>` +
        `<path d="M8.4 13.4 5.6 16l2.6.6M15.6 13.4 18.4 16l-2.6.6M10.6 16.8 12 20.4l1.4-3.6"/>` +
        close
      );
    case "hangar": // puzzle piece
      return (
        open +
        `<path d="M9 4.4h3.2a2 2 0 1 1 3.6 0H19v4.2a2 2 0 1 0 0 3.8v4.2h-4.2a2 2 0 1 1-3.8 0H9v-3.4a2 2 0 1 0 0-4.6Z"/>` +
        close
      );
    case "shop": // cart
      return (
        open +
        `<path d="M3.6 5h2.2l2 10.4h9.6l2-7.6H7"/>` +
        `<circle cx="9.4" cy="19" r="1.5"/><circle cx="16.4" cy="19" r="1.5"/>` +
        close
      );
    case "more": // three ink lines
      return (
        open +
        `<path d="M5 7h14M5 12h13M5 17h14" stroke-width="2.2"/>` +
        close
      );
    default:
      return open + `<circle cx="12" cy="12" r="8"/>` + close;
  }
}
