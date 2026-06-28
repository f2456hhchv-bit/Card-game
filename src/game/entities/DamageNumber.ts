/**
 * Floating combat text. Cosmetic and pooled. Renders the damage dealt, rising
 * and fading. Crits are larger and tinted. Aggregating numbers keeps the
 * screen readable even when hit counts are very high.
 */
export class DamageNumber {
  x = 0;
  y = 0;
  vy = -40;
  life = 0;
  maxLife = 0.7;
  value = 0;
  crit = false;
  active = false;

  reset(): void {
    this.active = false;
  }
}
