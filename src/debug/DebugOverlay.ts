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
      `session    ${snapshot.sessionSeconds.toFixed(1)}s`,
      `fps        ${snapshot.fps.toFixed(0)}`,
      `transition ${snapshot.lastTransitionMs.toFixed(2)}ms (budget 250)`,
      `dropped    ${snapshot.droppedTimeMs.toFixed(1)}ms`,
    ].join("\n");
  }
}
