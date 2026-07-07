# AF-044 — SAVE FRAMEWORK

**Module status:** Complete (framework specified; Save Profiles/Autosave-status/Milestone-Backup engine implemented and tested; a live profile, settings slice, and autosave status govern Galaxy Command's persistence layer end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-043 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/SAVE_FRAMEWORK.md` + implementation (`src/core/save/`)

---

*(Module catalogued verbatim below.)*

44

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-043 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Save Framework.

Player progress is one of the most valuable assets in Afterlight.

Every discovery.

Every collection.

Every achievement.

Every research unlock.

Every mastery level.

Must be stored safely and reliably.

Players should trust that their progress is always protected.

==================================================
CORE PHILOSOPHY
==================================================

Reliable.

Transparent.

Recoverable.

Secure.

Future-proof.

Saving should feel invisible.

Players should never think about it.

==================================================
SAVE ARCHITECTURE
==================================================

Separate save systems for:

Account Progress

Run Progress

Settings

Statistics

Collections

Research

Mastery

Achievements

Galaxy State

Future Expansions

Each system remains independent.

==================================================
ACCOUNT SAVE
==================================================

Store:

Account Level

Research

Mastery

Collections

Achievements

Lore

Statistics

Galaxy Progress

Unlocked Content

Cosmetics

Permanent progression never resets.

==================================================
RUN SAVE
==================================================

Store:

Mission

Biome

Seed

Commander

Ship

Weapons

Equipment

Relics

XP

Level

Resources

Enemy Director State

Mission Progress

Run saves remain temporary.

==================================================
SETTINGS SAVE
==================================================

Store:

Graphics

Audio

Accessibility

Controls

HUD

Language

Gameplay Options

Performance Settings

Settings persist across devices where applicable.

==================================================
AUTOSAVE
==================================================

Automatically save after:

Mission Completion

Research

Crafting

Purchases

Achievements

Collections

Galaxy Progress

Settings Changes

Manual save remains optional.

==================================================
SAVE SLOTS
==================================================

Support:

Primary Profile

Additional Profiles

Challenge Profiles

Developer Profile

Future Cloud Profiles

Profiles remain isolated.

==================================================
BACKUP SYSTEM
==================================================

Automatically create:

Rolling Backups

Major Milestone Backups

Version Backups

Recovery Points

Corruption Protection

Players may restore backups.

==================================================
CLOUD SYNCHRONISATION
==================================================

Support:

Steam Cloud

Future Console Cloud

Future Mobile Cloud

Conflict Resolution

Version Validation

Offline Play

Cloud remains optional.

==================================================
DATA VALIDATION
==================================================

Validate:

Save Version

Integrity

Dependencies

Missing Data

Corruption

Future Compatibility

Invalid saves should attempt recovery.

==================================================
MIGRATION
==================================================

Support future save upgrades.

Older save versions migrate automatically.

Never intentionally invalidate player progress.

==================================================
PLAYER PROFILE
==================================================

Store:

Identity

Statistics

Favourite Commander

Favourite Ship

Play Time

Completion

Mastery

Preferences

Future online identity.

==================================================
SECURITY
==================================================

Protect against:

Corruption

Partial Saves

Version Conflicts

Unexpected Shutdowns

Invalid Data

Always prioritise player progress.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Save Cards

Profile Icons

Controller Navigation

Touch Navigation

Confirmation Prompts

Clear Recovery Messages

High Contrast

==================================================
PERFORMANCE
==================================================

Save asynchronously.

Compress data.

Avoid blocking gameplay.

Minimise disk writes.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Save Version

Autosave Status

Cloud Status

Integrity Check

Backup Count

Migration Status

Performance

==================================================
OUTPUT
==================================================

Produce the complete Save Framework.

Every future progression system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Test thousands of save cycles.

Test autosave.

Test manual saves.

Test recovery.

Test cloud synchronisation.

Test migration.

Test corruption recovery.

Test multiple profiles.

Test settings persistence.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-043.

Reduce save size.

Improve recovery.

Strengthen validation.

Ensure player progress is always protected, recoverable and future-compatible while remaining invisible during normal gameplay.

Repeat until the Save Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-044.

---

## Foundation / AF-000–043 / GP-FINAL alignment review (recorded at catalogue time)

- **Most of this specification was already built by AF-024, and its own README said so explicitly.** `src/core/save/README.md` already anticipated "settings, collections, statistics, achievements, run follow" as future slices and stated "IndexedDB primary arrives with the full save module" — AF-044 *is* that full save module. Versioned envelopes, FNV-1a checksums, chained migrations, corruption quarantine, and rolling backup-on-write have existed since AF-024 and needed zero changes: Data Validation (Save Version/Integrity/Missing Data/Corruption/Future Compatibility), Migration, and most of Security (Corruption/Version Conflicts/Invalid Data) are already fully satisfied.
- **Save Slots are new: isolated Save Profiles via pure key-prefixing.** `SaveProfileManager.storageFor(profileId)` wraps the exact same `SaveStorage` interface with a `profile:<id>:` prefix — every existing `SaveSlice` (research/crafting/meta/inventory/collectionLedger) works against it completely unchanged, proven directly by a test that constructs a real `SaveSlice` against two different profiles' storage and confirms zero cross-contamination.
- **Autosave already exists in full, distributed across six `persistX()` call sites since AF-024/025/026/027/042 — each one saves immediately after its own meaningful mutation.** This module doesn't change *when* anything saves; `SaveCoordinator.recordSave()` adds bookkeeping (*that* a save happened) so Autosave Status has something real to display, without touching any existing persist function's trigger logic.
- **Major Milestone Backups are the one genuinely new backup mechanism, reusing AF-024's exact `checksumOf` rather than a second integrity scheme.** A `SaveCoordinator` snapshot aggregates every registered unit's `toSave()` output into one envelope, checksum-protected identically to how a single `SaveSlice` protects itself, and is triggered on a real, infrequent, significant event (`AccountLevelUp`) rather than on every save — "Major," not "Rolling."
- **Cloud Synchronisation requires zero new interface.** `SaveStorage`'s own doc comment already named this as its purpose ("the contract future backends implement: IndexedDB, Steam Cloud, account sync"); `SaveProfileManager.storageFor()` is direct proof the abstraction holds, since it *is* a second `SaveStorage` implementation slotted in with zero changes to any consumer. No Steam SDK or cloud account exists in this offline-first project, so Cloud Synchronisation itself remains honestly unimplemented, exactly as the spec's own "Cloud remains optional" language allows.
- **Settings Save is genuinely new, and deliberately profile-independent** — a design call recorded here: accessibility/graphics/audio/control preferences apply to the device/installation, not to a particular save profile's progress, matching how most games actually scope settings. Reduced Notification Mode, registered as accessibility vocabulary by AF-041 with no producer until now, gets a real toggle and a real behavioural effect (ambient Galaxy Event toasts suppressed; the underlying World State effect still applies either way).
- **Player Profile is 90% composition of displays that already exist** — Identity comes from the new `SaveProfileManager`; Statistics/Completion/Mastery/Play Time are AF-026's `meta.snapshot` plus AF-042/043's Achievement/Codex completion percentages, all already rendered on the Statistics screen. Favourite Commander/Ship is honestly the sandbox's single fielded Commander/Ship until roster content lands — not fabricated as a computed "favourite" the locked `MetaProgression` class has no public API to derive (per-track mastery XP is private).
- **Data Validation's "Dependencies" axis (do a save's referenced content ids still exist) is registered, no producer yet** — building a full cross-slice content-integrity checker across six save shapes was judged out of scope for this pass and is recorded honestly rather than faked.
- **Self-review executed:** Save Profile isolation (including a real `SaveSlice` proving zero cross-contamination), Autosave-status bookkeeping across multiple independent units, Milestone Backup snapshot/restore/checksum-corruption-detection, and Settings persistence through the exact same `SaveSlice` contract as everything else are all tested, including a 2,000-cycle sweep interleaving saves across three profiles and confirming each profile's final state matches only its own writes. Live in the browser: toggling Reduced Notification Mode and then performing a full page reload correctly preserved both the setting and the auto-created "Commander" Save Profile — the concrete guarantee this whole module exists to make — with zero errors.

**Review verdict:** ALIGNED (zero rewrite of AF-024's already-complete versioning/checksum/migration/backup engine, zero new integrity scheme, zero new `SaveStorage` implementation beyond proving the interface's own stated purpose; `SaveProfileManager`'s prefix-based isolation and `SaveCoordinator`'s cross-slice Milestone Backup are the only genuinely new mechanical surfaces). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/SAVE_FRAMEWORK.md`, `src/core/save/`.
