# AFTERLIGHT — World Building & Canon Framework

**Authority:** Produced output of AF-010. Extends AF-000 → AF-009 and the Master Constitution. Every story, weapon, ship, Commander, faction, biome, technology, and expansion must obey this document. **If something contradicts it, it does not belong in Afterlight.** Extended, never replaced.
**Binding rule of the whole document:** wonder comes from uncovering truth. Nothing is magical; everything has discoverable scientific principles; every mystery exists on purpose.

---

## 1. Established history (canon facts)

These are fixed. Future modules build on them and may deepen them, but never rewrite them without explicit narrative justification approved by the Project Owner:

1. Humanity once spanned the galaxy as part of a flourishing interstellar civilisation.
2. A catastrophic event — **the Collapse** (working canonical name) — fractured that civilisation. Its cause is *deliberately unresolved* (§10).
3. Ancient technologies were abandoned; entire star systems vanished from contact and record; knowledge fragmented.
4. Only isolated colonies remain, disconnected and diminished.
5. The player is one of the last surviving **Commanders** (AF-000), leading humanity's effort to reconnect the stars and rebuild civilisation.
6. Civilisations far older than humanity's expansion existed, and their remains — megastructures, archives, machines — persist throughout the galaxy.

## 2. The Afterlight (the central phenomenon)

Canon: the Afterlight is the **lingering energy left behind by the collapse of an advanced civilisation** — a residue that saturates regions of the galaxy. It measurably influences: technology (ancient devices still draw on it), navigation (routes and regions are shaped by its density), research (studying it unlocks rediscovered science), biomes (environments transformed by saturation), artifacts, ancient machines, and living structures (life and architecture that have adapted to — or been built from — it).

Rules for using it:
- The Afterlight behaves **consistently**: modules may reveal new properties, never contradictory ones. Its known behaviour is tracked in the canon ledger (§10).
- It is energy with physics, not magic: everything it does must be scientifically framable, even when not yet explained in-game.
- **Its true nature is the game's spine mystery**, revealed gradually across the whole game. No module may fully explain it; partial revelations are planned reveals recorded in §10, approved by the Project Owner.
- The visual layer already speaks it: light-is-hope (AF-002 §4) is literal — the glow the player carries and restores *is* Afterlight energy. Galaxy restoration reading as "light returning" is canon made visible.

## 3. Universal laws (physics of the fiction)

1. Technology always has an explanation — if the explanation isn't revealed yet, it still *exists* (written in the ledger, even if only as a sentence).
2. Energy obeys consistent rules; no source is infinite, no effect is free.
3. Space phenomena have observable, repeatable behaviour — players can learn and exploit them (knowledge is combat power, per the Constitution's Combat Philosophy).
4. Ancient technology appears impossible **until researched** — "impossible" is always a statement about the observer, not the universe.
5. Nothing exists because it is "magical." The word has no referent in this universe.
6. Every phenomenon has discoverable scientific principles, and discovery is gameplay (research loop, AF-000).

## 4. Themes

Hope · Curiosity · Discovery · Perseverance · Sacrifice · Legacy · Reconstruction · Exploration. The tonal law: **the unknown inspires curiosity before fear.** Afterlight's dark galaxy is an invitation, not a horror show — danger is real, but the emotional lead is always "what's out there?" (AF-009 §4 voice: optimism despite overwhelming odds). Exploration over conquest: the player reconnects and restores; they do not subjugate.

## 5. Factions (requirements binding all eight)

The roster of record is AF-008 §3: Human Alliance, Crystal Dominion, Void Legion, Ancient Civilisation, Machine Collective, Solar Empire, Abyssal Swarm, Celestial Order. Each faction's introducing content module must deliver all nine attributes:

**History · Motivation · Technology · Visual identity** (colour triads exist — AF-008; silhouettes exist for the first five — AF-002; the three newer factions owe silhouettes at introduction) **· Military doctrine · Scientific philosophy · Territory · Relationships** (with every other faction — the relationship matrix lives in the ledger) **· Internal conflicts.**

Moral law: **no faction is purely good or evil; each believes it is acting rationally.** Even the Abyssal Swarm and Void Legion have an internal logic a player can come to understand — comprehension, not caricature, is what makes enemies interesting for hundreds of hours. Faction tech aligns with the technology ladder (§6): Crystal Resonance ↔ Crystal Dominion, Void Manipulation ↔ Void Legion, Autonomous Intelligence ↔ Machine Collective, and the Ancient Civilisation is the primary source of Ancient Relics.

## 6. Technology ladder

Canonical fields, progressing logically: **Fusion Energy → Quantum Drives → Gravitational Engineering → Nanotechnology → Autonomous Intelligence → Crystal Resonance → Void Manipulation → Ancient Relics** (roughly ascending order of how much rediscovery they require; the last three are Afterlight-entangled). Rules: future discoveries extend existing science, never invalidate it; research (AF-000 loop) is the in-game act of climbing this ladder; weapon/ship/equipment modules must place their technology on it (the field a thing belongs to is part of its data).

## 7. The galaxy & biology

**Galaxy contents (pre-seeding the Galaxy System and biome modules):** Core Worlds · Frontier Systems · Dead Civilisations · Ancient Megastructures · Research Stations · Trade Routes · Nebulae · Void Regions · Crystal Systems · Machine Sectors. Placement law: every location contributes to the history of the universe — a sector with no story reason to exist fails canon review (the filler ban applied to geography).

**Biology:** alien life evolves according to its environment. Every species carries: evolutionary history, adaptations, ecological role, behavioural patterns, weaknesses, strengths. **No creature exists solely to become an enemy** — combat behaviour must emerge from ecological behaviour (a swarm defends a nest; a predator hunts what it eats). This is what makes enemy variety feel discovered rather than manufactured, and it hands enemy-design modules their behavioural blueprints for free.

## 8. Ancient civilisations & the player's place

Ancient societies read as: powerful, advanced, elegant, mysterious — and ultimately **understandable**. Their history is reconstructable; players assemble it piece by piece through exploration (AF-009 lore layers 3–4). Ancient aesthetics follow AF-002 §5 (massive, elegant, timeless, thin light seams).

The player matters — and is not the centre of the universe. Civilisations rose and fell long before them; their actions influence the **future**, never the past. The galaxy does not orbit the Commander: it was here first, and its indifference to humanity's collapse is precisely what makes the player's defiance of it heroic (theme: perseverance).

## 9. Lore delivery & expansion rules

**Delivery (discovered, never force-fed — AF-009 §6 layers):** Codex · Recovered Logs · Research entries · Artifacts · Environmental storytelling · Boss encounters (every boss embodies a piece of canon) · Ancient Archives · *Commander Conversations (future flag)*.

**Expansion rules (binding on every future expansion):** respect existing canon · expand logically · **answer previous mysteries and create new ones** (the mystery economy must never run dry or inflate — tracked in §10) · never rewrite established history without explicit, Project-Owner-approved narrative justification.

## 10. The canon ledger (living instrument)

The AF-010 debug requirements (canon references, lore dependencies, faction relationships, timeline status, narrative consistency) are realised **now** as a documentation instrument, and later as data-driven codex tooling. `docs/canon/` will hold, from the first content module onward:

- **`LEDGER.md`** — every established canon fact, with the module that established it (canon references / dependencies).
- **Open mysteries register** — each mystery, its purpose, and its planned resolution status: *open · partially revealed (where) · resolved (where)*. Founding entries: the true nature of the Afterlight (spine mystery — resolution owner-gated); the cause of the Collapse; the fate of the vanished systems; the identity and fate of the Ancient Civilisation; the origin of the Abyssal Swarm.
- **Faction relationship matrix** — 8×8, filled in as factions are introduced.
- **Timeline** — ordered eras (pre-expansion → galactic civilisation → the Collapse → fragmentation → now), dated relatively until the owner fixes absolute dates.

Every content module's canon review checks its additions into the ledger; the AF-006 validator gains a codex-side check (every lore entry references ledger facts or registered mysteries) when narrative data lands. Runtime debug (codex completion, consistency warnings) arrives with the codex system.

## 11. Canon quality control (every new idea)

Does it fit the universe? · Does it respect established science? · Does it strengthen the mystery? · Does it create future storytelling opportunities? · Does it align with the Afterlight themes? — any "No" returns it for redesign. This joins the Constitution's Design Decision Matrix in every content module's QA sheet.

## 12. Performance

Lore is data (AF-001): codex entries are content records, lazy-loaded (AF-009 §10); environmental storytelling composes reusable assets (AF-006) rather than bespoke set pieces; narrative systems are modular and event-driven like everything else. 60 FPS floors hold — the universe's depth costs words, not frames.

## 13. Standing review obligations (bind every future content module)

Per AF-010's self-review loop — at every content module's canon review: check new factions, biomes, Commanders, bosses, technologies, codex entries, and environmental stories against §§1–11; verify scientific and thematic consistency; verify ledger entries are written (facts) or registered (mysteries); remove contradictions on sight; repeat until every addition feels like it was always part of the universe.

---

## Internal review loop (AF-010, recorded)

- **Coherence** — one spine mystery (the Afterlight), one fixed history, consistent physics; the visual language's light-is-hope is now canonically literal, closing the loop between AF-002 and the fiction. ✔
- **Scientific consistency** — six universal laws; "impossible until researched" makes rediscovery the engine of both research gameplay and wonder. ✔
- **Faction depth** — nine-attribute requirement with the no-pure-evil law; tech ladder alignment gives each faction scientific identity; silhouette debt for the three new factions carried forward explicitly. ✔
- **Mystery economy** — expansions must answer and create mysteries; the open-mysteries register makes that auditable instead of vibes-based. ✔
- **Player placement** — important but not central; influence flows only forward in time. ✔
- **Scalability** — ledger + relationship matrix + timeline scale to decades of storytelling; every debug requirement has a concrete instrument. ✔
- **Simplification pass** — resisted defining the Collapse's cause, the Ancients' fate, or absolute dates (owner-gated mysteries, not gaps); rejected a ninth "neutral traders" faction as unfounded by any module; kept the Afterlight's known influences to the module's seven categories. ✔

**Internal quality score: 9.5/10 — approved; §13 obligations bind all future content modules.**
