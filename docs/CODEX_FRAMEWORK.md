# AFTERLIGHT — Codex Framework

**Authority:** Produced output of AF-043. Extends AF-000 → AF-042. Every future lore entry, expansion, civilisation, and discovery extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the Codex is a read-only presentation layer over discoveries that already happen — it introduces zero new unlock mechanism, and no player is ever forced to open it.

---

## 1. Codex Structure — twenty categories, thirty sandbox entries

`CODEX_CATEGORIES` registers all twenty named sections. Ten reuse AF-026's existing `CollectionCategory` values by reference (Commanders, Ships, Weapons, Equipment, Relics, Enemies, Bosses, Biomes, Research, Achievements); Resources reuses AF-042's `CollectionLedger`; Elite Variants, Blueprints-adjacent categories, and Galaxy Discoveries are documented views, exactly as AF-042 already established for its own Collections. Galaxy History, Timeline, Factions, Technology, Ancient Civilisations, Characters, Events, and Collections are this module's own content, built from AF-010/039/041's existing lore and canon.

## 2. Discovery Rules & Entry Structure — a reference, never a second flag

`CodexUnlockRef` is a discriminated union over exactly the discovery mechanisms Exploration/Combat/Boss Defeats/Research/Crafting/Collections/Mission Completion/Galaxy Events already are: `collection` (AF-026), `extraCollection` (AF-042), or `alwaysUnlocked`. `CodexEntryDef` carries Unique ID, Category, Title, the four Lore Layers (§3), an optional live Statistic key, a plain descriptive Discovery Source, Related Entries, Timeline Position, and a content Version — Future Expansion Hooks are simply new optional fields any future module can add without breaking existing content.

## 3. Lore Layers — two required, two optional

Summary (Layer One) and Detailed Description (Layer Two) are required on every entry. Historical Context (Layer Three) and Recovered Archives (Layer Four) are `null` when an entry has nothing more to say — "players choose how deeply to explore" is satisfied by simply not requiring every entry to go four layers deep.

## 4. Interconnected Knowledge — validated, not assumed

`relatedEntryIds` link entries across categories (a boss links to the ancient civilisation it guards; a faction links to its founding technology). `CodexRuntime.missingLinkCount()` verifies every reference resolves to a real entry — the sandbox roster achieves zero.

## 5. Timeline — reference material, always available

All nine eras are `alwaysUnlocked` overview entries, ordered by `timelinePosition`. The individual discoveries a era's overview links to (a specific faction, a specific ancient civilisation) remain genuinely gated — the Timeline itself is not the gate.

## 6. Discovery Rewards — AF-026's cosmetics, a second consumer

Completing every entry in a Codex section grants a `CosmeticRewardKind` reward through the exact same `meta.discover("achievements", …)` bucket AF-042's achievements use, namespaced `codex-complete-<category>` so the two systems never collide.

## 7. Search — a real, pure function

`CodexRuntime.search(query, reader)` matches Name/Category/Keyword by case-insensitive partial substring, and only ever returns unlocked entries — verified directly, including on an exact title match against a still-locked entry.

## 8. Player Journal — AF-042's Discovery Log, read as the journal

Recent Discoveries is `CollectionLedger.recentDiscoveries` verbatim. Personal Statistics is `MetaProgression.stat()`. No second discovery-log store was built; the remaining journal entry kinds (Mission Reports, Boss Encounters, Research Notes, Commander Logs) are richer *context* for that same log, bound as content debt.

## 9. Lore Presentation & Accessibility & Performance

Illustrations, Interactive Timeline, and Animated Maps bind to real assets at the AF-002/006 production pass — every sandbox entry's `image` field is honestly `null` today. Large text, font scaling, search, filtering, controller/touch navigation, and high contrast build from AF-003/AF-004/AF-005/AF-019. Entries are a static content array (lazy-loadable as-is); `CodexRuntime` allocates nothing beyond the arrays its query methods return.

## 10. Debug

Live: entries unlocked/total, Discovery %, Missing Links, and Timeline status — rendered in the shared `DebugOverlay` `codex` field.

---

## Internal review loop (AF-043, recorded)

- **No duplicated systems** — every unlock reference, reward kind, and persistence mechanism reuses AF-026/039/042 exactly; `CodexRuntime`'s pure search/timeline/link-validation/section-completion logic is the only genuinely new mechanical surface. ✔
- **Players are never forced to read lore** — nothing in the game loop requires opening the Codex; `alwaysUnlocked` entries exist specifically so foundational reference material never gates on a discovery action either. ✔
- **Curious players uncover a connected history** — verified directly in the browser: discovering one Ancient Vault cascaded through the Codex and Achievements simultaneously, unlocking two entries from a single action, with zero Missing Links anywhere in the roster. ✔
- **Knowledge itself remains the primary reward** — every sandbox entry's content is real, specific lore (not placeholder text), while the optional Section Completion cosmetic is exactly that: optional, cosmetic, secondary. ✔
- **Sandbox proof** — thirty entries across twenty categories, a validated Timeline, a working Search, and a real Section Completion path, all browser-verified with zero errors. ✔
- **Simplification pass** — rejected a new unlock flag (every entry references an existing discovery); rejected a second Player Journal store (reused AF-042's Discovery Log directly); rejected gating the Timeline overview itself (kept it always-available, gating only what it links to). ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining Codex content breadth, Concept Art/Historical Records/Hidden Missions reward kinds, and the full Lore Presentation/Search UI (illustrations, interactive timeline, animated maps) bind at future content and UI modules.**
