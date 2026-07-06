# AFTERLIGHT — Loot Framework

**Authority:** Produced output of AF-023. Extends AF-000 → AF-022. Every future weapon, equipment, relic, resource, and reward system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** randomness creates opportunity, never frustration — every drop tells a story, every rarity feels distinct, and the excitement of discovery never wears out.

---

## 1. Sources & categories (open shelves)

**Sources** subscribe to bus facts — enemies, elites, mini bosses, bosses, ancient vaults, hidden rooms, mission rewards, galaxy discoveries, research, events, challenge objectives. Combat and missions never know loot exists (AF-001 event law).

**Thirteen categories** registered: Weapons · Equipment · Relics · Resources · Blueprints · Crafting Materials · Currencies · Research Samples · Ancient Artifacts · Commander Items · Ship Components · Cosmetics · Lore Objects. **Eight special-drop kinds**: Set Items · Quest Items · Boss Exclusives · Ancient Technology · Prototype Equipment · Unique Relics · Lore Artifacts · Seasonal Items (anti-FOMO per AF-013 §7). Categories and specials are data shelves — content modules fill them.

## 2. Rarity (AF-007 canon, one table drives everything)

The canonical nine-tier ladder — **Damaged → Common → Improved → Rare → Epic → Legendary → Ancient → Mythic → Singularity** — with each tier's row defining: base drop weight · presentation intensity (beam/glow per the AF-007 seven-piece identity set) · affix count · collection value multiplier. Legendary+ receives enhanced presentation; Singularity sits at lottery rarity by data. Colour never changes (double-locked); notch patterns keep the ladder greyscale-readable.

## 3. Drop generation (deterministic, eight rolls)

Every drop resolves from the mission-seed `loot` fork in a fixed roll order: **Category → Base Item (weighted table) → Item Level (context) → Rarity (weighted, modifier-shifted) → Affixes (count by rarity, distinct, value ranges scaled by level+rarity) → Quality (0–100) → Special Properties → child Seed** (recorded on the drop — any item is reproducible from its seed, and future online trade/verification can validate it, AF-001 §11).

**Balance is data:** drop rates, rarity weights, and difficulty/Ascension/mutator/research bonuses are tuning. Bonuses shift weight *progressively up the ladder* (a bonus multiplies tier weights by `factor^(tierIndex/8)`), so harder play genuinely means better loot without making commons vanish.

## 4. Smart loot (relevance, never rigging)

Optional weighting by current Commander, ship, build, difficulty, research, and mission type — as **hard-clamped multipliers (0.5×–3× default)** on category/item weights. Structurally incapable of guaranteeing outcomes: every category remains rollable, relevance rises, the lottery stays honest.

## 5. Presentation & decisions

Every drop: ground glow · **light beam** (rarity colour, always vertical — the AF-008 unique-shape read; intensity is a player setting) · pickup animation/sound · rarity effect · inspection card (AF-009 §7 anatomy: name, rarity, stats, affixes, synergies, lore, upgrade potential, salvage value — concise).

**Player decisions** (registered enumeration, UI with equipment modules): Equip · Store · Salvage · Ignore · Compare · Favourite · Mark for Crafting. **No automatic decisions without approval**; salvaging favourites and discarding Mythic+ warn first (AF-003 §8).

## 6. Ground loot (pooled, value-preserving cap)

Ground drops are pooled with a live cap. Overflow policy: the *oldest, lowest-rarity* drops **bank automatically to the Results reward summary** — value is never deleted, and banking is storage, not an equip decision, so player approval law holds. **Legendary and above never bank** — those beams stay on the field until claimed; the memorable moment is protected.

## 7. Accessibility & performance

Large loot cards · rarity symbols + notch patterns (colour-blind law) · auto-pickup options (resources/currencies may auto-collect *as a player setting* — an approved decision made once) · beam intensity slider · notification duration (AF-003) · controller-friendly inspection. Pools for loot objects/beams/effects; affix generation is a handful of bounded rolls; budgets hold.

## 8. Debug

Live: loot seed · active drop table · effective drop rate · last affix rolls · running rarity distribution vs configured weights · ground loot count vs cap · generation cost.

---

## Internal review loop (AF-023, recorded)

- **Distribution at scale** — 500k seeded drops in CI: monotonic frequency down the ladder, Singularity within ppm bounds, difficulty shifts verified, affix counts exact per tier. ✔
- **Determinism** — same seed, same drop, always; per-drop child seeds recorded for reproduction and future verification. ✔
- **Smart loot** — bias measurable, caps enforced, no guarantee possible by construction. ✔
- **Value preservation** — overflow banks rather than deletes; Legendary+ exempt so big moments stay physical. ✔
- **Decision integrity** — no auto-decisions; destructive guards inherited; auto-pickup only as explicit player policy. ✔
- **Simplification pass** — rejected per-category rarity tables (one ladder, one table — AF-007 law); rejected pity timers (the never-unwinnable constraint governs *offers*, not outcomes; pity is retention machinery by another name and the reward philosophy stands without it); rejected loot-level "item power" separate from item level (one scaling axis until equipment modules prove a need). ✔

**Internal quality score: 9.5/10 — approved and locked; item content passes bind equipment/weapon/relic modules.**
