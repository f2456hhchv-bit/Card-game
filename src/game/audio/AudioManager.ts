/**
 * Procedural sound via the Web Audio API — every effect and every note of
 * music is synthesized at runtime, so the game ships with zero audio files and
 * zero copyright concerns.
 *
 * Architecture: master bus (soft compressor) → { sfx bus, music bus }. The
 * music bus feeds a feedback delay "space echo" send so plucks bloom into the
 * void. Music itself is generative: a slow minor-key chord progression played
 * as detuned pads over a sub bass, with an arpeggio layer whose density rides
 * the battlefield intensity — and a darker, faster variant while a boss holds
 * the field.
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

/** midi → Hz. */
function mtof(m: number): number {
  return 440 * Math.pow(2, (m - 69) / 12);
}

/** Chord progressions as midi-note stacks (root first). A minor home key. */
const CALM_PROGRESSION: number[][] = [
  [57, 60, 64], // Am
  [53, 57, 60], // F
  [60, 64, 67], // C
  [55, 59, 62], // G
];
const BOSS_PROGRESSION: number[][] = [
  [57, 60, 64], // Am
  [59, 62, 65], // B°
  [56, 60, 63], // G#°/E colour — the dread lean
  [53, 56, 60], // Fm — borrowed darkness
];

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private delaySend: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private lastSfxTime = new Map<string, number>();

  // Generative music state.
  private barTimer = 0;
  private arpTimer = 0;
  private chordIndex = 0;
  private bossMode = false;

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
      // Soft-knee compressor keeps dense combat from clipping into crunch.
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 12;
      this.compressor.ratio.value = 3;
      this.compressor.attack.value = 0.004;
      this.compressor.release.value = 0.24;
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // Space echo for the music layer: filtered feedback delay.
      const delay = this.ctx.createDelay(1.0);
      delay.delayTime.value = 0.375;
      const fb = this.ctx.createGain();
      fb.gain.value = 0.34;
      const damp = this.ctx.createBiquadFilter();
      damp.type = "lowpass";
      damp.frequency.value = 1800;
      this.delaySend = this.ctx.createGain();
      this.delaySend.gain.value = 0.5;
      this.delaySend.connect(delay);
      delay.connect(damp);
      damp.connect(fb);
      fb.connect(delay);
      damp.connect(this.musicGain);

      // Shared white-noise buffer for percussive/textural SFX.
      const len = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

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

  /** Filtered noise burst — the crunch/air layer under impacts and blasts. */
  private noise(
    duration: number,
    gain: number,
    freq: number,
    q = 1,
    sweepTo?: number,
    type: BiquadFilterType = "bandpass",
  ): void {
    if (!this.ctx || !this.sfxGain || !this.noiseBuffer) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (sweepTo !== undefined) f.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), t + duration);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxGain);
    src.start(t, Math.random());
    src.stop(t + duration + 0.02);
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
    this.noise(0.07, 0.05, 900, 1.4, 300);
  }

  playerHurt(): void {
    this.tone(140, 0.25, "sawtooth", 0.25, 60);
    this.noise(0.16, 0.16, 500, 0.8, 140);
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
    this.tone(55, 0.55, "sine", 0.4, 30); // sub thump
    this.noise(0.5, 0.3, 2400, 0.7, 120, "lowpass");
  }

  gameOver(): void {
    this.tone(330, 0.4, "sine", 0.25, 110);
    setTimeout(() => this.tone(220, 0.6, "sine", 0.25, 80), 200);
  }

  /** Ominous low swell + rising air when a boss appears. */
  bossWarn(): void {
    this.tone(70, 0.7, "sawtooth", 0.32, 50);
    this.noise(0.9, 0.12, 220, 2.2, 1600);
    setTimeout(() => this.tone(90, 0.6, "square", 0.18, 70), 180);
  }

  /** Triumphant flourish when a boss falls. */
  bossDown(): void {
    this.tone(440, 0.15, "sine", 0.26);
    this.noise(0.45, 0.1, 3200, 1.2, 6400);
    setTimeout(() => this.tone(660, 0.18, "sine", 0.26), 110);
    setTimeout(() => this.tone(880, 0.3, "sine", 0.26), 240);
  }

  /** Grand rising fanfare when a weapon evolves. */
  evolveFanfare(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      setTimeout(() => {
        this.tone(f, 0.22, "triangle", 0.22);
        this.tone(f * 1.005, 0.22, "sine", 0.12);
      }, i * 80);
    });
  }

  /** Darker, faster musical mode while a boss commands the field. */
  setBossMode(active: boolean): void {
    if (this.bossMode === active) return;
    this.bossMode = active;
    this.barTimer = 0; // re-harmonise on the next tick
    this.chordIndex = 0;
  }

  // ---- Generative music ----------------------------------------------------

  /**
   * Advance the generative score (called from the render loop while playing).
   * `intensity` 0..1 (battlefield pressure) drives arp density, filter
   * brightness and shimmer probability, so the music breathes with the fight.
   */
  updateMusic(frameDt: number, intensity: number): void {
    if (!this.ctx || !this.musicGain || this.settings.muted) return;

    this.barTimer -= frameDt;
    if (this.barTimer <= 0) {
      const barLen = this.bossMode ? 5 : 7.5;
      this.barTimer += barLen;
      const prog = this.bossMode ? BOSS_PROGRESSION : CALM_PROGRESSION;
      const chord = prog[this.chordIndex % prog.length];
      this.chordIndex++;
      this.playPad(chord, barLen, intensity);
      this.playBass(chord[0], barLen);
    }

    this.arpTimer -= frameDt;
    if (this.arpTimer <= 0) {
      const base = this.bossMode ? 0.5 : 0.9;
      const min = this.bossMode ? 0.2 : 0.28;
      this.arpTimer += Math.max(min, base - intensity * 0.55) * (0.85 + Math.random() * 0.3);
      const prog = this.bossMode ? BOSS_PROGRESSION : CALM_PROGRESSION;
      const chord = prog[(this.chordIndex + prog.length - 1) % prog.length];
      this.playPluck(chord, intensity);
    }
  }

  /** Two detuned triangles per chord tone through a lowpass — the pad bed. */
  private playPad(chord: number[], barLen: number, intensity: number): void {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500 + intensity * 900;
    filter.connect(this.musicGain);
    for (const m of chord) {
      for (const detune of [-6, 6]) {
        const osc = this.ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = mtof(m);
        osc.detune.value = detune;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 1.4);
        g.gain.setValueAtTime(0.045, t + barLen - 1.2);
        g.gain.linearRampToValueAtTime(0.0001, t + barLen + 0.4);
        osc.connect(g);
        g.connect(filter);
        osc.start(t);
        osc.stop(t + barLen + 0.5);
      }
    }
  }

  /** Sub-octave sine root under each bar. */
  private playBass(rootMidi: number, barLen: number): void {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = mtof(rootMidi - 24);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(this.bossMode ? 0.16 : 0.11, t + 0.6);
    g.gain.setValueAtTime(this.bossMode ? 0.16 : 0.11, t + barLen - 0.8);
    g.gain.linearRampToValueAtTime(0.0001, t + barLen + 0.2);
    osc.connect(g);
    g.connect(this.musicGain);
    osc.start(t);
    osc.stop(t + barLen + 0.3);
  }

  /** A single arp pluck: chord tone an octave up, echoing into the delay. */
  private playPluck(chord: number[], intensity: number): void {
    if (!this.ctx || !this.delaySend || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const midi = chord[Math.floor(Math.random() * chord.length)] + 12 * (1 + (Math.random() < 0.3 ? 1 : 0));
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = mtof(midi);
    osc.detune.value = (Math.random() - 0.5) * 8;
    const g = this.ctx.createGain();
    const vel = 0.05 + Math.random() * 0.045 + intensity * 0.02;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(g);
    g.connect(this.musicGain);
    g.connect(this.delaySend);
    osc.start(t);
    osc.stop(t + 0.45);
  }
}
