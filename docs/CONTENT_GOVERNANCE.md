# AFTERLIGHT — Content Governance & Scalability Framework

**Authority:** Produced output of AF-013. Extends AF-000 → AF-012 and the Master Constitution. Every future feature, expansion, season, biome, weapon, Commander, asset, and line of code integrates under this framework. Extended, never replaced.
**Binding rule of the whole document:** *build once, extend forever, never replace, never duplicate.* Every future addition should feel like it always belonged — and after ten years, the project should still be maintainable by a newcomer reading the docs.

---

## 1. How content grows (the mechanics of "extend forever")

Every content category — ships, weapons, enemies, bosses, biomes, Commanders, research, relics, equipment, achievements, lore, events, cosmetics, music, VFX, audio, UI — grows the same way, because the architecture already made growth uniform:

- **New content = new data records** (AF-001 §6 tables) + assets through the AF-006 pipeline + strings through AF-009 localisation + canon through the AF-010 ledger. Code changes only when a genuinely new *mechanic* arrives — and then as a new system or a documented extension point, never an edit against an existing contract.
- **New systems depend on interfaces, never concrete implementations** (AF-001 layer law restated as governance): a future system may consume events and registered interfaces; it may not import another feature's internals. This is what makes removal, replacement, and expansion independent operations.
- Every addition declares its documentation octet: **Purpose · Inputs · Outputs · Dependencies · Events · Data · Extension Points · Performance Impact** (extends AF-001 §13 / AF-012 §6 documentation into a uniform dependency record — the future dependency-graph tooling reads these).

## 2. Content taxonomy (the shelf every future module sits on)

All future AF modules and expansions classify into: **Foundation · Gameplay · Progression · World · Narrative · Audio · Visual · UI · Technical · Developer · Community.** AF-000 → AF-013 are Foundation. The taxonomy is inherited by expansions, the module registry (STATUS.md gains a Category column as modules arrive), and the docs tree — a feature that doesn't fit a category prompts a taxonomy *extension*, never a shrug.

## 3. Expansion rules

Every expansion (of any size, from one weapon to a new galaxy) must: respect existing canon (AF-010 ledger review) · respect the gameplay pillars (AF-011 Feature Gate) · reuse existing systems (§1) · avoid feature duplication (§8 validation) · avoid conflicting mechanics (a new mechanic may not make an existing mechanic's rules false — if two rules collide, the new one redesigns) · increase replayability · leave hooks for what comes after it (**every expansion documents its own Expansion Hooks** — the places the *next* expansion will attach).

## 4. Content pipeline

The AF-012 lifecycle, applied per content addition: Concept → Specification → Implementation Prompt → Visual Design Board → Asset Sheet → Prototype → QA → Performance Validation → Accessibility Validation → Module Lock. **No exceptions** — a single weapon follows the same path as a campaign; only the stage *sizes* scale, never the sequence.

## 5. Deprecation policy (nothing is ever removed)

Obsolete systems and content are: **archived** (code/data retained, flagged inactive, documented why) · **redirected** (references route to the successor — old save data, old IDs, old research nodes always resolve to something) · **replaced internally** (the public contract stays; the implementation behind it may be swapped). Backwards compatibility holds wherever practical; where impractical, a migration (AF-001 §8) carries players forward — a player returning after five years loads their save. Shipped IDs are permanent (AF-001/AF-006); deprecation never breaks them.

## 6. Scalability targets (binding canon) and the architecture audit

**Targets:** 500+ weapons · 300+ enemies · 150+ bosses · 100+ ships · 100+ Commanders · 1000+ equipment items · thousands of relics · unlimited research nodes · unlimited missions · unlimited galaxy sectors. The architecture must reach them without redesign.

Audit against the locked architecture (recorded):
- **Data:** flat records + stable IDs + registries (AF-001 §6) — scale is a loading/packing question, already answered by lazy loading and generated indices (AF-006). ✔
- **Assets:** atlases packed per context, budgets per category, content-hash dedup (AF-006/AF-007) — thousands of icons/sprites planned for. ✔
- **UI:** virtualised collections (AF-005 §10) — a 1000-item inventory renders only visible rows. ✔
- **Runtime:** pooled entities, density degradation (AF-004 §1) — on-screen count is bounded regardless of catalogue size. ✔
- **Saves — rule added (extends AF-001 §8):** collection/discovery/achievement slices store **compact ID-set representations** (sorted ID lists / bitsets keyed by registry index), not per-item objects — a 5,000-relic collection costs kilobytes, and save size grows with *player discovery*, not catalogue size. Save load stays O(owned), never O(exists). ✔
- **"Unlimited" categories** (research, missions, sectors): unlimited means *procedurally composable from finite data* plus streamed content packs — the registries index packs lazily so the base game never pays for expansion content it hasn't loaded. ✔

## 7. Live content (with the anti-FOMO guarantee)

Supported growth: expansions · seasonal content · community events · new galaxies · new campaigns · new civilisations · new technologies. Governance the Constitution imposes on all of it:

- **Live content adds; it never expires into inaccessibility.** Seasonal content rotates into the permanent game after its season — missing a season costs timing, never content (no FOMO, no artificial retention, no mandatory windows).
- **Community events ride the optional online layer** (AF-001 §12) and write nothing the offline game depends on. The offline game remains permanently complete — a player who never connects owns a whole game, forever (technology decision + Player Promise).
- New civilisations/technologies enter through the AF-010 mystery economy: answer old questions, pose new ones, never rewrite history.

## 8. Content validation (every addition, before its pipeline starts)

Does it extend an existing system? · Does it duplicate another feature? *(if yes — merge or reject)* · Does it improve replayability? · Does it respect readability? · Does it maintain performance? · Does it strengthen Afterlight's identity? Any wrong answer returns it for redesign. This is the content-specific pre-filter in front of the Unified Feature Gate (AF-011 §5) — cheap questions first, full gate after.

## 9. Performance under growth

Every expansion maintains: stable memory (budgets are per-category, so growth changes *what's loaded*, not *how much*) · minimal loading (packs stream; first-play stays small — PWA promise) · efficient data management (registries + generated indices) · pooling (mandatory, sized by data) · scalable saves (§6 rule). The 60 FPS floors and 120 preferred hold at every catalogue size — measured at QA with worst-case loaded content.

## 10. Debug & growth instruments (dev builds + tooling)

Extends the debug overlay and CI reports: **module dependency graph** (from the §1 documentation octets — visualise what depends on what; cycles are failures) · **expansion count / growth metrics** (records, assets, strings, saves-size trend per release) · **unused systems** (registered but never invoked in play sessions — candidates for the §5 archive) · **duplicate content** (AF-006 content-hash + AF-007 silhouette-collision + data-record similarity flags) · performance trend per release. Growth is observed, not assumed.

## 11. Standing review obligations (bind every future addition and every release)

Per AF-013's self-review loop — at every content module's QA and every release: re-run the §8 validation on everything added; audit new dependencies against the interface-only law; verify expansion hooks are documented; check growth metrics against §6 targets and §9 budgets; hunt duplicated concepts across the *whole* catalogue and merge them; strengthen any extension point that an addition found awkward (awkwardness is architectural feedback). Repeat until every future feature has an obvious home.

---

## Internal review loop (AF-013, recorded)

- **Whole-module audit (AF-000 → AF-012)** — reviewed all thirteen for duplicated concepts and overlapping systems: evaluation checklists already unified (AF-011), single component/palette/naming/tooltip systems hold, no merges required; dependency directions all conform to the layer law. ✔
- **Scalability** — all ten targets audited against the locked architecture; one real gap (save-format scaling) found and closed with the compact ID-set rule — an extension of AF-001 §8, not a redesign. ✔
- **Expansion pathways** — every content category has a defined data + asset + string + canon path; Expansion Hooks requirement makes future attachment points explicit instead of archaeological. ✔
- **Maintainability** — documentation octet + dependency graph + taxonomy give the ten-year newcomer a map; deprecation policy guarantees old saves and old references never dangle. ✔
- **Live content** — anti-FOMO guarantee reconciles seasons/events with the Constitution's bans; offline completeness restated as unbreakable. ✔
- **Simplification pass** — rejected a separate "season pipeline" (same lifecycle, smaller scope); rejected per-category governance documents (one framework, categories differ by data); folded growth metrics into existing debug/CI tooling rather than a new dashboard system. ✔

**Internal quality score: 9.5/10 — approved; §11 obligations bind every future addition.**
