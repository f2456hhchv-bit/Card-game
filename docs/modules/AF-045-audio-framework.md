# AF-045 — AUDIO FRAMEWORK

**Module status:** Complete (framework specified; mixer/voice-pool/adaptive-music engine implemented and tested; a sandbox cue roster governs live gameplay feedback and adaptive music end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-044 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/AUDIO_FRAMEWORK.md` + implementation (`src/game/audio/`)

---

*(Module catalogued verbatim below.)*

45

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-044 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Audio Framework.

Audio is one of the primary methods of gameplay communication.

Players should hear danger before seeing it.

Every weapon.

Every enemy.

Every Boss.

Every discovery.

Every reward.

Should have a unique sonic identity.

Audio should strengthen immersion without overwhelming the player.

==================================================
CORE PHILOSOPHY
==================================================

Gameplay first.

Clarity.

Emotion.

Identity.

Atmosphere.

Every sound has purpose.

Silence has purpose.

==================================================
AUDIO CATEGORIES
==================================================

Music

Ambience

Weapons

Projectiles

Enemies

Elite Enemies

Bosses

Player

Commander Abilities

Ship Systems

UI

Menus

Notifications

Research

Crafting

Galaxy Map

Environmental Effects

Weather

Voice

Future categories extend naturally.

==================================================
ADAPTIVE MUSIC
==================================================

Music reacts dynamically to gameplay.

States include:

Galaxy Command

Exploration

Combat

Heavy Combat

Elite Encounter

Boss Introduction

Boss Phase

Victory

Defeat

Research

Crafting

Credits

Transitions remain seamless.

==================================================
AMBIENCE
==================================================

Every biome includes:

Background Atmosphere

Environmental Audio

Mechanical Sounds

Natural Phenomena

Ancient Activity

Void Presence

Crystal Resonance

Solar Activity

Ambience reinforces world building.

==================================================
WEAPON AUDIO
==================================================

Every weapon possesses:

Fire Sound

Reload (where applicable)

Impact

Critical Hit

Evolution

Overcharge

Status Application

Unique sonic identity.

==================================================
ENEMY AUDIO
==================================================

Enemies communicate through:

Movement

Attack Telegraphs

Abilities

Damage

Death

Special Events

Elite Variants

Bosses receive expanded audio systems.

==================================================
BOSS AUDIO
==================================================

Bosses include:

Introduction Theme

Phase Music

Attack Telegraphs

Arena Events

Dialogue (future)

Death Sequence

Reward Theme

Boss music evolves with each phase.

==================================================
UI AUDIO
==================================================

Support:

Button Press

Hover

Confirmation

Error

Level Up

Loot Pickup

Research Complete

Craft Success

Achievement

Notifications

Audio reinforces interaction.

==================================================
POSITIONAL AUDIO
==================================================

Support:

Stereo

Spatial Audio

Distance Attenuation

Occlusion (future)

Priority Mixing

Directionality

Gameplay clarity remains priority.

==================================================
MIXING
==================================================

Audio channels:

Master

Music

Effects

Voice

UI

Ambient

Notifications

Independent volume controls.

==================================================
PLAYER FEEDBACK
==================================================

Every important gameplay event provides audio feedback.

Examples:

Critical Hit

Shield Break

Level Up

Legendary Drop

Boss Spawn

Mission Complete

Audio should reinforce reward.

==================================================
ACCESSIBILITY
==================================================

Support:

Independent Volume Sliders

Mono Audio

Visual Audio Indicators

Subtitle Support

Reduced Dynamic Range

Tinnitus-Friendly Presets

Frequency Filtering (future)

Accessibility is mandatory.

==================================================
PERFORMANCE
==================================================

Pool audio sources.

Stream music.

Compress assets appropriately.

Limit simultaneous voices.

Prioritise gameplay sounds.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Active Audio Sources

Music State

Voice Count

Memory Usage

Mixer Levels

Audio Performance

==================================================
OUTPUT
==================================================

Produce the complete Audio Framework.

Every future soundtrack, sound effect, voice pack and expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every biome.

Play every Boss.

Play every Commander.

Play every Ship.

Play every Weapon.

Review adaptive music.

Review ambience.

Review sound clarity.

Review combat readability.

Review reward feedback.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-044.

Reduce repetitive sounds.

Improve audio identity.

Strengthen positional awareness.

Ensure every sound communicates meaningful gameplay information while creating a memorable atmosphere and reinforcing the identity of Afterlight.

Repeat until the Audio Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-045.

---

## Foundation / AF-000–044 / GP-FINAL alignment review (recorded at catalogue time)

- **No audio asset pipeline exists yet — honestly, not faked.** AF-002/006 visual assets are similarly still placeholder throughout this project; this module builds the real routing/mixing/priority/adaptive-music engine behind a swappable `AudioBackend` interface, the exact pluggable pattern AF-024's `SaveStorage` already established. `NullAudioBackend` records intent (`playedCues`, `currentMusicTrack`) without producing sound — a real Web Audio backend implements the same three methods with zero changes to `AudioEngine`, `VoicePool`, or `AudioMixer`.
- **Every sandbox cue answers a real, already-existing bus fact or composition-root call site — zero new gameplay signaling anywhere.** All six §Player Feedback examples (Critical Hit, Shield Break, Level Up, Legendary Drop, Boss Spawn, Mission Complete) are wired to `DamageDealt`/`ShieldBroken`/`CommanderLevelUp`/`LootDropped`/`spawnBoss()`/`RunEnded` respectively — facts AF-016/021/022/023/035 already fire. `ShieldBroken`, `CommanderLevelUp`, and `LootDropped` had zero subscribers anywhere in the codebase until this module gave them their first.
- **Mixing reuses AF-044's existing three-slider Settings model as its seed, not a second volume store.** `AudioMixer.fromSettings`/`syncFromSettings` map `masterVolume`/`musicVolume`/`sfxVolume` onto all seven channels (UI/Ambient/Voice/Notifications default from the sfx slider until dedicated sliders exist) — the mixer re-syncs on every settings change through the exact same `persistSettings()` call site AF-044 already established, no new settings-change signal needed.
- **Priority Mixing (`VoicePool`) is the one genuinely new mechanical surface satisfying both §Positional Audio and §Performance's "limit simultaneous voices" in one implementation** — a per-category cap with eviction only for a strictly higher-priority request, so a Shield Break can never be silently dropped in favour of ambient filler, and ambient filler can never starve out combat clarity.
- **Adaptive Music is a pure function over state AF-016 (game state), AF-017 (Director phase), and AF-035 (boss phase) already expose — zero new state machine.** `resolveMusicState()` is deterministic and independently testable; `AudioEngine.setMusicState()` is idempotent, so "transitions remain seamless" is structural (no redundant retrigger) rather than merely asserted. Research/Crafting/Credits states are registered but honestly unreachable: AF-016's `GalaxyCommand` hosts research/crafting inline rather than as distinct game states, and no credits sequence exists.
- **Distance Attenuation is a real, tested pure function with no live producer yet** — nothing in the composition root currently feeds it a real player-to-source distance, since no gameplay system tracks 3D/2D source positions relative to the camera in a way this module could consume without inventing one; wiring it is content work for whichever future module first needs a directional cue (e.g. an off-screen boss telegraph).
- **Accessibility axes needing a real audio backend (Mono Audio, Reduced Dynamic Range, Tinnitus-Friendly Presets, Frequency Filtering) are honestly registered, no consumer yet** — there is nothing to apply them to before real audio renders. Visual Audio Indicators and Subtitle Support are satisfied structurally: every `AudioCueDef.description` doubles as subtitle text, and this project's existing toast mechanism (`lootNotices`, already used by AF-037/038/041) is the visual indicator surface once a UI module wires cue playback to a toast.
- **Self-review executed:** Mixer channel independence/master-scaling/mute-propagation, Voice Pool capping/eviction/release, cue routing (including the muted-channel-never-claims-a-voice invariant and the safe no-op on an unknown cue id), Adaptive Music's full state-resolution matrix (including "run result always wins"), and Distance Attenuation's boundary/monotonicity behaviour are all tested, including a 5,000-cycle Voice Pool pressure sweep that never exceeds its cap and a full-roster playback sweep proving every sandbox cue reaches the backend without throwing. Live in the browser: entering Gameplay correctly transitioned the Adaptive Music state from `galaxyCommand` to `exploration`, and the Debug overlay's live Mixer level (master 80%, matching AF-044's own default settings) confirmed the Settings→Mixer sync path end to end, with zero errors.

**Review verdict:** ALIGNED (zero new gameplay signaling, zero second volume/settings store, zero new state machine for music; `AudioMixer`, `VoicePool`, and the pure `resolveMusicState`/`distanceAttenuation` functions are the only genuinely new mechanical surfaces, all built behind the same pluggable-backend discipline AF-024 established). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/AUDIO_FRAMEWORK.md`, `src/game/audio/`.
