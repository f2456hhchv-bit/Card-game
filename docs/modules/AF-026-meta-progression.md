# AF-026 — META PROGRESSION FRAMEWORK

**Module status:** Complete (framework specified; account/mastery/collections/statistics/challenges implemented, simulation-tested, persistent, live in the sandbox; content passes bind as Commanders/ships/weapons/cosmetics land)
**Lock status:** LOCKED — extends AF-000 → AF-025 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/META_PROGRESSION.md` + implementation (`src/game/meta/`) + persistent profile in the sandbox

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-025 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Meta Progression Framework.

Meta Progression is the long-term backbone of Afterlight.

Every completed expedition should permanently contribute towards the player's overall journey.

Players should never feel that a run was wasted.

Meta progression rewards dedication.

Gameplay progression rewards skill.

Both systems must coexist without replacing one another.

==================================================
CORE PHILOSOPHY
==================================================

Every run matters.

Knowledge creates mastery.

Mastery creates possibilities.

Progress should unlock options.

Not mandatory power.

Players should become more versatile.

Not invincible.

==================================================
META PROGRESSION LOOP
==================================================

Complete Expedition
↓
Gain Account XP
↓
Gain Commander Mastery
↓
Gain Ship Mastery
↓
Gain Weapon Mastery
↓
Unlock Research
↓
Unlock Cosmetics
↓
Expand Collections
↓
Launch Next Expedition

Every expedition contributes to multiple progression systems.

==================================================
ACCOUNT LEVEL
==================================================

The player's account gains experience from:

Mission Completion

Boss Defeats

Exploration

Research

Collection Progress

Achievements

Galaxy Restoration

Special Events

Account Level never resets.

==================================================
COMMANDER MASTERY
==================================================

Each Commander tracks:

Experience

Mastery Rank

Completed Missions

Boss Defeats

Unique Challenges

Lore Unlocks

Cosmetics

Mastery rewards encourage continued play without creating mandatory choices.

==================================================
SHIP MASTERY
==================================================

Each Ship tracks:

Usage

Distance Travelled

Enemies Destroyed

Damage Mitigated

Boost Usage

Mission Success

Special Challenges

Mastery unlocks cosmetic and utility rewards.

==================================================
WEAPON MASTERY
==================================================

Every weapon records:

Kills

Damage

Critical Hits

Evolution Count

Boss Kills

Elite Kills

Unique Challenges

Mastery expands player knowledge.

Not raw power.

==================================================
ACCOUNT COLLECTIONS
==================================================

Track permanent completion of:

Weapons

Relics

Equipment

Ships

Commanders

Biomes

Enemies

Bosses

Research

Achievements

Lore

Collections become permanent account history.

==================================================
MASTERY REWARDS
==================================================

Unlock:

Commander Skins

Ship Paints

Portrait Frames

Titles

Codex Entries

Music

Engine Trails

Visual Effects

Banner Customisation

Future cosmetic systems

Gameplay balance remains unaffected.

==================================================
PLAYER STATISTICS
==================================================

Track:

Hours Played

Runs

Victories

Defeats

Bosses Defeated

Enemies Destroyed

Damage Dealt

Damage Taken

Distance Travelled

Resources Collected

Rare Items Found

Highest Difficulty

Statistics remain permanent.

==================================================
CHALLENGE SYSTEM
==================================================

Every mastery category supports:

General Challenges

Commander Challenges

Ship Challenges

Weapon Challenges

Boss Challenges

Biome Challenges

Galaxy Challenges

Seasonal Challenges (Future)

Challenges promote experimentation.

==================================================
ACCOUNT PROFILE
==================================================

Display:

Level

Mastery

Completion %

Collections

Recent Achievements

Favourite Commander

Favourite Ship

Play Style Summary

Future online identity extends this profile.

==================================================
LONG-TERM GOALS
==================================================

Support:

100% Collections

Full Research

Maximum Mastery

Galaxy Restoration

Ancient Technology Recovery

Mythic Discoveries

Challenge Completion

Future endless progression.

==================================================
BALANCE PRINCIPLES
==================================================

Meta progression expands options.

Run progression creates power.

Player skill remains decisive.

Mastery should never invalidate challenge.

==================================================
ACCESSIBILITY
==================================================

Support:

Large profile cards

Search

Sorting

Progress filters

Completion indicators

Controller navigation

Touch navigation

Colour-blind support

==================================================
PERFORMANCE
==================================================

Cache statistics.

Update asynchronously.

Pool UI elements.

Lazy load large collections.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Account Level

Mastery Levels

Collection %

Challenge Progress

Statistics

Profile Data

Performance

==================================================
OUTPUT
==================================================

Produce the complete Meta Progression Framework.

Every future Collection, Achievement, Commander, Ship, Weapon and Galaxy system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Complete hundreds of simulated expeditions.

Review account progression.

Review Commander Mastery.

Review Ship Mastery.

Review Weapon Mastery.

Review statistics.

Review collections.

Review challenge variety.

Review reward pacing.

Review player motivation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-025.

Adjust progression curves.

Adjust mastery rewards.

Adjust completion pacing.

Remove unnecessary grinding.

Ensure every completed expedition permanently advances the player's journey while preserving challenge, encouraging experimentation and rewarding long-term mastery.

Repeat until the Meta Progression Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-026.

---

## Foundation / AF-016–025 alignment review (recorded at catalogue time)

- Meta progression completes the two-track promise (Constitution Progression Philosophy): AF-022 owns in-run power, AF-024/025 own permanent capability, AF-026 owns permanent *identity* — account level, mastery, collections, statistics, challenges. Failure pays into all of it (RunEnded feeds account XP win or lose — the harvest framing of AF-011 §4, now with a permanent ledger).
- **"Options, not power" is structural:** the mastery/challenge reward type union contains only cosmetic and knowledge payloads (skins, paints, frames, titles, codex entries, music, trails, effects, banners) — there is no stat field to abuse. Gameplay balance cannot be affected by meta rewards because the type system has nowhere to put a buff.
- **Account level reuses the AF-022 curve engine** (`XpSystem` with its own tuning — no second levelling implementation, no-duplication law); never resets by construction (no reset method exists on the account track).
- **Collections use compact ID sets** — the AF-013 §6 save rule in live use: save size grows with what the player has found, never with catalogue size.
- Mastery tracks are generic (`commander:X`, `ship:X`, `weapon:X` — one engine, many tracks) with per-track counters matching the module's lists; rank curves are data. Evolution counts, boss kills, distance, mitigation — all counter keys, extended freely by content modules.
- Challenge engine: data-defined challenges over counter thresholds, complete exactly once, reward a cosmetic/knowledge unlock into collections; eight categories registered (seasonal = future, anti-FOMO per AF-013 §7 — seasonal challenges rotate into the permanent pool).
- Everything persists in a third save slice (`meta`) on the AF-024 save system; statistics update in-memory per event and flush at safe moments (run end, Galaxy Command) — the async-update performance requirement.
- Profile (level, completion %, favourites derived from usage counters, play-style summary) is the surface a **future online identity** extends (AF-001 §12 — profile data is exactly what the optional community layer would share).
- Sandbox live: kills, damage, loot, runs, and level-ups feed the meta ledger through bus subscriptions; the Statistics screen is now a real profile; three sandbox challenges award title cosmetics; everything survives reload.
- **Self-review executed headlessly:** 300 simulated expeditions in CI assert monotonic account level, exact statistic sums, single-completion of challenges, collection idempotence, and save round-trip fidelity. Reward-pacing passes bind as cosmetic content lands.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; content passes bind Commander/ship/weapon/cosmetic modules. Produced outputs: `docs/META_PROGRESSION.md`, `src/game/meta/`.
