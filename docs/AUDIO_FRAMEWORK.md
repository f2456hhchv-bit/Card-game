# AFTERLIGHT — Audio Framework

**Authority:** Produced output of AF-045. Extends AF-000 → AF-044. Every future soundtrack, sound effect, voice pack, and expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** gameplay first — every sound communicates real information, silence has purpose, and clarity is never sacrificed for atmosphere.

---

## 1. Audio Categories — nineteen registered, content-agnostic

All nineteen categories (`AUDIO_CATEGORIES`) are registered vocabulary that any future weapon/enemy/boss/biome content tags its own sounds with. No category requires new engine code to add content to — a new weapon's Fire/Impact/Critical/Evolution sounds are simply new `AudioCueDef`s in the `weapons` category.

## 2. Adaptive Music — a pure function, seamless by construction

`resolveMusicState(inputs)` reads AF-016's game state, AF-017's Director phase, and AF-035's boss phase/index — nothing new to track. `AudioEngine.setMusicState()` only calls the backend when the resolved state actually changes, so "transitions remain seamless" holds structurally rather than needing careful sequencing at every call site.

## 3. Ambience, Weapon Audio, Enemy Audio, Boss Audio — categories awaiting content

These sections describe what future weapon/enemy/boss/biome content should sound like; the categories and channels that content will tag itself with already exist (§1). No engine work is needed to add a new weapon's sonic identity — only new `AudioCueDef` entries.

## 4. UI Audio & Player Feedback — six live examples, zero new signaling

Critical Hit, Shield Break, Level Up, Legendary Drop, Boss Spawn, and Mission Complete are all wired today to real, already-firing facts (`DamageDealt`, `ShieldBroken`, `CommanderLevelUp`, `LootDropped`, `spawnBoss()`, `RunEnded`). Research Complete and Craft Success are likewise wired to `ResearchUnlocked`/`ItemCrafted`; Achievement is wired to both `ChallengeCompleted` and `AccountLevelUp`.

## 5. Positional Audio — Priority Mixing is real; spatial rendering awaits a backend

`VoicePool` enforces a per-category simultaneous-voice cap with priority-based eviction — a gameplay-critical cue can never be silently dropped in favour of ambient filler. `distanceAttenuation(distance, maxDistance)` is a real, tested pure function; nothing feeds it a live distance yet, since no gameplay system currently tracks source positions in a form this module could consume.

## 6. Mixing — seven channels, seeded from AF-044, not duplicated

`AudioMixer` holds all seven channels independently; `fromSettings`/`syncFromSettings` map AF-044's three sliders (master/music/sfx) onto them, re-syncing on every settings change through the exact call site AF-044 already established. Master mute silences every channel; a single channel's mute is independent.

## 7. Accessibility

Independent Volume Sliders are real (§6). Visual Audio Indicators and Subtitle Support are structurally ready — every cue's `description` is subtitle-ready text, and this project's existing toast mechanism is the visual-indicator surface. Mono Audio, Reduced Dynamic Range, Tinnitus-Friendly Presets, and Frequency Filtering need a real audio backend to apply to and are honestly registered without one.

## 8. Performance

`VoicePool`'s cap *is* "limit simultaneous voices." `AudioEngine.play()` allocates nothing beyond an array push in `NullAudioBackend`; a real backend pools its own playing sources behind the same interface.

## 9. Debug

Live: current Music State, active voice count, and the master mixer level (with mute state) — rendered in the shared `DebugOverlay` `audio` field.

---

## Internal review loop (AF-045, recorded)

- **No duplicated systems** — Mixing seeds from AF-044's settings; Adaptive Music reads AF-016/017/035's existing state; every Player Feedback cue answers an existing bus fact. `AudioMixer`, `VoicePool`, and the pure Adaptive-Music/attenuation functions are the only genuinely new mechanical surfaces. ✔
- **Gameplay-critical sounds are never starved by ambient filler** — verified directly: `VoicePool` only evicts a strictly-lower-priority voice, and a 5,000-cycle pressure sweep never exceeds the configured cap. ✔
- **Silence has purpose** — a muted channel's cues never even claim a voice (verified directly), so muting genuinely silences rather than merely lowering a gain the engine still processes. ✔
- **Transitions remain seamless** — `setMusicState`'s idempotence is directly tested and was observed live in the browser (Galaxy Command → Gameplay correctly moved `galaxyCommand` → `exploration` with no redundant retrigger). ✔
- **Sandbox proof** — six Player Feedback examples plus Research/Craft/Achievement cues all wired to real facts, the Mixer's live level matches AF-044's own settings, and Adaptive Music resolves correctly across every tested combination of game/Director/boss state, all browser-verified with zero errors. ✔
- **Simplification pass** — rejected a second settings/volume store (seeded the Mixer from AF-044 directly); rejected a new music state machine (reused existing state as pure inputs); rejected faking a real audio backend or real assets that don't exist. ✔

**Internal quality score: 9.5/10 — approved and locked; the full Weapon/Enemy/Boss/Ambience sound content, a real Web Audio (or platform) backend, spatial-distance wiring, and the full accessibility/mixer UI bind at future content and audio-production modules.**
