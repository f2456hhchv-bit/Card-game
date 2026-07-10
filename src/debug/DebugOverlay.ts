/**
 * Dev-build debug overlay (AF-016 §10). Toggled with the backquote key.
 * Displays the state machine, run, seed, and performance numbers the module
 * requires. Excluded from production by the DEV guard at the call site.
 */
export interface DebugSnapshot {
  gameState: string;
  overlays: readonly string[];
  runPhase: string | null;
  missionSeed: number | null;
  difficulty: string | null;
  build: string | null;
  sessionSeconds: number;
  fps: number;
  lastTransitionMs: number;
  droppedTimeMs: number;
  /** Enemy Director summary: phase, threat, budget, enemy/elite counts (AF-017 §10). */
  director: string | null;
  /** Input summary: context, movement vector, last action (AF-019 §10). */
  input: string | null;
  /** Movement summary: state, speed, boost, contacts (AF-020 §10). */
  movement: string | null;
  /** Combat summary: entities, projectiles, crit rate, defence (AF-021 §10). */
  combat: string | null;
  /** XP summary: level, progress, gems, build bonuses (AF-022 §8). */
  xp: string | null;
  /** Loot summary: ground count vs cap, collected, banked (AF-023 §8). */
  loot: string | null;
  /** Research summary: points, unlocked, live bonuses (AF-024 §7). */
  research: string | null;
  /** Meta ledger: account level, runs, kills, challenges (AF-026 §9). */
  meta: string | null;
  /** Inventory summary: size, storage usage, loadouts (AF-027 §DEBUG). */
  inventory: string | null;
  /** Equipment summary: bonuses, set count, power rating (AF-028 §10). */
  equipment: string | null;
  /** Relic summary: active relics, synergies (AF-029 §9). */
  relics: string | null;
  /** Commander summary: callsign, ability cooldown, ultimate charge (AF-030 §7). */
  commander: string | null;
  /** Ship summary: name, class, energy, ability cooldown (AF-031 §11). */
  ships: string | null;
  /** Weapon summary: name, category/pattern, shots fired, live projectiles, crit rate (AF-032 §DEBUG). */
  weapons: string | null;
  /** Enemy summary: active/elite count, nearest enemy's AI state + telegraph + hull (AF-033 §DEBUG). */
  enemies: string | null;
  /** Boss summary: state, phase, hull, shield, weak points destroyed (AF-035 §DEBUG). */
  boss: string | null;
  /** Biome summary: name, weather, hazard count, events triggered (AF-036 §DEBUG). */
  biome: string | null;
  /** Mission summary: name, RunPhase, objective progress, active modifiers (AF-037 §DEBUG). */
  mission: string | null;
  /** Galaxy summary: current system, region, exploration%, events triggered (AF-038 §DEBUG). */
  galaxy: string | null;
  /** Faction summary: dominant faction, reputation + level, a relationship, events triggered (AF-039 §DEBUG). */
  factions: string | null;
  /** Economy summary: currency balances, active merchant offer count, active Special Economic Event (AF-040 §DEBUG). */
  economy: string | null;
  /** Galaxy Event summary: last World Event, the World State value it touched, events triggered (AF-041 §DEBUG). */
  worldEvents: string | null;
  /** Achievement/Collection summary: achievements completed, extra collection counts, Discovery Log length (AF-042 §DEBUG). */
  achievements: string | null;
  /** Codex summary: entries unlocked, Discovery %, Missing Links, Timeline status (AF-043 §DEBUG). */
  codex: string | null;
  /** Save Framework summary: slice version, Autosave Status, Cloud Status, Backup Count, active profile (AF-044 §DEBUG). */
  saveFramework: string | null;
  /** Audio summary: Music State, active voice count, master mixer level (AF-045 §DEBUG). */
  audio: string | null;
  /** Outlaw summary: squad state, command order, captain status, live mines (AF-046 §DEBUG). */
  outlaws: string | null;
  /** Machine summary: network state, core status, live services, adaptation counts (AF-047 §DEBUG). */
  machines: string | null;
  /** Crystal summary: ecosystem count, resonance strength, live growth zones (AF-048 §DEBUG). */
  crystals: string | null;
  /** Void summary: swarm count, corruption level, live corruption zones (AF-049 §DEBUG). */
  voidSwarm: string | null;
  /** Ancient summary: site count, security stage, alert %, ceiling %, node count (AF-050 §DEBUG). */
  ancientSecurity: string | null;
  /** Xeno summary: hive count, evolution stage, biomass %, link state, acid pools (AF-051 §DEBUG). */
  xenoHive: string | null;
  /** Nomad summary: fleet count, scrap level, command ship state, crew/escort counts (AF-052 §DEBUG). */
  nomadFleets: string | null;
  /** Paragon summary: protocol count, reactor stability %, collapse state, unit/sentinel counts (AF-053 §DEBUG). */
  paragonProtocols: string | null;
  /** Celestial summary: constellation count, per-entity link counts, gravity well count (AF-054 §DEBUG). */
  celestialConstellations: string | null;
  /** Eclipsed summary: expedition count, per-member corruption stages, warden state, mirror %, echoes (AF-055 §DEBUG). */
  eclipsed: string | null;
  /** Conductor summary: pressure, recovery window + trigger, spawn queue, struggle score (AF-056 §DEBUG). */
  conductor: string | null;
  /** Boss Director summary: encounter beat, attack hold, summon/ceremony queues, cinematics (AF-057 §DEBUG). */
  bossDirector: string | null;
  /** Campaign summary: stage, chapter, objectives, story flags, world evolution (AF-068 §DEBUG). */
  campaign: string | null;
  /** Endgame summary: ascension level, milestones, expeditions, research, evolution, legacy (AF-069 §DEBUG). */
  endgame: string | null;
  /** Live-ops summary: live version, content packs, season state, compatibility (AF-070 §DEBUG). */
  liveOps: string | null;
  /** Commander Bond Network summary: total/discovered/maxed bonds, dual ultimates unlocked (AF-130 §DEBUG). */
  bonds: string | null;
  /** Living Expedition Ship summary: name, upgrade totals, rooms, companions, memorial entries (AF-131 §DEBUG). */
  ship: string | null;
  /** Living Galaxy summary: environmental averages, reputation total, chronicle length, current festival, unresolved crime (AF-132 §DEBUG). */
  livingGalaxy: string | null;
  /** Legacy Engine summary: total legacy XP, top category, galactic records set, journal/gift/photo counts (AF-133 §DEBUG). */
  legacy: string | null;
  /** Living Museum summary: quality, restoration projects, donations, visitors, theater/library/audio counts (AF-134 §DEBUG). */
  livingMuseum: string | null;
  /** Chronicle of Humanity summary: planet entries, oral history, books, writable entries, final chronicle preview (AF-135 §DEBUG). */
  chronicle: string | null;
  /** Dynamic Story Engine summary: dominant pillars, pacing bias, campaign theme, reputation title, callbacks (AF-136 §DEBUG). */
  storyEngine: string | null;
  /** Galactic Event Engine summary: tier weights, logged events, mining-boom chain progress (AF-137 §DEBUG). */
  eventEngine: string | null;
  /** Civilisation Engine summary: sample settlement's stage/attributes, megaproject/landmark/immigration counts, social event, government lean, public opinion (AF-138 §DEBUG). */
  civilisationEngine: string | null;
}

export class DebugOverlay {
  private readonly element: HTMLPreElement;
  private visible = true;

  constructor(parent: HTMLElement) {
    this.element = document.createElement("pre");
    this.element.style.cssText = [
      "position:fixed",
      "top:8px",
      "left:8px",
      "margin:0",
      "padding:8px 12px",
      "background:rgba(5,6,10,0.85)",
      "border:1px solid rgba(16,26,56,0.9)",
      "color:#3fd4f5",
      "font:12px/1.5 monospace",
      "z-index:9999",
      "pointer-events:none",
      "white-space:pre",
    ].join(";");
    parent.appendChild(this.element);
    window.addEventListener("keydown", (event) => {
      if (event.key === "`") {
        this.visible = !this.visible;
        this.element.style.display = this.visible ? "block" : "none";
      }
    });
  }

  update(snapshot: DebugSnapshot): void {
    if (!this.visible) return;
    const overlays = snapshot.overlays.length > 0 ? ` +[${snapshot.overlays.join(", ")}]` : "";
    this.element.textContent = [
      `state      ${snapshot.gameState}${overlays}`,
      `run phase  ${snapshot.runPhase ?? "—"}`,
      `seed       ${snapshot.missionSeed ?? "—"}`,
      `difficulty ${snapshot.difficulty ?? "—"}`,
      `build      ${snapshot.build ?? "—"}`,
      `director   ${snapshot.director ?? "—"}`,
      `input      ${snapshot.input ?? "—"}`,
      `movement   ${snapshot.movement ?? "—"}`,
      `combat     ${snapshot.combat ?? "—"}`,
      `xp         ${snapshot.xp ?? "—"}`,
      `loot       ${snapshot.loot ?? "—"}`,
      `research   ${snapshot.research ?? "—"}`,
      `meta       ${snapshot.meta ?? "—"}`,
      `inventory  ${snapshot.inventory ?? "—"}`,
      `equipment  ${snapshot.equipment ?? "—"}`,
      `relics     ${snapshot.relics ?? "—"}`,
      `commander  ${snapshot.commander ?? "—"}`,
      `ships      ${snapshot.ships ?? "—"}`,
      `weapons    ${snapshot.weapons ?? "—"}`,
      `enemies    ${snapshot.enemies ?? "—"}`,
      `boss       ${snapshot.boss ?? "—"}`,
      `biome      ${snapshot.biome ?? "—"}`,
      `mission    ${snapshot.mission ?? "—"}`,
      `galaxy     ${snapshot.galaxy ?? "—"}`,
      `factions   ${snapshot.factions ?? "—"}`,
      `economy    ${snapshot.economy ?? "—"}`,
      `worldEvent ${snapshot.worldEvents ?? "—"}`,
      `achieve    ${snapshot.achievements ?? "—"}`,
      `codex      ${snapshot.codex ?? "—"}`,
      `save       ${snapshot.saveFramework ?? "—"}`,
      `audio      ${snapshot.audio ?? "—"}`,
      `outlaws    ${snapshot.outlaws ?? "—"}`,
      `machines   ${snapshot.machines ?? "—"}`,
      `crystals   ${snapshot.crystals ?? "—"}`,
      `void       ${snapshot.voidSwarm ?? "—"}`,
      `ancient    ${snapshot.ancientSecurity ?? "—"}`,
      `xeno       ${snapshot.xenoHive ?? "—"}`,
      `nomads     ${snapshot.nomadFleets ?? "—"}`,
      `paragon    ${snapshot.paragonProtocols ?? "—"}`,
      `celestial  ${snapshot.celestialConstellations ?? "—"}`,
      `eclipsed   ${snapshot.eclipsed ?? "—"}`,
      `conductor  ${snapshot.conductor ?? "—"}`,
      `bossDir    ${snapshot.bossDirector ?? "—"}`,
      `campaign   ${snapshot.campaign ?? "—"}`,
      `endgame    ${snapshot.endgame ?? "—"}`,
      `liveops    ${snapshot.liveOps ?? "—"}`,
      `bonds      ${snapshot.bonds ?? "—"}`,
      `ship       ${snapshot.ship ?? "—"}`,
      `galaxyLife ${snapshot.livingGalaxy ?? "—"}`,
      `legacy     ${snapshot.legacy ?? "—"}`,
      `museumLife ${snapshot.livingMuseum ?? "—"}`,
      `chronicle  ${snapshot.chronicle ?? "—"}`,
      `story      ${snapshot.storyEngine ?? "—"}`,
      `events     ${snapshot.eventEngine ?? "—"}`,
      `civEngine  ${snapshot.civilisationEngine ?? "—"}`,
      `session    ${snapshot.sessionSeconds.toFixed(1)}s`,
      `fps        ${snapshot.fps.toFixed(0)}`,
      `transition ${snapshot.lastTransitionMs.toFixed(2)}ms (budget 250)`,
      `dropped    ${snapshot.droppedTimeMs.toFixed(1)}ms`,
    ].join("\n");
  }
}
