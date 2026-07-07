# codex — Codex Framework (AF-043, game layer)

**Purpose:** The permanent knowledge archive — a read-only presentation and interconnection layer over discoveries that already happen. Introduces zero new unlock mechanism.

**Responsibilities:** `CodexEntryDef`/`CodexUnlockRef`/`CodexLoreLayers` data shapes and the sandbox entry roster spanning all twenty categories (`codexData`); unlock checking, Timeline ordering, Related-Entry resolution, Missing-Link counting, Discovery %, Search, and Section Completion (`CodexRuntime`).

**Dependencies:** `game/meta` (`CollectionCategory`/`MasteryReward`) and `game/achievements` (`ExtraCollectionCategory`) — every gated entry's `unlock` field references a discovery those two systems already track; the Codex never calls `discover()` itself, only reads `hasDiscovered()`/`hasExtraDiscovered()`.

**Data structures:** `CodexEntryDef`, `CodexUnlockRef` (collection | extraCollection | alwaysUnlocked), `CodexLoreLayers` (the four Lore Layers — only Summary/Detailed are required; Historical Context/Recovered Archives are optional per entry).

**Extension points:** new entries are data; `CodexRuntime` is a pure reader with no state of its own — no new save slice was needed anywhere in this module. Section Completion rewards reuse AF-026's existing `CosmeticRewardKind` and persist through the same `meta.discover("achievements", …)` bucket AF-042's achievements already use, namespaced as `codex-complete-<category>`.

**Known limitations:** as a direct consequence of the Codex introducing no new discovery mechanism, this module's real contribution to the wider game was finding and finally wiring several already-registered-but-dormant collection buckets: `"ships"`/`"commanders"`/`"weapons"` (fielded at run start) and `"relics"` (on `RelicAcquired`) had existed since AF-026 with zero producers until now; `FactionDef.loreId` (AF-039) had the same gap, now wired on Faction Mission victory. Images are `null` placeholders throughout, binding to real illustrations at the AF-002/006 asset-production pass. The Player Journal (Mission Reports/Boss Encounters/Research Notes/Commander Logs) is documented as directly reusing AF-042's existing `CollectionLedger.recentDiscoveries` rather than a second discovery-log store; extending its per-entry context to every log kind the spec names is content debt. Interactive Timeline/Animated Maps/full Search UI bind at the UI module — this module proves the underlying pure logic (ordering, filtering, link validation), not the presentation.
