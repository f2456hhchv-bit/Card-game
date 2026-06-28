/**
 * Lightweight visual particle (sparks, death bursts, muzzle flashes). Purely
 * cosmetic — never affects simulation — so it lives outside the fixed-step
 * world and is updated with real frame time for smoothness. Pooled.
 */
export type ParticleShape = "spark" | "ring" | "dot" | "smoke";

export class Particle {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  life = 0;
  maxLife = 0.5;
  size = 3;
  hue = 210;
  alpha = 1;
  drag = 0.9;
  shape: ParticleShape = "spark";
  active = false;

  reset(): void {
    this.active = false;
  }
}
