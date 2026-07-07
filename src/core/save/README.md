# save — the Save Framework (AF-001 §8 / AF-024 / AF-044, core layer)

**Purpose:** Persistence that never loses player progress. Independent versioned slices with migration chains; corruption quarantines and falls back instead of cascading. AF-044 adds isolated Save Profiles, cross-slice Autosave-status bookkeeping, and checksum-protected Milestone Backups — all built *on* the existing `SaveSlice`/`SaveStorage` contract, none of it a second persistence engine.

**Responsibilities:** Slice envelopes `{version, checksum, data}` (`SaveSlice`), FNV-1a integrity checksums, pure chained migrations, rolling backup on every write, quarantine of corrupt payloads, per-slice minimal reset; storage contract (`SaveStorage`) with memory and localStorage adapters; isolated Save Profiles via key-prefixing (`SaveProfileManager`); Autosave-status bookkeeping and checksum-protected cross-slice Milestone Backups (`SaveCoordinator`); device-scoped Settings persistence, independent of any profile (`settingsData`).

**Dependencies:** none (core layer). Async interface so IndexedDB / Steam Cloud / account sync slot in behind the same contract — proven directly by `SaveProfileManager.storageFor()`, which wraps the exact same `SaveStorage` interface with a key prefix and requires zero changes to any existing `SaveSlice`.

**Events:** none — callers log via the `onWarning` hook.

**Data structures:** `SliceEnvelope`, `Migration`, `SaveSliceOptions`, `SaveProfileMeta`, `SaveUnit`, `SaveUnitStatus`, `MilestoneBackupEnvelope`, `SettingsData`.

**Extension points:** new slices = new `SaveSlice` instances with their own keys/versions/migrations (research was the first; crafting/meta/inventory/collectionLedger followed; settings is the newest, deliberately profile-independent); new backends implement `SaveStorage` — Cloud Synchronisation (AF-044 §Cloud Synchronisation) is exactly this extension point, with no producer yet since no cloud SDK is available in this offline-first project; new Save Profiles register through `SaveProfileManager` without any existing slice's code changing.

**Known limitations:** localStorage adapter is the skeleton's backend — IndexedDB/Steam Cloud arrive as a new `SaveStorage` implementation, not a rewrite of anything here. The six pre-existing `SaveSlice` instances (research/crafting/meta/inventory/collectionLedger + the new settings slice) are not yet profile-scoped through `SaveProfileManager.storageFor()` — wiring every existing composition-root slice through it is deferred as a broad, separately-reviewable change rather than folded into this pass. `SaveProfileManager.remove()` unregisters a profile but does not cascade-delete its underlying slice data, since this module doesn't enumerate every key a profile might own. Data Validation's "Dependencies" axis (cross-checking a save's referenced content ids still exist) is registered, no producer yet.
