# AFTERLIGHT — Iconography & Symbol Language

**Authority:** Produced output of AF-007. Extends AF-000 → AF-006 and the Master Constitution. Every icon ever created extends this framework; it is extended, never replaced.
**Binding rule of the whole document:** every icon communicates its purpose in under one second, without text, at every supported size, in every accessibility mode.

---

## 1. Design rules (every icon, no exceptions)

Extends AF-002 §8. Designed on the **24px grid**, exported per size with stroke compensation:

- **Strong silhouette** — passes the solid-black test; **single focal point** — one idea per icon, no scenes.
- **Consistent perspective** — flat-frontal or 3/4-top; never mixed within a category.
- **Consistent lighting** — single top-left source (AF-002); **consistent line weight** — 2px at 24px, scaled per size step.
- **Consistent border + spacing** — content fits the grid's safe area (20×20 at 24px); frames come from the rarity/state system (§4), never drawn into the glyph.
- **Minimal detail** — anything invisible at 16px is removed at every size. **No text embedded, ever** (localisation-proof, reading-speed-proof).

**Sizes:** 16 · 24 · 32 · 48 · 64 · 96 · **128** px (adds 128 to AF-005's ladder for inspection cards and collection frames). SVG-first sources (AF-006 §7), rasterised per size at build — pixel-perfect at every UI scale. The 16px render is approved *first*; if it fails at 16, the icon fails.

## 2. Icon categories

One registry, one prefix (`ICON_`, AF-006 naming), one manifest per icon (AF-006 §5 + fields: purpose, category, usage, sizes, animation, colour variants, associated system, version). Categories: Weapons · Equipment · Relics · Ships · Commanders · Enemies · Bosses · Abilities · Ultimates · Status Effects · Research · Crafting · Loot · Currencies · Resources · Mission Types · Biomes · Galaxy Events · Achievements · Collections · Settings · Developer Tools · Future Expansions. Each category commits to one perspective and one framing so members read as siblings.

## 3. Symbol language (one concept, one symbol, everywhere)

The permanent concept-to-symbol dictionary. No system may use a different symbol for these concepts, and no new icon may reuse these symbols for other meanings:

| Concept | Symbol | | Concept | Symbol |
|---|---|---|---|---|
| Damage | Sword | | Research | Atom |
| Shield | Shield (arc grammar) | | Crafting | Forge |
| Health | Heart | | Blueprint | Blueprint scroll |
| Energy | Lightning bolt | | Galaxy | Spiral galaxy |
| Movement | Thruster | | Mission | Beacon |
| Critical | Starburst | | Commander | Helmet |
| XP | Constellation | | Ship | Starship |
| Boss | Crown | | Elite | Diamond |

Composite icons combine dictionary symbols (critical damage = sword + starburst) rather than inventing new metaphors — the vocabulary stays learnable and the system stays scalable to thousands of icons.

## 4. Rarity language (canonical nine-tier ladder)

**Authorised by AF-007, superseding AF-002's provisional five-tier ramp** (amendment recorded in `docs/VISUAL_LANGUAGE.md` §3). Token bindings:

| Tier | Identity | Token(s) | Animated |
|---|---|---|---|
| **Damaged** | Grey | `rarity.damaged` `#7A8296` | — |
| **Common** | White | `rarity.common` `#DCE4F2` | — |
| **Improved** | Green | → `vitality.green` `#4DE868` | — |
| **Rare** | Blue | → `shield.blue` `#4D7CFF` | — |
| **Epic** | Purple | → `energy.violet` `#9B5CFF` | — |
| **Legendary** | Gold | → `solar.gold` `#FFC652` | subtle shimmer |
| **Ancient** | Crimson gold | `rarity.ancient` duotone `#C8323C` → `#FFC652` | slow ember drift |
| **Mythic** | White gold | `rarity.mythic` duotone `#FFF3D6` → `#FFD98A` | radiant pulse |
| **Singularity** | Animated violet, dynamic energy | `rarity.singularity` duotone `#9B5CFF` → `#E4D4FF` | orbiting energy |

Every tier ships the full **seven-piece identity set**: border · glow · background · pickup beam · inspection card · inventory border · collection frame — generated from the tier's token(s) by one shared system, so a new tier is a data row, not seven bespoke assets.

Disambiguation rules: rarity colours appear **only inside rarity framing** — Epic purple never reads as Void threat because threats never wear item frames; Improved green never reads as healing because healing always carries the regen-tick motif (AF-004 §3). Colour-blind law: tiers are additionally distinguished by border *pattern* (tick marks: 0–8 notches ascending the ladder), so the full ladder is readable in greyscale.

## 5. Status effect icons

Roster (canon, binds future combat modules): **Burn · Freeze · Shock · Poison · Corruption · Shielded · Regeneration · Overload · Slow · Stasis** (+ *Bleed*, reserved future). Each gets a unique dictionary-consistent symbol, coloured by its gameplay family (hostile effects hot/violet, beneficial effects cool/green per AF-004 §3), identifiable without text at 16px in the HUD status row. Status icons are the hardest 16px case in the game — they are the benchmark set for §1's rules.

## 6. Ability icons

Every Commander ability, ship ability, Ultimate, weapon evolution, and relic effect receives: unique silhouette (no two ability icons may share a read — AF-004 identity law applied to icons), consistent framing (abilities square-framed; Ultimates hex-framed — the frame announces the class), readable colours from palette tokens, and **no duplicated visual concepts** — the registry validator (§9) flags near-duplicate compositions for redesign.

## 7. Animation (reserved, meaningful)

Animated icons are **reserved** for: Legendary · Ancient · Mythic · Singularity rarities, Ultimate Ready, Research Complete, Major Achievements. Rules: animation enhances recognition (a Mythic pulses *because* it's Mythic), stays within AF-005's six-primitive vocabulary (glow/pulse/highlight at token durations), never loops faster than 1Hz in inventories (fatigue law), respects reduced-motion (static premium variant swapped in), and never appears on common information — scarcity of motion is what makes motion mean something (Constitution reward philosophy).

## 8. Accessibility

High contrast (token swap: thickened strokes, brightened fills) · colour-blind modes (palette remaps + §4 border patterns + shape-first design) · **alternative icon shapes** where hue is the only differentiator (validator-flagged) · scalable sizes (every icon ships all seven) · **Outline Mode** — a stroke-only rendering of the full set for maximum-clarity play, generated from the SVG sources automatically. The law beneath all of it: **no icon relies solely on colour.**

## 9. Production & performance

Icons follow the AF-006 pipeline: SVG source + manifest → validation → per-size rasterisation → **icon atlases** (packed per usage context: HUD set, inventory set, menu set — so a screen binds one atlas, minimising draw calls). Shared shader/material for all static icons; one animated-icon shader for §7 tiers. Registry validation extends AF-006 §10: name/uniqueness, size-set completeness, silhouette-collision detection (perceptual-hash near-duplicates), dictionary-symbol misuse, colour-only differentiation. Budgets: icon atlases within AF-006 texture memory budgets; 60 FPS floors hold.

## 10. Debug support (dev builds)

Icon panel in the debug overlay: loaded icon count by category/atlas · missing icons (placeholder-glyph occurrences live) · atlas usage maps · animated icon count on screen (validates §7 scarcity) · icon memory vs budget · 16px preview grid of any category on demand (instant readability audit in-game).

## 11. Standing review obligations (bind every future content module)

Per AF-007's self-review loop — at every content module's QA stage: review new icons at all seven sizes (16px first), in all colour-blind modes and Outline Mode, against the symbol dictionary (no concept drift, no duplicated compositions), against rarity framing rules, and against the one-second test. Remove duplicated concepts; strengthen weak silhouettes; repeat until the icon system reads as one unified, unmistakably-Afterlight language.

---

## Internal review loop (AF-007, recorded)

- **Categories** — 23 categories, one registry, per-category perspective/framing commitments. ✔
- **Rarity** — nine-tier ladder bound to tokens (two inherited from the owner's palette extension — no orphan colours), seven-piece identity set generated from data, greyscale-readable via border patterns. ✔
- **Symbols** — closed dictionary with composition rule; scalable to thousands of icons without new metaphors. ✔
- **Animation** — reserved to top tiers and major moments; scarcity preserved; reduced-motion honoured. ✔
- **Size readability** — 16px-first approval, per-size stroke compensation, status icons as benchmark set. ✔
- **Colour-blind compatibility** — shape-first, border patterns, alternative shapes, Outline Mode; never colour alone. ✔
- **Consistency/scalability** — validator catches near-duplicates, dictionary misuse, and incomplete size sets automatically. ✔
- **Simplification pass** — rejected per-category colour palettes (tokens only); rejected a tenth "Artifact" rarity tier as unfounded by any module; collapsed "currency icons animate" idea (violates §7 scarcity). ✔
- **Supersession handled** — AF-002 ramp amended with authority recorded, AF-003's Mythic flag resolved, palette extension reused. ✔

**Internal quality score: 9.5/10 — approved; §11 obligations bind all future content modules.**
