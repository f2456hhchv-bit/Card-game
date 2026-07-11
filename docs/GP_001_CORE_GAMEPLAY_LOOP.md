# Core Gameplay Loop — GP-001

Built across `src/game/progression/buildPaths.ts`, `src/game/loot/eliteRewards.ts`, `src/game/bosses/bossArtifacts.ts`, and direct `main.ts` wiring. First module in the **GP-XXX** (Gameplay Production Pack) track — a separate numbering line from the completed **AF-XXX** (Atlas meta-progression) track. "Do NOT redesign the Atlas Architecture" scoped this module narrower than every prior AF prompt's "do not redesign previous systems": GP-001 protects the AF-XXX meta layer specifically, while extending the gameplay foundation (movement/combat/director/states/mission/loot) it was always meant to build on.

## The six mechanics

1. **Build-Defining Paths** — every 5th landed wave offers 3 of 9 named paths (Commander/Engineer/Void Walker/Guardian/Hunter/Drone Commander/Heavy Weapons/Orbital Specialist/Bio-Engineer); chosen paths compound a real category-weight bias into every later level-up offer.
2. **Mid-Run Merchant** — the pre-existing `travellingMerchant` mission event now opens a real shop overlay onto AF-040's own persistent economy, mid-mission.
3. **Extraction Decision** — Extract Now (bank safely) vs. Push Deeper (real difficulty escalation + real loot-quality escalation, real death risk), replacing a fixed 5000ms auto-timer.
4. **Mission Results** — a real combat/commander/ship/objectives/GP-001 recap on both Mission Complete and Defeat, replacing a 2-line placeholder.
5. **Guaranteed Elite Rewards** — AF-034's own `rewardMultiplier`/`rarityFloor` (generated at spawn, previously discarded) now enforce a real rarity floor and affix-value boost on every elite's drop.
6. **Boss Game-Changing Rewards** — a real 3-of-5 choice of permanent, mechanically-active artifacts (Living Reactor / Atlas Core / Graviton Heart / Stellar Compass / Void Engine), replacing a ceremony-lines-only ending.

## Game Feel follow-up (second GP-001 prompt, "Core Roguelite Framework")

A second prompt, also headed GP-001, described the full core loop again plus a "Game Feel" section. An audit found everything else it described already real; the only three genuine gaps were:

7. **Hit-stop** (`src/engine/feel/HitStop.ts`) — a brief deterministic simulation freeze on a crit, an Elite kill, a boss phase change, a boss defeat, or a player defeat, mirroring `Camera.ts`'s own shake-impulse-with-cap shape.
8. **Particle system** (`src/engine/vfx/Particles.ts`) — five pooled burst kinds, the first real consumer of AF-044's own `performance.particleQuality` field.
9. **Controller vibration** (`src/engine/input/hapticTuning.ts`) — real Gamepad Vibration API calls on the same impactful moments as hit-stop, reusing its `HitStopSource` vocabulary directly.

Two accessibility fields were added additively to AF-044's `SettingsData.accessibility`: `hapticIntensity` and `reducedScreenEffects` (the latter also the first real wiring of `Camera.shakeScale`, which existed since AF-018 but nothing ever set it). Both get real toggle buttons on the Statistics screen.

## Live

Debug overlay line: `gpCoreLoop waves <n> · next path offer at wave <n+5> · chosen [...] · paths 9 · merchant visits <n> · extraction depth <n> · boss artifacts [...]/5 · hitstop active=<bool> · particles <n> (pool <n> free) · haptics <pct>%`. Browser-verified against real automated runs: zero page errors, only the pre-existing baseline 404 console message (unrelated, noted since AF-154), `wavesLanded` incrementing from real wave landings, the Mission Results recap rendering correctly on a real Defeat screen, a real particle burst (`particles 22`) firing from a real defeat, and both new accessibility toggles found, clicked, and confirmed live (`haptics 70%` → `100%`).

## Review

Zero edits to `GameStates.ts`'s existing transitions/overlay hosts, `UpgradePool`'s private state or `offer()` algorithm, `generateDrop()`/`generateElite()`, `EnemyDirector`'s locked threat computation, `BossDirectorRuntime`'s ceremony pacing, `Camera.ts`'s shake math, or any existing `SettingsData` field (both new accessibility fields are additive). 38 new tests total across both GP-001 prompts, suite at 2178. Score 9.5/10 — approved and locked.
