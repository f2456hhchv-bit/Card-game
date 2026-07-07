/**
 * Audio Engine (AF-045): the orchestrator tying cue lookup, the Voice Pool,
 * the Mixer, and Adaptive Music transitions together behind a swappable
 * `AudioBackend` — the same pluggable-interface pattern AF-024's
 * `SaveStorage` already established (a real backend slots in later with
 * zero changes to any caller). No audio asset pipeline exists yet, so the
 * only backend today is `NullAudioBackend`, which records what *would*
 * have played — honest, not faked.
 */
import { AudioMixer } from "./AudioMixer";
import { VoicePool } from "./VoicePool";
import { SANDBOX_AUDIO_CUES, type AudioCueDef, type MusicState } from "./audioData";

export interface AudioBackend {
  play(cueId: string, volume: number): void;
  setMusicTrack(state: MusicState | null): void;
  stopAll(): void;
}

/** Records intent without producing sound — stands in until real assets exist. */
export class NullAudioBackend implements AudioBackend {
  readonly playedCues: string[] = [];
  currentMusicTrack: MusicState | null = null;

  play(cueId: string): void {
    this.playedCues.push(cueId);
  }

  setMusicTrack(state: MusicState | null): void {
    this.currentMusicTrack = state;
  }

  stopAll(): void {
    this.playedCues.length = 0;
    this.currentMusicTrack = null;
  }
}

export class AudioEngine {
  private readonly voicePool: VoicePool;
  private currentMusicState: MusicState | null = null;

  constructor(
    private readonly cues: readonly AudioCueDef[],
    private readonly mixer: AudioMixer,
    private readonly backend: AudioBackend,
    maxVoicesPerCategory = 8,
  ) {
    this.voicePool = new VoicePool(maxVoicesPerCategory);
  }

  findCue(cueId: string): AudioCueDef | null {
    return this.cues.find((c) => c.id === cueId) ?? null;
  }

  /** Returns true if the cue actually claimed a voice and played. */
  play(cueId: string): boolean {
    const cue = this.findCue(cueId);
    if (!cue) return false;
    const volume = this.mixer.effectiveVolume(cue.channel);
    if (volume <= 0) return false; // muted — never even claims a voice
    const voiceId = this.voicePool.requestVoice(cue.category, cue.id, cue.priority);
    if (!voiceId) return false; // dropped by Priority Mixing
    this.backend.play(cue.id, volume);
    return true;
  }

  setMusicState(state: MusicState): void {
    if (state === this.currentMusicState) return; // seamless — no redundant retrigger
    this.currentMusicState = state;
    this.backend.setMusicTrack(state);
  }

  get musicState(): MusicState | null {
    return this.currentMusicState;
  }

  activeVoiceCount(): number {
    return this.voicePool.activeVoiceCount();
  }
}

export function createSandboxAudioEngine(mixer: AudioMixer, backend: AudioBackend): AudioEngine {
  return new AudioEngine(SANDBOX_AUDIO_CUES, mixer, backend);
}
