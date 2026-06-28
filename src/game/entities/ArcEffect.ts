/**
 * A single segment of chain-lightning, drawn as a short-lived jagged bolt
 * between two points. Purely cosmetic and pooled — the damage is applied
 * instantly by the WeaponSystem when the chain resolves; these just visualise
 * where it leapt.
 */
export class ArcEffect {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  life = 0;
  maxLife = 0.16;
  hue = 190;
  active = false;

  reset(): void {
    this.active = false;
  }
}
