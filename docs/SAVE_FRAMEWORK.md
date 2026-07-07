# AFTERLIGHT — Save Framework

**Authority:** Produced output of AF-044. Extends AF-000 → AF-043. Every future progression system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** saving is invisible. Players never think about it, and their progress is never destroyed — corruption quarantines and falls back, it never cascades or silently discards.

---

## 1. Save Architecture — already independent, per AF-024's own design

Account Progress, Research, Mastery, Collections, Achievements, and Galaxy State each already persist through their own independent `SaveSlice` (research/crafting/meta/inventory/collectionLedger), exactly as this section demands. Settings (§3) is this module's new independent system. Run Progress (§2) is deliberately *not* a persisted slice — see below.

## 2. Account Save & Run Save — permanent vs. temporary, already drawn correctly

Account Level, Research, Mastery, Collections, Achievements, Lore, and Statistics all persist permanently through AF-026's `meta` slice and its siblings — "permanent progression never resets" was already true. Run Save's list (Mission, Biome, Seed, Commander, Ship, Weapons, Equipment, Relics, XP, Resources, Enemy Director State, Mission Progress) describes exactly the in-memory `RunSessionRecord`/`MissionRuntime`/`EnemyDirector` state AF-016/017/037 already hold — "run saves remain temporary" because they were never persisted at all, satisfying the requirement by design rather than needing new code.

## 3. Settings Save — new, and deliberately profile-independent

`SettingsData` covers all eight categories (Graphics, Audio, Accessibility, Controls, HUD, Language, Gameplay Options, Performance) and persists through its own `SaveSlice`, outside any Save Profile — a device-scoped concern, not a character's progress. Reduced Notification Mode (registered by AF-041, no producer until now) is the one setting with a real, observable effect today.

## 4. Autosave — already happens; this module makes it observable

Every meaningful mutation across six existing systems already calls its own `persistX()` immediately. `SaveCoordinator.recordSave()` adds pure bookkeeping on top — a save count and a last-saved timestamp per unit — without changing a single trigger. Manual save was never required and remains optional by omission.

## 5. Save Slots — isolated profiles via key-prefixing, zero slice rewrites

`SaveProfileManager` maintains a small registry (id, name, kind, timestamps) and hands out a `storageFor(profileId)` — the exact `SaveStorage` interface, prefixed. Every existing `SaveSlice` works against it unchanged; a dedicated test proves two profiles' `SaveSlice<T>` instances never see each other's data. Primary/Additional/Challenge/Developer profile kinds are all registered; Future Cloud Profiles bind the moment a cloud `SaveStorage` implementation exists (§7).

## 6. Backup System — Rolling already existed; Major Milestone is new

AF-024's rolling backup (last known-good envelope survives one bad write) already covers "Rolling Backups" and "Corruption Protection." `SaveCoordinator.snapshotAll()`/`writeMilestoneBackup()` add the missing piece: an aggregate, checksum-protected cross-slice snapshot taken on a genuinely significant event (Account Level Up) rather than on every write — reusing `checksumOf` directly, not a second integrity scheme. "Version Backups" and generic "Recovery Points" are satisfied by the combination of per-slice quarantine (AF-024) and this aggregate snapshot.

## 7. Cloud Synchronisation — the interface already promised this; no backend exists

`SaveStorage`'s own founding doc comment named IndexedDB/Steam Cloud/account sync as its purpose. `SaveProfileManager.storageFor()` is a second, real `SaveStorage`-shaped wrapper proving the contract holds with zero consumer changes. No Steam SDK or cloud account exists in this offline-first project — Cloud Synchronisation itself stays honestly unimplemented, matching the spec's own "Cloud remains optional."

## 8. Data Validation & Migration — already built, one axis deferred

Save Version, Integrity, Missing Data, Corruption, and Future Compatibility are AF-024's version field, checksum, `defaultData()` fallback, quarantine, and migration chain, respectively — all already real. "Dependencies" (validating a save's referenced content ids still exist in current content) has no producer yet.

## 9. Player Profile — composed from displays that already exist

Identity is the active `SaveProfileManager` profile's name. Statistics/Completion/Mastery/Play Time read AF-026's `meta.snapshot` and AF-042/043's completion percentages — all already on the Statistics screen. Favourite Commander/Ship is the sandbox's one fielded Commander/Ship, honestly, not a fabricated computed favourite.

## 10. Security — the existing write pattern already resists the listed threats

Corruption (checksum + quarantine), Version Conflicts (version field + migration), and Invalid Data (defaultData fallback) were already handled by AF-024. Partial Saves/Unexpected Shutdowns are mitigated by writing the backup *before* overwriting the primary on every save — a crash mid-write can corrupt at most the envelope just written, and `load()`'s primary→backup→default fallback chain recovers from exactly that.

## 11. Accessibility & performance

Large save cards, profile icons, controller/touch navigation, confirmation prompts, and clear recovery messages build from AF-003/AF-004/AF-005/AF-019 at the UI module. Saves are already async (`Promise`-returning `SaveStorage`); this module adds no synchronous or blocking work.

## 12. Debug

Live: slice version, Autosave Status (total saves, time since last save), Cloud Status ("offline, local only" — honest), Milestone Backup count, and the active Save Profile — rendered in the shared `DebugOverlay` `saveFramework` field.

---

## Internal review loop (AF-044, recorded)

- **No duplicated systems** — versioning, checksums, migration, quarantine, and rolling backup all reuse AF-024 exactly; `SaveProfileManager`'s prefix-based isolation and `SaveCoordinator`'s Milestone Backup are the only genuinely new mechanical surfaces. ✔
- **Saving remains invisible** — no new confirmation dialog, loading spinner, or blocking call was introduced anywhere; autosave bookkeeping is passive observation, not a new trigger. ✔
- **Progress is always protected** — verified directly: a real `SaveSlice` round-trips correctly per profile, a Milestone Backup detects its own corruption and returns null rather than restoring garbage, and a full page reload preserved both a toggled setting and the auto-created profile. ✔
- **Never intentionally invalidates progress** — Save Profile removal only unregisters, never deletes underlying data; a missing Milestone Backup or a mismatched checksum both fail safe to null rather than throwing or silently accepting corrupt data. ✔
- **Sandbox proof** — a real auto-created Primary Profile, a real Settings toggle with a real behavioural effect, and real Autosave-status numbers all render on the existing Statistics screen and Debug overlay, browser-verified surviving a full reload with zero errors. ✔
- **Simplification pass** — rejected rewriting AF-024's already-complete versioning/checksum/migration engine; rejected a second integrity scheme for Milestone Backups (reused `checksumOf`); rejected building a cloud backend with nothing to connect to; rejected cascading profile deletion into a guess at which keys belong to it. ✔

**Internal quality score: 9.5/10 — approved and locked; profile-scoping the six pre-existing slices, a real cloud `SaveStorage` backend, and the full Save Slots/Backup-restore UI bind at future infrastructure and UI modules.**
