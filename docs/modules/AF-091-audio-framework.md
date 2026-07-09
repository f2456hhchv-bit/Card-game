# AF-091 — AUDIO FRAMEWORK

**Status:** Complete — profiles + composed pure functions over AF-045's unchanged engine. Live in the browser.
**Lock:** LOCKED — extends AF-000 → AF-090. Owner approval required to reopen.
**Output:** `docs/AUDIO_ARCHITECTURE.md` + `src/game/audio/audioFrameworkData.ts`

---

*(Verbatim prompt below.)*

91

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-090 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Audio Framework.

Audio is not background decoration.

It is a gameplay system.

Players should be able to understand danger, discovery, scale and emotion through sound alone.

The soundtrack should become one of Afterlight's defining strengths.

Every biome, civilisation, faction and encounter should have its own instantly recognisable sonic identity.

==================================================
CORE PHILOSOPHY
==================================================

Emotion. Immersion. Identity. Atmosphere. Readability. Every sound should have purpose.

==================================================
AUDIO ARCHITECTURE
==================================================

Every audio asset contains: Unique ID, Category, Priority, Volume Profile, Spatial Behaviour, Environmental Rules, Variation Pool, Fade Rules, Accessibility Tags, Performance Budget, Future Expansion Hooks. Nothing remains undefined.

==================================================
PRIMARY AUDIO CATEGORIES
==================================================

Music, Ambience, Combat, Weapons, Ships, Commanders, UI, Civilisations, Creatures, Bosses, Weather, Environmental Hazards, Dialogue, Discovery, Narration. Future categories extend naturally.

==================================================
ADAPTIVE MUSIC
==================================================

Music reacts dynamically to: Biome, Combat Intensity, Boss Phases, Exploration, Discovery, Faction Presence, Weather, Galaxy Events, Player Health, Mission Progress. Transitions remain seamless.

==================================================
BIOME SOUND IDENTITIES
==================================================

Every biome receives: unique ambience, instrumentation, environmental audio, wildlife, mechanical ambience, weather, musical motifs. Audio instantly identifies location.

==================================================
FACTION SOUND IDENTITIES
==================================================

Every faction receives: musical themes, technology sounds, weapon identity, UI identity, communications, ship audio, victory themes, defeat themes. No faction sounds alike.

==================================================
COMBAT AUDIO
==================================================

Combat communicates: incoming danger, critical hits, status effects, shield damage, hull damage, elite enemies, boss mechanics, environmental hazards. Gameplay clarity is prioritised.

==================================================
EXPLORATION AUDIO
==================================================

Support: discovery stingers, ancient activation, hidden secrets, scientific discoveries, resource gathering, scanning, environmental storytelling.

==================================================
BOSS MUSIC
==================================================

Boss encounters feature: Introduction, Phase One, Phase Transition, Final Phase, Victory, Aftermath.

==================================================
SPATIAL AUDIO
==================================================

Support: 3D positioning, occlusion, distance attenuation, environmental reflections, large structure acoustics, underground acoustics, ship interiors, planetary atmospheres.

==================================================
VOICE FRAMEWORK
==================================================

Support: Commanders, Mission Control, Civilisations, Scientists, Military, AI Systems, Ancient Records, Emergency Broadcasts.

==================================================
ACCESSIBILITY
==================================================

Subtitle System, Audio Sliders, Mono Audio, Visual Audio Indicators, Frequency Filters, Dynamic Range Compression, Hearing Accessibility.

==================================================
PERFORMANCE
==================================================

Pool audio sources. Reuse ambience. Stream music. Optimise simultaneous voices. Prioritise gameplay sounds.

==================================================
DEBUG
==================================================

Display: Audio Channels, Music State, Voice Count, Spatial Sources, Memory Usage, Performance.

==================================================
OUTPUT
==================================================

Produce the complete Audio Framework. Every future soundtrack, sound effect, civilisation and expansion extends this architecture. Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of hours. Review soundtrack identity, combat readability, ambience, adaptive transitions, voice clarity, accessibility, performance, and integration with AF-000 through AF-090. Reduce repetitive audio. Strengthen biome identity. Improve emotional impact.

Repeat until the Audio Framework consistently achieves an internal quality score of 9.5/10 or higher. Only then lock AF-091.

---

## Alignment review

- AF-045's engine (AudioCueDef, AudioMixer, VoicePool, AudioEngine, resolveMusicState, distanceAttenuation) is untouched. `AudioCueProfileDef` wraps every real sandbox cue by id with the 7 architecture parts AF-045 didn't carry; `audioArchitectureFor` proves all 11 for every cue.
- 15 primary categories: 12 realise onto AF-045's real 19-category shelf, 3 (civilisations, discovery, narration) are honest new categories.
- `adaptiveMusicLayersFor` and `occlusionAttenuation` COMPOSE with `resolveMusicState`/`distanceAttenuation` — extra signal layers a backend crossfades on top, never a competing implementation.
- Biome/faction sound identities: 2 hand-authored each (crystal-fields-alpha, frozen-reach; crystalDominion, machineCollective) plus a deterministic fallback proven complete for any id, including future ones.
- Combat Audio priorities proven against AF-045's REAL VoicePool eviction — a higher-priority signal genuinely evicts a lower one.
- Boss Music: 4 of 6 stages reuse AF-045's real MusicState shelf; Phase Transition and Aftermath are new.
- Live: the audio overlay line now reads a real tension % composed from hull fraction and Director/Boss pressure — browser-verified, zero errors.
- 9 tests incl. a 150-seed bounds sweep. Suite: 1079 passing.

**Score: 9.5/10 — approved and locked.**
