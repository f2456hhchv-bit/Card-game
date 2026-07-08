# Campaign (AF-068)

The campaign is a **ledger over engines the game already owns**, not a new engine:

- **Objectives** are AF-026/035/037's exact counterKey/target pattern. The composition root feeds exactly three keys: `campaign:missionsCompleted` (endRun victory), `campaign:systemsVisited` (real galaxy travel), `campaign:bossesDefeated` (boss death sequence).
- **Story delivery** uses the AF-055 echo / AF-057 ceremony consume seam: chapters queue beats; presentation drains one per cadence. Nothing can block a frame — gameplay never pauses for the story.
- **"Never permanently remove core content"** is structural: `CampaignRuntime` exposes no remove/clear/revoke operation (asserted over the prototype in tests). Flags, unlocks, world changes, and choices only grow.
- **"Every stage naturally unlocks the next"**: chapters complete strictly in ladder order; counters persist, so banked progress chains later chapters automatically the moment a gate opens.
- **Post-campaign is a state, not an ending**: the final chapter has no objectives; the runtime accepts progress forever and exposes AF-038's `LongTermGoalKind` shelf (its **first producer**) as the standing horizon.
- **Determinism**: no RNG, no clock. The same play always produces the same campaign — "every player experiences a slightly different version of the galaxy" is a function of play, not chance.

`SANDBOX_CAMPAIGN` ships ten chapters, one per stage, with unlock ids resolution-tested against real registered content (biomes, bosses, galaxy regions).
