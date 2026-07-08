# AFTERLIGHT — Campaign Framework

**Authority:** Produced output of AF-068. Extends AF-000 → AF-067 — above all AF-026/035/037's counterKey objective pattern, AF-038's galaxy (whose long-term-goal shelf gets its first producer here), AF-055/057's consume-pattern narrative seam, and the ten authored biomes whose arc the sandbox campaign threads. Every future campaign, expansion, DLC and narrative update extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the campaign exists to support gameplay — story is drained, never blocking; choices add, never remove; progression is deterministic, so every player's galaxy differs because of what they did, not what they rolled.

---

## 1. The campaign is a ledger, not an engine

`CampaignRuntime` is pure, bus-free, RNG-free and clock-free. Its whole input surface is three counter keys fed by real play — mission victories, system arrivals, boss defeats — through AF-026/035/037's exact counterKey/target pattern. Chapters complete strictly in ladder order; counters persist, so banked progress chains later chapters the moment a gate opens ("every stage naturally unlocks the next", tested in both directions).

## 2. The ten-stage ladder

Prologue → Frontier Restoration → Faction Discovery → Ancient Awakening → Galaxy Expansion → Major Crisis → Civilisation Recovery → Endgame Campaign → Final Revelation → Post-Campaign Galaxy. The sandbox campaign ships one chapter per stage (asserted, in order), its unlocks resolution-tested against real content: the Hollow Sentinel, the Singularity Zone biome, the humanFrontier and machineExpanse regions. Its beats thread the arc the biomes already told — the Sentinel standing down, First Light's vacated council seat, "We go to ask it in person."

## 3. Story never pauses gameplay

Narrative queues as beats on the eight registered delivery channels and drains through `consumeStoryBeat()` — the AF-055 echo / AF-057 ceremony seam — one per cadence in the render path, surfacing as the same notice class loot already uses. Nothing in the runtime can block a frame.

## 4. Choices add; nothing removes

"Never permanently remove core content" holds by type: the runtime exposes no remove/clear/revoke/reset operation (asserted over the prototype), and flags, unlocks, world changes and the choice log are append-only. The eight choice domains are a registered shelf awaiting mission/dialogue producers.

## 5. Post-campaign is a state, not an ending

The final chapter has zero objectives — the campaign completes INTO the open galaxy. The runtime accepts progress forever after (asserted under 1,000 further feeds), and the seven post-campaign pillars map totally onto AF-038's `LongTermGoalKind` shelf — dormant since AF-038, given its **first producer** here. The galaxy remains alive forever, literally.

## 6. Personal through determinism

No RNG, no clock: the same play always produces the same campaign (mirrored-runtime asserted). Divergence between players is a function of their choices and their route — which is what "every player experiences a slightly different version of the galaxy" was always supposed to mean.

## 7. Registered shelves

Ten stages, eight chapter-content kinds, eight world-progression kinds, eight choice domains, eight story-delivery channels, eight major-event kinds, eight milestone-unlock kinds, seven post-campaign kinds — all counted in tests; future campaign, expansion and DLC modules bind against them.

---

## Internal review loop (AF-068, recorded)

- **Zero engine changes** — one pure runtime in the AF-056/057 orchestration class; three composition-root feed points; one overlay line; AF-038's goal shelf produced. ✔
- **Never pauses, never removes, by structure** — consume-seam delivery and a no-removal-API prototype assertion; append-only everything. ✔
- **The ladder holds** — one chapter per stage in order; halts at gates regardless of banked surplus; chains through banked chapters on a single feed; payload granted exactly once. ✔
- **Post-campaign forever** — zero-objective final chapter, 1,000 post-completion feeds non-throwing and non-regressing, long-term goals exposed. ✔
- **Sweep proof** — a 1,000-playthrough seeded sweep in arbitrary feed orders always reaches the post-campaign galaxy with monotone stages and flags; mirrored-runtime determinism. ✔
- **Reachable, live** — real travel banked a system, launch, the campaign on the overlay (`prologue · "Afterlight" (1/10) · obj 0/1`), zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the stage ladder, choice domains, delivery channels, major events, milestone kinds and post-campaign pillars bind at future campaign, expansion and DLC modules.**
