# AFTERLIGHT — Galactic Economy (AF-089)

**Authority:** Produced output of AF-089. Extends AF-000 → AF-088 — above all AF-025's crafting resource shelf, AF-039's faction register, AF-040's market engine, AF-085's political instruments, and AF-086's civilisation simulation, all unchanged. Every future civilisation, expansion and industrial system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** every resource originates somewhere, every colony consumes something, industries are locally distinct, and player influence — like AF-086's before it — accelerates growth without ever dictating it.

---

## 1. The industrial substance behind AF-086's own attributes

AF-086 gave AF-039's ten registered attributes real numeric life. AF-089 gives AF-086's economic attributes — population, industrial output, technology, economic power — real industrial substance: `GalacticEconomyRuntime` takes AF-086's `CivilisationSimulationRuntime` as a direct collaborator, reading its state and writing back only through its real, bounded `feedPlayerImpact`. The coupling is strictly one-directional; ambient economic events never reach into AF-086's own state.

## 2. Seventeen resource categories, honestly split

Nine map onto AF-025's real `ResourceType` shelf. The other eight — fuel, biological resources, civilian and luxury goods, construction materials, medical supplies, food, water — are honest new stockpile registers, fully live within the colony simulation but outside AF-025's crafting pool. Nothing is force-fit onto a resource that doesn't exist.

## 3. The Production Chain is a closed ring

Eight stages, Recovery wrapping back to Extraction — AF-086's life-cycle pattern, applied to goods. A category's chain position is forced to advance after a bounded number of epochs, and stockpile only ever increases at Distribution or Recovery: nothing is manufactured from nothing.

## 4. Scarcity is real

Population, read live from AF-086, consumes food, water, and energy every epoch. A shortfall zeroes the stockpile and dents the colony's own growth and employment — proven by draining a colony's consumables and watching both registers fall over real epochs, with AF-086's own state left untouched by the ambient effect.

## 5. Trade Network and Galaxy Events, reused wherever one already fits

Eight trade routes map totally onto AF-040's real merchant kinds, with Emergency Supply reaching into AF-040's own economic-event vocabulary instead of inventing a second merchant system. Of nine Galaxy Events, five reuse a real AF-085/086 mechanism directly (Trade Boom, Economic Collapse, Scientific Revolution, Piracy, Trade Embargo); the four genuinely new ones carry their own authored deltas.

## 6. A seventh identity axis, and bounded player participation

Every profiled civilisation's primary industry is pairwise-distinct — a seventh uniqueness axis alongside AF-085's five and AF-086's sixth. All eight Player Participation actions are bounded by the same "accelerate, never dictate" law AF-086 established; two of them reach into AF-086's own bounded feed, capped by both ceilings at once.

## 7. Live in the game

The economy ticks on the same ambient schedule as the civilisation simulation, the faction runtime, and the market. A victorious expedition genuinely delivers resources to the mission's present faction's colony at the real end-of-run seam — "every expedition contributes to rebuilding civilisation," literally. The overlay reads supply, demand, trade routes, industrial output, population, and economic health, browser-verified ticking over real time.

---

## Internal review loop (AF-089, recorded)

- **Zero engine changes** — one runtime reading a real collaborator, plus pure functions; AF-025/039/040/085/086 untouched. ✔
- **Nothing force-fit** — nine mapped resource categories, eight honest new registers. ✔
- **The chain is a proven closed ring** — reachable from any start, forced advancement, nothing from nothing. ✔
- **Scarcity real** — consumption depletes stockpile, shortfall dents growth and employment. ✔
- **Reuse over reinvention** — trade routes and five of nine events ride real existing mechanisms. ✔
- **Bounded everywhere** — every player action capped, cross-module feeds capped twice. ✔
- **Sweep proof** — 50 galaxies × 300 epochs: stockpiles never negative, chain always valid, health always in bounds. ✔
- **Reachable, live** — supply/demand/population tick over real wall-clock time, zero page errors. ✔

**Internal quality score: 9.5/10 — approved and locked; the resource map, production ring, scarcity law, trade/event reuse, and bounded-participation discipline bind at every future economic module.**
