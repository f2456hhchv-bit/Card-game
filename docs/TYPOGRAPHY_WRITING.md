# AFTERLIGHT — Typography, Writing & Communication Framework

**Authority:** Produced output of AF-009. Extends AF-000 → AF-008 and the Master Constitution. Every written word in Afterlight extends this framework; it is extended, never replaced.
**Binding rule of the whole document:** every sentence has purpose — it serves gameplay, immersion, or progression, in as few words as the meaning allows. Gameplay always outranks lore.

---

## 1. Typography system (three faces, three jobs)

| Face | Job | Requirements |
|---|---|---|
| **Primary — modern sans-serif** | Everything: body, UI, HUD, gameplay text | High readability, broad Unicode coverage, **tabular numerals** (AF-002 law), embeddable license, WOFF2 subset per language (AF-006 §9) |
| **Secondary — display face** | Display Title level and brand lockups **only**, never body text | *Authorised AF-002 amendment:* must remain a modern sans in character — a distinct weight/width for presence, not a decorative font; AF-002's restraint intent stands |
| **Monospace** | Developer tools, debug overlay, terminal-style interfaces, future hacking systems | Clear zero/O and 1/l/I distinction; player-facing only in diegetic terminal contexts |

Concrete families are selected at the UI implementation module (per AF-002 §9's standing note) against these requirements, and recorded there with licenses in the asset manifest (AF-006 §5).

## 2. Typography hierarchy (ten levels, fixed)

Extends AF-002's five-level scale; locked sizes keep their values. All sizes respond to font-scaling; spacing rules are fixed per level (8px-grid line heights):

| Level | Size / weight | Spacing rules | Face |
|---|---|---|---|
| Display Title | 40 / bold, wide-tracked uppercase | LH 48, standalone | Display |
| Main Heading | 32 / bold *(former Title)* | LH 40, 24 above / 16 below | Primary |
| Section Heading | 24 / semibold *(former Header)* | LH 32, 16 / 8 | Primary |
| Subheading | 20 / semibold | LH 28, 16 / 8 | Primary |
| Body | 16 / regular | LH 24 | Primary |
| Caption | 14 / regular, `neutral.grey` | LH 20 | Primary |
| Tooltip | 14 / regular | LH 20, max width 40ch | Primary |
| Micro Text | 12 / medium — legal minimum size; nothing renders smaller | LH 16 | Primary |
| Statistics | 16 / medium **tabular** | LH 24, columns align | Primary |
| Numbers (combat/damage) | 16–24 / bold **tabular**, scale = significance | in-world | Primary |

## 3. Writing style (three registers)

**Gameplay register** — short, direct, action-focused; verb-first or state-first; no punctuation theatrics: `Shield Offline` · `Mission Complete` · `Research Ready` · `Boss Incoming`. Two to four words is the norm; if a gameplay string needs a sentence, it belongs in a tooltip.

**Lore register** — hopeful, mysterious, scientific, melancholic; never melodramatic. The rule of restraint: lore *observes* rather than exclaims. Wonder comes from what is described, not from adjectives. One exclamation mark in the entire codex is one too many.

**System register** — precise, neutral, professional: `Save restored from backup.` · `Cloud sync unavailable — progress stored locally.` No blame, no cuteness, no fake apology.

## 4. Voice of the universe

Ancient. Beautiful. Dangerous. Recoverable. The through-line of every text: **optimism despite overwhelming odds** — the writing believes the galaxy can be rebuilt, because that is the player fantasy (AF-000). Technology is *rediscovered*, never invented from nothing and never magical: every mysterious phenomenon implies a discoverable principle (Constitution World Philosophy). Forbidden everywhere: melodrama, nihilism, snark toward the player, fourth-wall breaks outside the settings/system register.

## 5. Naming conventions (player-facing names)

| Category | Convention | Feel |
|---|---|---|
| Weapons | Short, memorable — 1–2 words | `Solar Lance`, `Rift Cutter` |
| Ships | Military/exploratory designations | `SCV Meridian`, `Vanguard-Class` |
| Commanders | Human name + callsign | `Ilsa Reyes — "Longlight"` |
| Research | Scientific terminology | `Coherent Plasma Containment` |
| Biomes | Astronomical terminology | `Circumbinary Ice Field` |
| Bosses | Mythic yet believable | `The Unmourned`, `Warden of the Deep Relay` |

Hard rules: **no joke names, no internet slang**, no pop-culture references — a name that winks at the camera fails brand review (AF-002 §13's "could it exist in another game?" applies to words too). Names sit above asset IDs: `WPN_SOLAR_LANCE` (AF-006) carries display-name string keys per locale. *(Examples above are illustrative style anchors, not committed content — rosters arrive with their content modules.)*

## 6. Layered information (lore structure)

Four layers, player-chosen depth — nobody is force-fed lore, and the curious are always rewarded (Constitution: players feel curious, never overwhelmed):

1. **Gameplay summary** — the one-liner on the item/card: what it does.
2. **Short description** — tooltip flavour: what it is.
3. **Detailed archive** — codex entry: what it means.
4. **Recovered historical records** — unlockable primary documents: what really happened.

Layers 1–2 ship with the content; layers 3–4 live in the codex, lazy-loaded (§10), and deepen through play (discovery as reward).

## 7. Structured text formats

**Tooltips** (extends the single AF-003 §6 component): Name · Purpose · Effect · Statistics · Synergies · optional Lore · Upgrade info — concise; stats in Statistics level; lore one line max inside a tooltip (deeper reading lives in the codex).

**Mission text**, six parts, each with a length ceiling: Briefing (≤3 sentences) · Objective (one gameplay-register line) · Threat Assessment (≤2 lines) · Expected Rewards (list, not prose) · Mission Summary (≤2 sentences) · Completion Report (results + one flavour line).

**Achievements**: Title (memorable, ≤4 words) · Short description · Completion criteria (exact, no riddles — hidden criteria would violate the no-hidden-information law) · optional Lore line.

## 8. Numerical presentation

Locale-aware via the localisation layer, visually consistent everywhere: thousands separators (`1,250`), percentages (`24%`), signed deltas (`+15%` / `−8%` — true minus, sign always shown on deltas), multipliers (`1.25x`). Buffs/nerfs colour-code per AF-003 (with signs, never colour alone). Icons replace repeated words where they help (AF-007 dictionary); numbers never decorate — a number on screen is always actionable information.

## 9. Localisation architecture

Realises AF-001's `src/data/localization/`: every player-facing string lives in locale tables keyed by **string ID** — zero hardcoded text, enforced by the validator (§11). Message format supports pluralisation and gender-neutral grammar (ICU-style select/plural); dates and numbers format per locale; string IDs are stable once shipped (AF-001 ID law). Documentation per string: unique ID · category · source module · translation key · version · usage context · dependencies (which screen/system). Future voice localisation attaches as audio keyed by the same IDs. English (UK) is the source language of record.

## 10. Accessibility & performance

**Accessibility:** font scaling (all ten levels), line-spacing and letter-spacing controls, tooltip/subtitle scaling, dyslexia-friendly font option (future flag — slot reserved in the font stack so it's a swap, not a redesign), high readability at every size (Micro 12px is the hard floor; scaling raises it, nothing lowers it).

**Performance:** localisation tables cached at load (current locale only); lore layers 3–4 lazy-loaded on codex entry; text components pooled and reused (AF-005 §10 — damage numbers, notifications, tooltips); glyph atlases per font/size bucket (AF-006). Text costs live inside the 1ms UI budget (AF-003 §9).

## 11. Debug support (dev builds)

Text panel in the debug overlay: missing strings (key shown in-place as `⟦key.name⟧` + logged) · translation coverage per locale (% complete, by category) · text overflow detection (any string clipping its container is flagged live — the classic localisation bug, caught automatically) · font fallback events (glyph not in subset) · localisation status (active locale, table cache state) · text rendering cost. The AF-006 validator gains: hardcoded-string detection (literals in UI code), orphaned string keys, and untranslated-key reports as CI checks.

## 12. Standing review obligations (bind every future content module)

Per AF-009's self-review loop — at every content module's QA stage: review new menus, tooltips, briefings, codex entries, achievements, and notifications against the three registers and §4 voice; verify hierarchy usage (no invented sizes), localisation readiness (no hardcoded text, plural-safe), accessibility at max font scale (no clipped layouts), and naming conventions; **remove unnecessary words** — the standing edit pass: every string re-read once with the question "does each word earn its place?"; repeat until the whole game speaks with one unmistakably-Afterlight voice.

---

## Internal review loop (AF-009, recorded)

- **Typography** — three faces with strictly separated jobs; ten-level hierarchy extends locked sizes without moving them; tabular-numeral law carried into two dedicated levels; 12px floor set. ✔
- **AF-002 amendment** — display face authorised by owner module, constrained to sans-character/titles-only so the restraint principle survives; recorded in both documents. ✔
- **Writing registers** — three registers with concrete style rules and examples; melodrama, snark, and joke-naming banned as review failures. ✔
- **Layered lore** — four layers with placement and loading rules; depth is opt-in, discovery is rewarded. ✔
- **Localisation readiness** — string-ID architecture, ICU plural/gender, locale formatting, stable IDs, CI enforcement of zero hardcoded text — retrofit-proof from day one. ✔
- **Accessibility** — scaling on every level plus spacing controls; dyslexia-font slot reserved structurally. ✔
- **Performance** — cached tables, lazy lore, pooled components, glyph atlases; inside the existing UI budget. ✔
- **Simplification pass** — rejected a fourth "narrative cinematic" register (lore register covers it); rejected per-faction fonts (one voice, faction identity lives in colour/shape per AF-002/AF-008); capped tooltip lore to one line to protect conciseness. ✔

**Internal quality score: 9.5/10 — approved; §12 obligations bind all future content modules.**
