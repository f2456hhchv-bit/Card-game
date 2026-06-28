/**
 * Procedural sound via the Web Audio API — every effect is synthesized at
 * runtime, so the game ships with zero audio files and zero copyright concerns.
 * Sounds are deliberately short, layered, and lightly randomized to avoid ear
 * fatigue during the dense combat of a run.
 *
 * The context is created lazily on first user gesture to satisfy browser
 * autoplay policies.
 */
export interface AudioSettings {
  master: number; // 0..1
  sfx: number;
  music: number;
  muted: boolean;
}

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer = 0;
  private lastSfxTime = new Map<string, number>();

  settings: AudioSettings = { master: 0.8, sfx: 0.9, music: 0.5, muted: false };

  /** Must be called from within a user-gesture handler at least once. */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return;
    }
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.applySettings();
    } catch {
      this.ctx = null; // Audio is optional; never let it break the game.
    }
  }

  applySettings(): void {
    if (!this.masterGain || !this.sfxGain || !this.musicGain) return;
    const m = this.settings.muted ? 0 : this.settings.master;
    this.masterGain.gain.value = m;
    this.sfxGain.gain.value = this.settings.sfx;
    this.musicGain.gain.value = this.settings.music * 0.4;
  }

  private now(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  /** Rate-limit a given sound id so bursts don't stack into noise. */
  private throttled(id: string, minGap: number): boolean {
    const t = this.now();
    const last = this.lastSfxTime.get(id) ?? -1;
    if (t - last < minGap) return true;
    this.lastSfxTime.set(id, t);
    return false;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    sweepTo?: number,
  ): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (sweepTo !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, sweepTo), t + duration);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  shoot(): void {
    if (this.throttled("shoot", 0.04)) return;
    this.tone(620 + Math.random() * 80, 0.09, "triangle", 0.18, 320);
  }

  hit(): void {
    if (this.throttled("hit", 0.02)) return;
    this.tone(180 + Math.random() * 40, 0.06, "square", 0.08, 90);
  }

  kill(): void {
    if (this.throttled("kill", 0.03)) return;
    this.tone(300, 0.12, "sawtooth", 0.1, 120);
  }

  playerHurt(): void {
    this.tone(140, 0.25, "sawtooth", 0.25, 60);
  }

  levelUp(): void {
    this.tone(523, 0.12, "sine", 0.22);
    setTimeout(() => this.tone(784, 0.18, "sine", 0.22), 90);
  }

  pickup(): void {
    if (this.throttled("pickup", 0.03)) return;
    this.tone(880, 0.05, "sine", 0.08, 1200);
  }

  select(): void {
    this.tone(660, 0.08, "sine", 0.2, 880);
  }

  bomb(): void {
    this.tone(110, 0.5, "sawtooth", 0.35, 40);
  }

  gameOver(): void {
    this.tone(330, 0.4, "sine", 0.25, 110);
    setTimeout(() => this.tone(220, 0.6, "sine", 0.25, 80), 200);
  }

  /** Ominous low swell when a boss appears. */
  bossWarn(): void {
    this.tone(70, 0.7, "sawtooth", 0.32, 50);
    setTimeout(() => this.tone(90, 0.6, "square", 0.18, 70), 180);
  }

  /** Triumphant flourish when a boss falls. */
  bossDown(): void {
    this.tone(440, 0.15, "sine", 0.26);
    setTimeout(() => this.tone(660, 0.18, "sine", 0.26), 110);
    setTimeout(() => this.tone(880, 0.3, "sine", 0.26), 240);
  }

  /** Sparse ambient pulse, advanced from the render loop. */
  updateMusic(frameDt: number, intensity: number): void {
    if (!this.ctx || !this.musicGain || this.settings.muted) return;
    this.musicTimer -= frameDt;
    if (this.musicTimer > 0) return;
    this.musicTimer = Math.max(0.5, 1.6 - intensity * 0.8);
    const base = 110;
    const notes = [base, base * 1.5, base * 1.25, base * 2];
    const f = notes[Math.floor(Math.random() * notes.length)];
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    osc.connect(g);
    g.connect(this.musicGain);
    osc.start(t);
    osc.stop(t + 1.5);
  }
}
