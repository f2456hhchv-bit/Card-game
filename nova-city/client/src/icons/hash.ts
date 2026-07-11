/** Small deterministic string hash — used to derive stable per-entity visuals (crests, planet glyphs) from an id. */
export function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
