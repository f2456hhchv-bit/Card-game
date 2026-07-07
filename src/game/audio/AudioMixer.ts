/**
 * Audio Mixer (AF-045 §Mixing): seven independent channels, each 0–1 plus
 * an independent mute flag — Priority Mixing itself lives in `VoicePool`,
 * not here. `fromSettings` maps AF-044's existing three-slider audio
 * settings (master/music/sfx) onto these seven channels rather than
 * inventing a second, competing volume store; UI/Ambient/Voice/
 * Notifications default from the sfx slider until dedicated sliders exist.
 */
import type { SettingsData } from "../../core/save/settingsData";
import { AUDIO_CHANNELS, type AudioChannel } from "./audioData";

export class AudioMixer {
  private readonly volumes = new Map<AudioChannel, number>(AUDIO_CHANNELS.map((c) => [c, 1]));
  private readonly muted = new Set<AudioChannel>();

  setVolume(channel: AudioChannel, value: number): void {
    this.volumes.set(channel, Math.min(1, Math.max(0, value)));
  }

  getVolume(channel: AudioChannel): number {
    return this.volumes.get(channel) ?? 1;
  }

  setMuted(channel: AudioChannel, muted: boolean): void {
    if (muted) this.muted.add(channel);
    else this.muted.delete(channel);
  }

  isMuted(channel: AudioChannel): boolean {
    return this.muted.has(channel) || this.muted.has("master");
  }

  /** The effective, audible volume for a non-master channel — its own
   * volume scaled by master, zeroed if either is muted. */
  effectiveVolume(channel: AudioChannel): number {
    if (this.isMuted(channel)) return 0;
    if (channel === "master") return this.getVolume("master");
    return this.getVolume(channel) * this.getVolume("master");
  }

  /** Re-applies AF-044's settings onto this same instance — callers keep
   * one long-lived AudioEngine/AudioMixer pair rather than reconstructing
   * the engine whenever a settings slider changes. */
  syncFromSettings(audio: SettingsData["audio"]): void {
    this.setVolume("master", audio.masterVolume);
    this.setVolume("music", audio.musicVolume);
    for (const channel of ["effects", "voice", "ui", "ambient", "notifications"] as const) {
      this.setVolume(channel, audio.sfxVolume);
    }
    this.setMuted("master", audio.muted);
  }

  static fromSettings(audio: SettingsData["audio"]): AudioMixer {
    const mixer = new AudioMixer();
    mixer.syncFromSettings(audio);
    return mixer;
  }
}
