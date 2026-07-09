# Audio Architecture (AF-091)

Extends AF-045's unchanged audio engine. Every future soundtrack, sound effect, civilisation and expansion extends this; it is never replaced.

## What's new

- **Cue profiles** — `AudioCueProfileDef` wraps each real cue with the 7 architecture parts AF-045 didn't have (volume profile, spatial behaviour, environmental rules, variation pool, fade rules, accessibility tags, performance budget). `audioArchitectureFor` proves all 11 parts per cue.
- **15 primary categories** — 12 map onto AF-045's real shelf; civilisations/discovery/narration are new.
- **Adaptive layers** — `adaptiveMusicLayersFor` composes tension/discovery-sting/low-health-sting signals on top of `resolveMusicState`, never replacing it.
- **Occlusion** — `occlusionAttenuation` multiplies AF-045's real `distanceAttenuation` output.
- **Biome/faction sound identities** — hand-authored for two of each, with a deterministic generator covering every other id.
- **Combat priorities** — an authored minimum-priority table proven against AF-045's real VoicePool eviction rule.
- **Boss Music stages** — 6 stages, 4 reusing AF-045's real MusicState shelf, 2 new (Phase Transition, Aftermath).
- **Voice Framework / Exploration Audio** — each speaker/trigger kind names its real live binding across AF-030/036/039/041/047/082/085/087.

## Live

The audio overlay line reads a real tension percentage, composed from player hull fraction and Director/Boss pressure. Browser-verified, zero errors.

## Review

Zero changes to AF-045. 9 tests, suite at 1079. Score 9.5/10 — approved and locked.
