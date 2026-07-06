# save — versioned save slices (AF-001 §8, core layer)

**Purpose:** Persistence that never loses player progress. Independent versioned slices with migration chains; corruption quarantines and falls back instead of cascading.

**Responsibilities:** Slice envelopes `{version, checksum, data}` (`SaveSlice`), FNV-1a integrity checksums, pure chained migrations, rolling backup on every write, quarantine of corrupt payloads, per-slice minimal reset; storage contract (`SaveStorage`) with memory and localStorage adapters.

**Dependencies:** none (core layer). Async interface so IndexedDB / Steam Cloud / account sync slot in behind the same contract.

**Events:** none — callers log via the `onWarning` hook.

**Data structures:** `SliceEnvelope`, `Migration`, `SaveSliceOptions`.

**Extension points:** new slices = new `SaveSlice` instances with their own keys/versions/migrations (research is the first; settings, collections, statistics, achievements, run follow); new backends implement `SaveStorage`; compact ID-set representations for collection slices per AF-013 §6.

**Known limitations:** localStorage adapter is the skeleton's backend — IndexedDB primary arrives with the full save module; debounced/atomic write scheduling arrives with it too (writes are currently caller-timed at safe moments).
