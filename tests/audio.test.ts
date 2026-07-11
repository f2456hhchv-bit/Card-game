import { describe, expect, it } from "vitest";
import { AudioMixer } from "../src/game/audio/AudioMixer";
import { VoicePool } from "../src/game/audio/VoicePool";
import { AudioEngine, NullAudioBackend, createSandboxAudioEngine } from "../src/game/audio/AudioEngine";
import { distanceAttenuation, resolveMusicState } from "../src/game/audio/MusicState";
import { AUDIO_CATEGORIES, AUDIO_CHANNELS, MUSIC_STATES, SANDBOX_AUDIO_CUES } from "../src/game/audio/audioData";
import { DEFAULT_SETTINGS } from "../src/core/save/settingsData";

describe("AudioMixer — Mixing (AF-045 §Mixing)", () => {
  it("registers all seven audio channels", () => {
    expect(AUDIO_CHANNELS.length).toBe(7);
  });

  it("defaults every channel to full volume, unmuted", () => {
    const mixer = new AudioMixer();
    for (const channel of AUDIO_CHANNELS) {
      expect(mixer.getVolume(channel)).toBe(1);
      expect(mixer.isMuted(channel)).toBe(false);
    }
  });

  it("clamps volume to [0, 1]", () => {
    const mixer = new AudioMixer();
    mixer.setVolume("music", 5);
    expect(mixer.getVolume("music")).toBe(1);
    mixer.setVolume("music", -5);
    expect(mixer.getVolume("music")).toBe(0);
  });

  it("effective volume scales a channel by master", () => {
    const mixer = new AudioMixer();
    mixer.setVolume("master", 0.5);
    mixer.setVolume("music", 0.5);
    expect(mixer.effectiveVolume("music")).toBeCloseTo(0.25, 5);
  });

  it("muting master silences every channel regardless of its own volume", () => {
    const mixer = new AudioMixer();
    mixer.setMuted("master", true);
    expect(mixer.effectiveVolume("music")).toBe(0);
    expect(mixer.effectiveVolume("effects")).toBe(0);
  });

  it("muting a single channel only silences that channel", () => {
    const mixer = new AudioMixer();
    mixer.setMuted("ui", true);
    expect(mixer.effectiveVolume("ui")).toBe(0);
    expect(mixer.effectiveVolume("music")).toBeGreaterThan(0);
  });

  it("fromSettings seeds all seven channels from AF-044's three-slider settings", () => {
    const mixer = AudioMixer.fromSettings(DEFAULT_SETTINGS.audio);
    expect(mixer.getVolume("master")).toBe(DEFAULT_SETTINGS.audio.masterVolume);
    expect(mixer.getVolume("music")).toBe(DEFAULT_SETTINGS.audio.musicVolume);
    expect(mixer.getVolume("effects")).toBe(DEFAULT_SETTINGS.audio.sfxVolume);
    expect(mixer.isMuted("master")).toBe(DEFAULT_SETTINGS.audio.muted);
  });
});

describe("VoicePool — Priority Mixing / limited simultaneous voices (AF-045 §Positional Audio / §Performance)", () => {
  it("grants a voice while under the cap", () => {
    const pool = new VoicePool(2);
    expect(pool.requestVoice("enemies", "a", 1)).not.toBeNull();
    expect(pool.activeVoiceCount("enemies")).toBe(1);
  });

  it("drops a new low-priority request once the category is full of equal-or-higher priority voices", () => {
    const pool = new VoicePool(1);
    pool.requestVoice("enemies", "a", 5);
    expect(pool.requestVoice("enemies", "b", 5)).toBeNull();
    expect(pool.activeVoiceCount("enemies")).toBe(1);
  });

  it("evicts the lowest-priority voice for a strictly higher-priority request", () => {
    const pool = new VoicePool(1);
    pool.requestVoice("player", "low", 1);
    const granted = pool.requestVoice("player", "high", 10);
    expect(granted).not.toBeNull();
    expect(pool.activeVoiceCount("player")).toBe(1);
  });

  it("release frees a slot for a future request", () => {
    const pool = new VoicePool(1);
    const voiceId = pool.requestVoice("player", "a", 1)!;
    pool.release("player", voiceId);
    expect(pool.activeVoiceCount("player")).toBe(0);
    expect(pool.requestVoice("player", "b", 1)).not.toBeNull();
  });

  it("tracks voice counts per category independently", () => {
    const pool = new VoicePool(4);
    pool.requestVoice("enemies", "a", 1);
    pool.requestVoice("player", "b", 1);
    expect(pool.activeVoiceCount("enemies")).toBe(1);
    expect(pool.activeVoiceCount("player")).toBe(1);
    expect(pool.activeVoiceCount()).toBe(2);
  });
});

describe("AudioEngine — cue routing (AF-045 §Weapon/Enemy/Boss/UI Audio)", () => {
  it("registers all nineteen Audio Categories", () => {
    expect(AUDIO_CATEGORIES.length).toBe(19);
  });

  it("every sandbox cue's category and channel are registered vocabulary", () => {
    for (const cue of SANDBOX_AUDIO_CUES) {
      expect(AUDIO_CATEGORIES).toContain(cue.category);
      expect(AUDIO_CHANNELS).toContain(cue.channel);
    }
  });

  it("playing a known cue claims a voice and reaches the backend", () => {
    const backend = new NullAudioBackend();
    const engine = createSandboxAudioEngine(new AudioMixer(), backend);
    expect(engine.play("cue-critical-hit")).toBe(true);
    expect(backend.playedCues).toContain("cue-critical-hit");
  });

  it("playing an unknown cue id is a safe no-op", () => {
    const backend = new NullAudioBackend();
    const engine = createSandboxAudioEngine(new AudioMixer(), backend);
    expect(engine.play("cue-does-not-exist")).toBe(false);
    expect(backend.playedCues.length).toBe(0);
  });

  it("a muted channel never even claims a voice", () => {
    const mixer = new AudioMixer();
    mixer.setMuted("notifications", true);
    const backend = new NullAudioBackend();
    const engine = createSandboxAudioEngine(mixer, backend);
    expect(engine.play("cue-legendary-drop")).toBe(false);
    expect(engine.activeVoiceCount()).toBe(0);
  });

  it("setMusicState is idempotent — reapplying the same state never re-triggers the backend", () => {
    const backend = new NullAudioBackend();
    const engine = new AudioEngine([], new AudioMixer(), backend);
    engine.setMusicState("combat");
    engine.setMusicState("combat");
    expect(backend.currentMusicTrack).toBe("combat");
    expect(engine.musicState).toBe("combat");
  });
});

describe("resolveMusicState — Adaptive Music (AF-045 §Adaptive Music)", () => {
  it("registers all fourteen Adaptive Music states", () => {
    expect(MUSIC_STATES.length).toBe(14);
  });

  it("resolves to galaxyCommand outside Gameplay", () => {
    expect(resolveMusicState({ gameState: "GalaxyCommand", directorPhase: null, bossActive: false, bossPhase: null, runResult: null })).toBe("galaxyCommand");
  });

  it("resolves to exploration during Gameplay with no Director pressure", () => {
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "LightContact", bossActive: false, bossPhase: null, runResult: null })).toBe("combat");
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: null, bossActive: false, bossPhase: null, runResult: null })).toBe("exploration");
  });

  it("escalates through heavyCombat and eliteEncounter with Director phase", () => {
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "HeavyCombat", bossActive: false, bossPhase: null, runResult: null })).toBe("heavyCombat");
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "ElitePressure", bossActive: false, bossPhase: null, runResult: null })).toBe("eliteEncounter");
  });

  it("a boss fight overrides Director phase, distinguishing introduction from later phases", () => {
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "HeavyCombat", bossActive: true, bossPhase: 1, runResult: null })).toBe("bossIntroduction");
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "HeavyCombat", bossActive: true, bossPhase: 2, runResult: null })).toBe("bossPhase");
  });

  it("GP-002: phase 3 (Chaos) and phase 4+ (Signature) each get their own distinct cue, not the shared bossPhase state", () => {
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "HeavyCombat", bossActive: true, bossPhase: 3, runResult: null })).toBe("bossPhaseChaos");
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "HeavyCombat", bossActive: true, bossPhase: 4, runResult: null })).toBe("bossPhaseSignature");
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "HeavyCombat", bossActive: true, bossPhase: 5, runResult: null })).toBe("bossPhaseSignature"); // any further phase stays Signature
  });

  it("a run result always wins, regardless of any other input", () => {
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: "ElitePressure", bossActive: true, bossPhase: 2, runResult: "victory" })).toBe("victory");
    expect(resolveMusicState({ gameState: "Gameplay", directorPhase: null, bossActive: false, bossPhase: null, runResult: "defeat" })).toBe("defeat");
  });
});

describe("distanceAttenuation — Positional Audio (AF-045 §Positional Audio)", () => {
  it("is 1 at zero distance", () => {
    expect(distanceAttenuation(0, 100)).toBe(1);
  });

  it("is 0 at or beyond max distance", () => {
    expect(distanceAttenuation(100, 100)).toBe(0);
    expect(distanceAttenuation(150, 100)).toBe(0);
  });

  it("falls off linearly between the endpoints", () => {
    expect(distanceAttenuation(50, 100)).toBeCloseTo(0.5, 5);
  });

  it("never returns a value outside [0, 1]", () => {
    for (let distance = -50; distance <= 200; distance += 10) {
      const value = distanceAttenuation(distance, 100);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});

describe("Audio Framework — self-review: thousands of cue/voice cycles stay consistent", () => {
  it("survives a long sweep of cue playback and voice pool pressure without exceeding the cap", () => {
    const pool = new VoicePool(4);
    const rng = (seed: number) => (seed * 9301 + 49297) % 233280;
    let seed = 7;
    for (let cycle = 0; cycle < 5000; cycle += 1) {
      seed = rng(seed);
      const priority = seed % 10;
      pool.requestVoice("enemies", `cue-${cycle}`, priority);
      expect(pool.activeVoiceCount("enemies")).toBeLessThanOrEqual(4);
    }
  });

  it("every sandbox cue can be played through a full engine without throwing", () => {
    const backend = new NullAudioBackend();
    const engine = createSandboxAudioEngine(AudioMixer.fromSettings(DEFAULT_SETTINGS.audio), backend);
    for (const cue of SANDBOX_AUDIO_CUES) {
      expect(() => engine.play(cue.id)).not.toThrow();
    }
    expect(backend.playedCues.length).toBe(SANDBOX_AUDIO_CUES.length);
  });
});
