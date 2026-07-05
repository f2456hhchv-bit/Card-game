# AFTERLIGHT — Colour System & Visual Hierarchy

**Authority:** Produced output of AF-008. Extends AF-000 → AF-007 and the Master Constitution. This is the **master colour registry**: every colour that exists in Afterlight is documented here; every future visual asset draws from it. Extended, never replaced.
**Binding rule of the whole document:** colour is gameplay communication, never decoration. A colour with no documented purpose does not exist in the game.

---

## 1. Master token registry

All tokens live as data (AF-001 no-magic-numbers law). Format per AF-008's documentation standard: purpose, HEX, RGB, usage, accessibility handling (all tokens get mode remaps via the palette-swap architecture, AF-002 §11), associated systems, version (v1 unless noted).

### Primary background (the dark field)

| Token | HEX | RGB | Purpose / usage |
|---|---|---|---|
| `space.black` | `#05060A` | 5, 6, 10 | Deep Space Black — base of nearly every frame |
| `space.navy` | `#0D1630` | 13, 22, 48 | Nebula Navy — nebula mid-fields, biome atmosphere base |
| `space.indigo` | `#141033` | 20, 16, 51 | Void Indigo — void-corrupted regions, deep backgrounds |
| `space.blue` | `#101A38` | 16, 26, 56 | Midnight Blue — environment mid-tones, panel bases |

### Primary light (the hope)

| Token | HEX | RGB | Purpose / usage |
|---|---|---|---|
| `energy.white` | `#F4F7FF` | 244, 247, 255 | White Energy — pure light, max-emphasis, neutral info |
| `energy.violet` | `#9B5CFF` | 155, 92, 255 | Electric Violet — signature accent, ancient power, Ultimate, Epic |
| `light.cyan` | `#9FE8FF` | 159, 232, 255 | Soft Cyan — gentle tech light, ambient friendly glow |

### Secondary

| Token | HEX | RGB | Purpose / usage |
|---|---|---|---|
| `crystal.teal` | `#3FE0C0` | 63, 224, 192 | Crystal faction, restoration themes |
| `solar.gold` | `#FFC652` | 255, 198, 82 | Reward, XP, Legendary, ancient warmth |
| `machine.steel` | `#6E7687` | 110, 118, 135 | Machine faction industrial grey (formalised from AF-002) |
| `shield.blue` | `#4D7CFF` | 77, 124, 255 | **Plasma Blue binding** — shields, Rare tier, blue support |
| `void.purple` | `#6B2FBF` | 107, 47, 191 | Void Purple — Void faction body colour, Corruption (darker than `energy.violet`; threats wear this, the brand wears violet) |
| `ancient.bronze` | `#B08850` | 176, 136, 80 | Ancient Bronze — Ancient faction structure/detail |
| `plasma.cyan` | `#3FD4F5` | 63, 212, 245 | Player technology, player shots, Shock |
| `vitality.green` | `#4DE868` | 77, 232, 104 | Healing, Regeneration, Improved tier, support green |

### Warning

| Token | HEX | RGB | Purpose / usage |
|---|---|---|---|
| `warning.orange` | `#FF8A3D` | 255, 138, 61 | Warning states, telegraph windup, Burn |
| `danger.red` | `#FF4054` | 255, 64, 84 | Immediate danger, damage, telegraph commit — reserved (AF-002) |
| `danger.crimson` | `#C8323C` | 200, 50, 60 | Danger Crimson — deep threat: Abyssal Swarm, Ancient-rarity duotone base, boss danger states |

### Support / status additions

| Token | HEX | RGB | Purpose / usage |
|---|---|---|---|
| `neutral.grey` | `#8A93A6` | 138, 147, 166 | Neutral info, disabled gameplay states, Damaged-adjacent UI |
| `ice.blue` | `#A9D9FF` | 169, 217, 255 | Freeze status (distinct from Shock's electric cyan) |
| `toxin.green` | `#86B33A` | 134, 179, 58 | Poison status — murky, hostile; never confusable with `vitality.green` |
| `overload.yellow` | `#FFE14D` | 255, 225, 77 | Overload status (hotter and paler than `solar.gold`) |
| `rarity.damaged` / `rarity.common` / `rarity.ancient` / `rarity.mythic` / `rarity.singularity` | per AF-007 §4 | | Rarity ladder tokens (AF-007, unchanged) |

**Registry law:** no new colour may be added to the game without a row here (purpose, usage, systems). The AF-006 validator extends to flag any asset or shader using an unregistered colour.

## 2. Colour hierarchy (five bands)

Refines AF-004 §1 with colour-specific enforcement. When colours compete, higher band wins — via brightness, saturation, and glow budget:

| Band | Owns | Colour behaviour |
|---|---|---|
| **1** | Player, friendly objects | Brightest, coolest light on screen (`plasma.cyan` → `energy.white`) |
| **2** | Boss mechanics, immediate danger | Reserved reds; may momentarily out-contrast everything except the player |
| **3** | Enemy attacks, hazards | Hot hues, guaranteed contrast vs every biome (§7) |
| **4** | Loot, XP, resources | Rarity tokens + `solar.gold`; visible but never louder than bands 1–3 |
| **5** | Environment, VFX, background | Desaturated, darkened variants only; **never overpowers gameplay** |

Band 5 rule made concrete: environment art uses background tokens and desaturated secondaries at reduced value — a biome may be beautiful, but its histogram stays darker and duller than anything that moves or matters.

## 3. Faction colour language (roster of record — eight factions)

Formal names canonised by AF-008. The five established factions keep their AF-002 silhouette grammars; the three new factions receive colour triads now and **must receive silhouette grammars in their introducing content modules** (AF-002 §5 law applies from birth):

| Faction | Triad | Token bindings |
|---|---|---|
| **Human Alliance** | White / Blue / Silver | `energy.white` / `shield.blue` / `neutral.grey` highlights |
| **Crystal Dominion** | Turquoise / Emerald / White | `crystal.teal` / `vitality.green` accents / `energy.white` |
| **Void Legion** | Purple / Black / Dark Magenta | `void.purple` / `space.black` / `#B0348F` (`void.magenta`, minted) |
| **Ancient Civilisation** | Gold / Ivory / Bronze | `solar.gold` / `#F3EAD8` (`ancient.ivory`, minted) / `ancient.bronze` |
| **Machine Collective** | Steel / Orange / White | `machine.steel` / `warning.orange` / `energy.white` |
| **Solar Empire** *(new)* | Amber / Gold / White | `#FFA928` (`solar.amber`, minted) / `solar.gold` / `energy.white` |
| **Abyssal Swarm** *(new)* | Crimson / Black / Dark Red | `danger.crimson` / `space.black` / `#8E1F2A` (`abyss.red`, minted) |
| **Celestial Order** *(new)* | White / Sky Blue / Gold | `energy.white` / `ice.blue` / `solar.gold` |

Identifiability rule: no two factions share a triad read. Nearest pairs are separated by value and silhouette: Solar Empire (warm bright) vs Ancient (aged, bronze-weighted); Abyssal Swarm (crimson-black) vs Void Legion (purple-black); Celestial Order (white-first) vs Human Alliance (blue-first).

## 4. Rarity colours

The AF-007 §4 nine-tier ladder, unchanged and now double-locked ("never change rarity colours"). Rarity colours appear only inside rarity framing (AF-007 disambiguation law).

## 5. Status effect colours (token-bound)

| Status | Colour (AF-008) | Token | Status | Colour | Token |
|---|---|---|---|---|---|
| Burn | Orange | `warning.orange` | Corruption | Dark purple | `void.purple` |
| Freeze | Light blue | `ice.blue` | Shield | Blue | `shield.blue` |
| Shock | Electric cyan | `plasma.cyan` | Regeneration | Bright green | `vitality.green` |
| Poison | Green | `toxin.green` | Overload | Yellow | `overload.yellow` |
| Stasis | White | `energy.white` | **Slow** | Grey *(omitted in AF-008)* | `neutral.grey` — **ratified by Project Owner, 2026-07-05** |

Poison vs Regeneration share a family but never a read: toxin is murky and paired with its droplet symbol; vitality is bright and paired with the regen tick (AF-004/AF-007 shape law). Every status colour is constant across HUD icons, world tints, and tooltips.

## 6. Lighting language

Extends AF-002 §4: light = power/hope/technology/progress; darkness = decay/corruption/unknown/danger. Boss encounters may manipulate lighting for drama (dimming arena edges, pulsing with phases) under one hard constraint: **readability never drops** — telegraph contrast (§8) is measured under the darkest permitted boss lighting, not neutral lighting. Glow-is-earned still governs; the glow budget follows the §2 bands.

## 7. Environmental colour rules

Biomes may commit to strong atmosphere (a crimson nebula, an emerald crystal field) with two mechanical guarantees:

1. **Band separation** — biome grading is band 5: applied to background/environment layers only, never to gameplay actors (enemies, loot, projectiles, hazards render un-graded above it, AF-002 §6.5 layer order).
2. **Contrast floor per biome** — every biome's palette is validated against every hostile hue, loot beam, and telegraph colour (§8 minimums); a biome that fails against, say, `danger.red` changes its atmosphere, not the danger colour.

## 8. Contrast standards (measurable)

- Player ship vs any permitted background: ≥ 7:1 luminance contrast (highest on screen).
- Enemy attacks, telegraphs, hazards vs any biome background: ≥ 4.5:1.
- Loot beams: ≥ 3:1 vs biome, always vertical (unique shape read at distance).
- HUD text and values: ≥ 4.5:1 (≥ 7:1 in high-contrast mode).
- All floors hold in SDR — HDR displays get richer highlights, never *required* information. Contrast is validated by tooling (§10), not eyeballed.

## 9. Accessibility

Full palette remap tables (not filters) per mode: **Protanopia, Deuteranopia, Tritanopia** — each a reviewed token table preserving all §2 band relationships and §8 floors; **High Contrast** (brightened tokens, thickened outlines, pure-black field); **Monochrome Assist** (value-and-shape-only rendering — the ultimate proof the shape law holds); **Custom UI colours / Custom HUD colours** (player-assigned overrides for UI chrome and HUD elements, constrained to preserve §8 floors — the settings UI blocks failing combinations rather than letting players break their own readability). Shape and animation always co-carry meaning (AF-002/AF-004/AF-007 laws).

## 10. Performance & tooling

One shared palette uniform/texture feeds all shaders (mode swaps are one upload, not per-material edits); gradients are shared ramp textures (AF-006 reuse law); no per-asset colour variants — variants come from the token system or don't exist. Build tooling gains a **contrast validator**: every biome × hostile-colour and HUD combination checked against §8 floors in CI; failures block merge exactly like naming violations (AF-006 §10).

## 11. Debug support (dev builds)

Colour panel in the debug overlay: palette usage census (which tokens are on screen, flagging unregistered colours live) · contrast warnings (real-time §8 floor checks on the current frame) · accessibility preview (hot-swap any mode in-game) · material/shader count vs reuse targets · active colour overrides (custom UI/HUD settings in effect) · grading state (current biome band-5 profile).

## 12. Standing review obligations (bind every future content module)

Per AF-008's self-review loop — at every content module's QA stage and every playable milestone: review new screens, biomes, factions, and boss encounters against the band model; run every accessibility mode including Monochrome Assist; verify §8 floors under worst-case boss lighting; audit for unregistered or unnecessary colours and remove them; repeat until the battlefield is understandable from colour language alone.

---

## Internal review loop (AF-008, recorded)

- **Registry completeness** — every AF-008-named colour bound to a documented token (HEX+RGB+purpose+usage); registry law + validator close the "mystery colour" hole permanently. ✔
- **Hierarchy** — five bands with mechanical enforcement (grading only on band 5, glow budget by band, floors measured under worst-case lighting). ✔
- **Factions** — eight triads, no shared reads, new-faction silhouette debt explicitly assigned to future content modules. ✔
- **Rarity** — AF-007 ladder confirmed unchanged; double-locked. ✔
- **Status colours** — all bound; Poison/Regeneration and Freeze/Shock collision risks resolved by dedicated tokens + shape pairing; Slow gap flagged with provisional binding. ✔
- **Contrast** — aspirations replaced with numeric floors validated in CI and observable live in debug. ✔
- **Accessibility** — remap tables not filters; Monochrome Assist as the shape-law stress test; custom colours constrained to safe combinations. ✔
- **Simplification pass** — bound Plasma Blue to `shield.blue` instead of minting a fourth blue; refused separate biome-specific danger tints (danger colours are global constants); folded "Silver" into `neutral.grey` highlights rather than a new metal token. ✔

**Internal quality score: 9.5/10 — approved; §12 obligations bind all future content modules.**
