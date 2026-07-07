/**
 * Composition root (AF-001 §4). Builds the Event Bus, state machine, game
 * loop, and debug overlay, then walks the AF-016 primary loop with
 * placeholder screens. Rendering, input, and combat arrive with
 * AF-017 → AF-021; this skeleton proves the state flow they attach to.
 */
import { EventBus } from "./core/events/EventBus";
import type { GameEvents } from "./core/events/GameEvents";
import { GameLoop } from "./core/time/GameLoop";
import { Log } from "./core/log/Log";
import { Rng } from "./core/rng/Rng";
import { StateMachine } from "./core/state/StateMachine";
import {
  GAME_TRANSITIONS,
  OVERLAY_HOSTS,
  type GameStateId,
} from "./game/states/GameStates";
import {
  advancePhase,
  createRunSession,
  type RunSessionRecord,
} from "./game/session/RunSession";
import { EnemyDirector } from "./game/director/EnemyDirector";
import { DEFAULT_DIRECTOR_TUNING } from "./game/director/directorTuning";
import { ActionInput } from "./engine/input/ActionInput";
import { KeyboardMouseAdapter } from "./engine/input/KeyboardMouseAdapter";
import { GamepadAdapter } from "./engine/input/GamepadAdapter";
import { DEFAULT_BINDINGS, DEFAULT_INPUT_TUNING } from "./engine/input/inputTuning";
import { Camera } from "./engine/camera/Camera";
import { DEFAULT_CAMERA_TUNING, type CameraMode } from "./engine/camera/cameraTuning";
import { PlayerMovement, type Obstacle } from "./game/movement/PlayerMovement";
import { resolveDamage, NEUTRAL_MODIFIERS } from "./game/combat/DamagePipeline";
import { DefenceState } from "./game/combat/DefenceState";
import { TARGET_SELECTORS, type TargetCandidate } from "./game/combat/targetPriority";
import { DEFAULT_COMBAT_TUNING } from "./game/combat/combatTuning";
import type { SpawnDirective } from "./game/director/EnemyDirector";
import { Pool } from "./core/pool/Pool";
import { XpSystem } from "./game/progression/XpSystem";
import { XpPickups } from "./game/progression/XpPickups";
import { UpgradePool } from "./game/progression/UpgradePool";
import { DEFAULT_XP_TUNING, type UpgradeDefinition } from "./game/progression/xpTuning";
import { generateDrop, type DropTableEntry, type LootDrop } from "./game/loot/LootGenerator";
import { GroundLoot } from "./game/loot/GroundLoot";
import { DEFAULT_LOOT_TUNING, RARITY_LADDER, RARITY_TABLE } from "./game/loot/lootTuning";
import { SaveSlice } from "./core/save/SaveSlice";
import { LocalStorageAdapter } from "./core/save/SaveStorage";
import { ResearchTree, type ResearchSaveData } from "./game/research/ResearchTree";
import { SANDBOX_RESEARCH_TREE } from "./game/research/researchData";
import { CraftingSystem, type CraftingSaveData } from "./game/crafting/CraftingSystem";
import {
  DEFAULT_CRAFTING_TUNING,
  SANDBOX_RECIPES,
  STARTING_BLUEPRINTS,
} from "./game/crafting/craftingData";
import { MetaProgression, type MetaSaveData } from "./game/meta/MetaProgression";
import { ACCOUNT_XP_AWARDS, SANDBOX_CHALLENGES } from "./game/meta/metaData";
import { Inventory, type InventorySaveData } from "./game/inventory/Inventory";
import { DEFAULT_INVENTORY_TUNING } from "./game/inventory/inventoryData";
import { validateLoadout, aggregateLoadout } from "./game/equipment/EquipmentAggregate";
import { SANDBOX_EQUIPMENT, SANDBOX_SETS } from "./game/equipment/equipmentData";
import { RelicSystem } from "./game/relics/RelicSystem";
import { SANDBOX_RELICS } from "./game/relics/relicData";
import { CommanderRuntime } from "./game/commanders/CommanderRuntime";
import { SANDBOX_COMMANDERS } from "./game/commanders/commanderData";
import { ShipRuntime } from "./game/ships/ShipRuntime";
import { SANDBOX_SHIPS } from "./game/ships/shipData";
import { WeaponRuntime } from "./game/weapons/WeaponRuntime";
import { SANDBOX_WEAPONS } from "./game/weapons/weaponData";
import { stepProjectile } from "./game/weapons/ProjectileBehaviour";
import { StatusEngine } from "./game/combat/StatusEngine";
import { DebugOverlay } from "./debug/DebugOverlay";

const app = document.getElementById("app");
if (!app) throw new Error("Missing #app root element");

const log = new Log({
  sink: import.meta.env.DEV
    ? (entry) => console[entry.level === "debug" ? "log" : entry.level](
        `[${entry.system}] ${entry.message}`,
        entry.data ?? "",
      )
    : undefined,
});

const bus = new EventBus<GameEvents>();

let session: RunSessionRecord | null = null;
let sessionMs = 0;
let director: EnemyDirector | null = null;

const input = new ActionInput(DEFAULT_INPUT_TUNING, DEFAULT_BINDINGS);
new KeyboardMouseAdapter(input).attach();
const gamepad = new GamepadAdapter(input);

// Placeholder expedition arena (real arenas arrive with biome modules).
const ARENA = { minX: 0, minY: 0, maxX: 60, maxY: 34 };
const ARENA_OBSTACLES: readonly Obstacle[] = [
  { minX: 14, minY: 8, maxX: 18, maxY: 12 },
  { minX: 40, minY: 20, maxX: 46, maxY: 23 },
  { minX: 26, minY: 26, maxX: 34, maxY: 28 },
];

const camera = new Camera(DEFAULT_CAMERA_TUNING, 32, 18);
let movement: PlayerMovement | null = null;
let sandboxCanvas: HTMLCanvasElement | null = null;

// ── Sandbox combat (AF-021): director directives materialise as drones,
// a test cannon fires back through the real pipeline. Replaced by proper
// enemy/weapon modules later; the framework underneath is the deliverable.
interface Drone {
  id: string;
  x: number;
  y: number;
  hull: number;
  maxHull: number;
  elite: boolean;
  alive: boolean;
  contactCooldownMs: number;
  /** AF-032: weapons apply statuses through this same engine — no per-drone reimplementation. */
  status: StatusEngine;
}

interface TestProjectile {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  ttlMs: number;
  live: boolean;
  // AF-032: fields ProjectileBehaviour.stepProjectile() needs, plus pierce bookkeeping it owns.
  originX: number;
  originY: number;
  elapsedMs: number;
  bouncesRemaining: number;
  reversed: boolean;
  behaviour: (typeof SANDBOX_WEAPONS)[number]["projectileBehaviour"];
  pierceRemaining: number;
}

interface DamagePopup {
  x: number;
  y: number;
  text: string;
  critical: boolean;
  ttlMs: number;
  live: boolean;
}

const projectilePool = new Pool<TestProjectile>({
  create: () => ({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    ttlMs: 0,
    live: false,
    originX: 0,
    originY: 0,
    elapsedMs: 0,
    bouncesRemaining: 0,
    reversed: false,
    behaviour: "straight",
    pierceRemaining: 0,
  }),
  reset: (p) => (p.live = false),
});
const popupPool = new Pool<DamagePopup>({
  create: () => ({ x: 0, y: 0, text: "", critical: false, ttlMs: 0, live: false }),
  reset: (p) => (p.live = false),
});

let drones: Drone[] = [];
let projectiles: TestProjectile[] = [];
let popups: DamagePopup[] = [];
let playerDefence: DefenceState | null = null;
let combatRng: Rng | null = null;
let droneCounter = 0;
let hitCount = 0;
let critCount = 0;
const DRONE_PACKET = { baseDamage: 6, kind: "direct", school: "physical", critChance: 0, critMultiplier: 1 } as const;

// ── Sandbox XP & upgrades (AF-022): kills drop gems, gems level you up,
// levels present real build choices. Placeholder upgrade content — the
// pool/curve/pickup framework underneath is the deliverable.
const sandboxBuild = {
  weaponBonus: 0,
  critBonus: 0,
  fireIntervalScale: 1,
  speedStacks: 0,
  magnetBonus: 0,
  researchWeaponBonus: 0, // AF-024 → AF-021 pipeline research stage
  researchLootBonus: 0, // AF-024 → AF-023 ladder shift
  equipmentWeaponBonus: 0, // AF-028 → AF-021 pipeline equipment stage
};

const SANDBOX_UPGRADES: UpgradeDefinition[] = [
  { id: "damage", category: "weaponUpgrade", name: "Focused Coils", description: "+15% weapon damage", weight: 10, maxStacks: 5 },
  { id: "firerate", category: "weaponUpgrade", name: "Rapid Cycler", description: "+14% fire rate", weight: 10, maxStacks: 5 },
  { id: "crit", category: "critical", name: "Precision Optics", description: "+5% critical chance", weight: 6, maxStacks: 4 },
  { id: "speed", category: "movement", name: "Tuned Thrusters", description: "+8% movement speed", weight: 6, maxStacks: 5 },
  { id: "barrier", category: "shield", name: "Emergency Barrier", description: "+20 barrier now", weight: 5, maxStacks: null },
  { id: "magnet", category: "resource", name: "Collection Field", description: "+1.5 magnet radius", weight: 4, maxStacks: 3 },
];

function playerPacket() {
  const commanderCritDamage = commanderRuntime?.bonuses.criticalDamage ?? 0;
  return {
    baseDamage: 9,
    kind: "direct",
    school: "energy",
    critChance: 0.15 + sandboxBuild.critBonus,
    critMultiplier: 2 + commanderCritDamage,
  } as const;
}

function applyUpgrade(id: string): void {
  switch (id) {
    case "damage":
      sandboxBuild.weaponBonus += 0.15;
      break;
    case "firerate":
      sandboxBuild.fireIntervalScale *= 0.86;
      break;
    case "crit":
      sandboxBuild.critBonus += 0.05;
      break;
    case "speed":
      sandboxBuild.speedStacks += 1;
      movement?.addModifier({
        id: "upgrade-speed",
        kind: "speedMultiplier",
        multiplier: 1 + 0.08 * sandboxBuild.speedStacks,
        durationMs: Number.MAX_SAFE_INTEGER,
      });
      break;
    case "barrier":
      playerDefence?.addBarrier(20);
      break;
    case "magnet":
      sandboxBuild.magnetBonus += 1.5;
      break;
  }
}

let xpSystem: XpSystem | null = null;
let xpPickups: XpPickups | null = null;
let upgradePool: UpgradePool | null = null;
let currentOffer: readonly UpgradeDefinition[] = [];

// ── Sandbox loot (AF-023): elites always drop, drones sometimes; beams on
// the field, pickups announced. Placeholder drop table — the generator,
// rarity ladder, and ground-loot policy underneath are the deliverable.
const SANDBOX_DROP_TABLE: DropTableEntry[] = [
  { baseItemId: "PROTO_CANNON", category: "weapon", weight: 10 },
  { baseItemId: "HULL_PLATING", category: "equipment", weight: 10 },
  { baseItemId: "STRANGE_RELIC", category: "relic", weight: 4 },
  { baseItemId: "SALVAGED_ALLOY", category: "craftingMaterial", weight: 10 },
  { baseItemId: "RESEARCH_CORE", category: "researchSample", weight: 6 },
];

interface LootNotice {
  text: string;
  colour: string;
  ttlMs: number;
}

let groundLoot: GroundLoot | null = null;
let lootRng: Rng | null = null;
let lootNotices: LootNotice[] = [];
let lootBankedCount = 0;
let lootCollectedCount = 0;

// ── Research (AF-024): permanent progression through a real save slice.
const researchSlice = new SaveSlice<ResearchSaveData>({
  key: "research",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({ points: 0, unlocked: [], revealed: [], totalPointsEarned: 0 }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

const researchTree = new ResearchTree(SANDBOX_RESEARCH_TREE, (node) =>
  bus.emit("ResearchUnlocked", { nodeId: node.id, category: node.category }),
);

function persistResearch(): void {
  void researchSlice.save(researchTree.toSave());
}

/** Research is never lost: points bank immediately on sample collection. */
function bankResearchSample(drop: LootDrop): void {
  const tierBonus = RARITY_LADDER.indexOf(drop.rarity);
  const amount = 3 + tierBonus;
  researchTree.addPoints(amount);
  bus.emit("ResearchPointsGained", { amount });
  if (tierBonus >= RARITY_LADDER.indexOf("epic")) {
    if (researchTree.reveal("ancient-conduit")) {
      lootNotices.push({ text: "HIDDEN DISCOVERY · ANCIENT CONDUIT", colour: "#9b5cff", ttlMs: 2400 });
    }
  }
  persistResearch();
}

// ── Crafting / Lightforge (AF-025): persistent materials, blueprints, hangar.
const craftingSlice = new SaveSlice<CraftingSaveData>({
  key: "crafting",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({ materials: {}, blueprints: [...STARTING_BLUEPRINTS], hangar: [] }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

const crafting = new CraftingSystem(
  SANDBOX_RECIPES,
  DEFAULT_CRAFTING_TUNING,
  (nodeId) => researchTree.isUnlocked(nodeId),
  (blueprintId) => bus.emit("BlueprintUnlocked", { blueprintId }),
);

function persistCrafting(): void {
  void craftingSlice.save(crafting.toSave());
}

/** Crafting materials bank immediately on collection (nothing is wasted). */
function bankCraftingMaterial(drop: LootDrop): void {
  const tierIndex = RARITY_LADDER.indexOf(drop.rarity);
  crafting.addMaterial("commonMaterials", 2 + tierIndex);
  if (tierIndex >= RARITY_LADDER.indexOf("rare")) crafting.addMaterial("rareAlloys", 1);
  persistCrafting();
}

// ── Meta progression (AF-026): the permanent ledger, third save slice.
const metaSlice = new SaveSlice<MetaSaveData>({
  key: "meta",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({
    accountXp: 0,
    mastery: {},
    collections: {},
    statistics: {},
    completedChallenges: [],
    unlockedCosmetics: [],
  }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

const meta = new MetaProgression(
  SANDBOX_CHALLENGES,
  (challenge) => {
    bus.emit("ChallengeCompleted", {
      challengeId: challenge.id,
      rewardKind: challenge.reward.kind,
      rewardId: challenge.reward.id,
    });
    lootNotices.push({ text: `CHALLENGE · ${challenge.name.toUpperCase()}`, colour: "#ffc652", ttlMs: 2400 });
  },
  (level) => bus.emit("AccountLevelUp", { level }),
);

function persistMeta(): void {
  void metaSlice.save(meta.toSave());
}

// The ledger listens; gameplay systems never know meta exists (AF-001 §7).
bus.on("EnemyKilled", ({ enemyId, elite }) => {
  meta.recordStat("enemiesDestroyed");
  meta.addMasteryCounter("weapon:test-cannon", "kills");
  meta.addMasteryXp("weapon:test-cannon", elite ? 5 : 1);
  if (elite) meta.addAccountXp(ACCOUNT_XP_AWARDS.eliteDefeated);
  meta.discover("enemies", elite ? "ENEMY_ELITE_DRONE" : "ENEMY_DRONE");
  void enemyId;
});
bus.on("DamageDealt", ({ amount, critical }) => {
  meta.recordStat("damageDealt", amount);
  if (critical) meta.addMasteryCounter("weapon:test-cannon", "criticalHits");
});
bus.on("PlayerDamaged", ({ amount }) => meta.recordStat("damageTaken", amount));
bus.on("LootCollected", ({ itemId, rarity }) => {
  meta.recordStat("itemsCollected");
  meta.discover("equipment", itemId);
  if (rarity === "legendary" || rarity === "ancient" || rarity === "mythic" || rarity === "singularity") {
    meta.recordStat("rareItemsFound");
  }
});
bus.on("ResearchUnlocked", ({ nodeId }) => {
  meta.addAccountXp(ACCOUNT_XP_AWARDS.researchUnlocked);
  meta.discover("research", nodeId);
  persistMeta();
});
bus.on("RunEnded", ({ result, playTimeMs }) => {
  meta.recordStat("runs");
  meta.recordStat(result === "victory" ? "victories" : "defeats");
  meta.recordStat("playTimeMs", playTimeMs);
  meta.addMasteryXp("commander:placeholder", result === "victory" ? 20 : 8);
  meta.addMasteryXp("ship:placeholder", result === "victory" ? 20 : 8);
  meta.addAccountXp(
    result === "victory" ? ACCOUNT_XP_AWARDS.missionCompleted : ACCOUNT_XP_AWARDS.missionFailed,
  );
  persistMeta();
});

/** Unlocked research feeds live systems at run start (AF-024 §4). */
function researchEffects(): { weaponBonus: number; lootBonus: number; magnetBonus: number } {
  let weaponBonus = 0;
  let lootBonus = 0;
  let magnetBonus = 0;
  for (const node of researchTree.unlockedNodes) {
    if (!node.effect) continue;
    if (node.effect.kind === "weaponResearchBonus") weaponBonus += node.effect.value;
    else if (node.effect.kind === "lootResearchBonus") lootBonus += node.effect.value;
    else if (node.effect.kind === "magnetRadiusBonus") magnetBonus += node.effect.value;
  }
  return { weaponBonus, lootBonus, magnetBonus };
}

// ── Inventory (AF-027): fifth save slice — the command centre for items.
const inventorySlice = new SaveSlice<InventorySaveData>({
  key: "inventory",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({ items: [], loadouts: [], nextInstanceId: 1 }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);

function persistInventory(): void {
  void inventorySlice.save(inventory.toSave());
}

// ── Equipment (AF-028): fixed sandbox loadout demonstrates the aggregation/
// set-bonus engine feeding directly into existing combat/movement fields —
// no new stat pipeline. Real loadout editing arrives with the UI module.
const sandboxLoadoutSlots: Partial<Record<import("./game/equipment/equipmentData").EquipmentSlot, string>> = {
  primaryWeapon: "refit-cannon",
  equipment1: "barrier-plate",
  equipment2: "vanguard-thrusters",
  equipment3: "vanguard-core",
};
const sandboxEquipmentById = new Map(SANDBOX_EQUIPMENT.map((item) => [item.id, item]));

// ── Relics (AF-029): in-run discoveries, apply on pickup, reset per run.
let relicSystem = new RelicSystem(SANDBOX_RELICS);
function newRelicSystem(): RelicSystem {
  return new RelicSystem(SANDBOX_RELICS, (from, to) => {
    lootNotices.push({ text: `EVOLVED · ${from.name.toUpperCase()} → ${to.name.toUpperCase()}`, colour: "#ffc652", ttlMs: 2600 });
    bus.emit("RelicEvolved", { fromId: from.id, toId: to.id });
  });
}

// ── Commander (AF-030): governs the run via the four-hook signature.
const sandboxCommander = SANDBOX_COMMANDERS[0]!;
let commanderRuntime: CommanderRuntime | null = null;

// ── Ship (AF-031): the ship IS the movement profile + defence seed + energy.
const sandboxShip = SANDBOX_SHIPS[0]!;
let shipRuntime: ShipRuntime | null = null;

// ── Weapon (AF-032): fires through the same DamagePipeline "weapon" stage
// and StatusEngine every prior module already reserved — no new plumbing.
const sandboxWeapon = SANDBOX_WEAPONS[0]!;
let weaponRuntime: WeaponRuntime | null = null;

function equipmentEffects() {
  const validation = validateLoadout(sandboxLoadoutSlots, sandboxEquipmentById);
  if (!validation.ok) {
    log.warn("equipment", "sandbox loadout failed validation", validation);
    return aggregateLoadout({}, sandboxEquipmentById, SANDBOX_SETS);
  }
  return aggregateLoadout(sandboxLoadoutSlots, sandboxEquipmentById, SANDBOX_SETS);
}

function dropLoot(x: number, y: number): void {
  if (!lootRng || !groundLoot || !xpSystem || !session) return;
  const drop = generateDrop(
    SANDBOX_DROP_TABLE,
    {
      itemLevel: xpSystem.snapshot.level,
      difficulty: 1,
      ascension: session.ascension,
      mutatorBonus: 0,
      researchBonus: sandboxBuild.researchLootBonus,
    },
    DEFAULT_LOOT_TUNING,
    lootRng,
  );
  groundLoot.place(drop, x, y);
  bus.emit("LootDropped", { itemId: drop.baseItemId, rarity: drop.rarity, category: drop.category, seed: drop.seed });
}

/** Shared kill-effects path — reached both by a direct hit and by a status DoT tick killing a drone. */
function killDrone(drone: Drone): void {
  drone.alive = false;
  bus.emit("EnemyKilled", { enemyId: drone.id, elite: drone.elite, boss: false });
  commanderRuntime?.notifyKill();
  director?.notifyEnemiesRemoved(1, drone.elite ? 1 : 0);
  xpPickups?.spawn(drone.elite ? "elite" : "medium", drone.x, drone.y);
  if (drone.elite || (lootRng && lootRng.next() < 0.08)) dropLoot(drone.x, drone.y);
  // AF-029: elites never simply drop gold — relic pool applies on pickup.
  if (drone.elite && lootRng) {
    const relicId = lootRng.pick(SANDBOX_RELICS.map((r) => r.id));
    const result = relicSystem.acquire(relicId);
    if (result.ok) {
      lootNotices.push({ text: `RELIC · ${relicId.toUpperCase().replaceAll("-", " ")}`, colour: "#9b5cff", ttlMs: 2200 });
      bus.emit("RelicAcquired", { relicId });
    }
  }
}

function spawnWave(directive: SpawnDirective): void {
  if (!movement || !combatRng || !director) return;
  const player = movement.snapshot;
  const count = directive.waveType === "EliteSquad"
    ? directive.eliteCount
    : Math.max(1, Math.round(directive.budgetCost / 4));
  for (let i = 0; i < count; i += 1) {
    const elite = directive.waveType === "EliteSquad";
    const angle = combatRng.float(0, Math.PI * 2);
    const distance = directive.placement.minDistanceFromPlayer + combatRng.float(0, 4);
    const x = Math.min(ARENA.maxX - 1, Math.max(ARENA.minX + 1, player.x + Math.cos(angle) * distance));
    const y = Math.min(ARENA.maxY - 1, Math.max(ARENA.minY + 1, player.y + Math.sin(angle) * distance));
    droneCounter += 1;
    const droneId = `drone-${droneCounter}`;
    drones.push({
      id: droneId,
      x,
      y,
      hull: elite ? 90 : 24,
      maxHull: elite ? 90 : 24,
      elite,
      alive: true,
      contactCooldownMs: 0,
      status: new StatusEngine({
        onTickDamage: (_kind, amount) => {
          const target = drones.find((d) => d.id === droneId);
          if (target) target.hull -= amount;
        },
      }),
    });
  }
  director.notifyEnemiesSpawned(count, directive.waveType === "EliteSquad" ? count : 0);
}

function updateSandboxCombat(fixedDtMs: number): void {
  if (!movement || !playerDefence || !combatRng || !director) return;
  const dt = fixedDtMs / 1000;
  const player = movement.snapshot;

  // Drones seek the player; contact damage through the real pipeline.
  for (const drone of drones) {
    if (!drone.alive) continue;
    // AF-032: statuses a weapon applied tick down through the same StatusEngine as the player's.
    drone.status.update(fixedDtMs);
    if (drone.hull <= 0) {
      killDrone(drone);
      continue;
    }
    const dx = player.x - drone.x;
    const dy = player.y - drone.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0.01) {
      const slowed = drone.status.has("freeze") || drone.status.has("stasis") ? 0 : drone.status.has("slow") ? 0.6 : 1;
      const speed = (drone.elite ? 1.8 : 2.4) * slowed;
      drone.x += (dx / distance) * speed * dt;
      drone.y += (dy / distance) * speed * dt;
    }
    drone.contactCooldownMs = Math.max(0, drone.contactCooldownMs - fixedDtMs);
    if (distance < 1.0 && drone.contactCooldownMs === 0) {
      drone.contactCooldownMs = 700;
      if (!player.invulnerable) {
        const result = resolveDamage(DRONE_PACKET, NEUTRAL_MODIFIERS, { values: {} }, DEFAULT_COMBAT_TUNING, combatRng);
        const intake = playerDefence.takeDamage(result.finalDamage);
        bus.emit("PlayerDamaged", { amount: result.finalDamage, source: drone.id });
        movement.applyImpulse((-dx / distance) * 5, (-dy / distance) * 5, 100);
        if (intake.shieldBroken) {
          bus.emit("ShieldBroken", { targetId: "player" });
          camera.shake("ShieldBreak");
        } else {
          camera.shake("WeaponImpact");
        }
        if (intake.defeated) {
          endRun("defeat");
          return;
        }
      }
    }
  }

  // XP gems: magnetism + collection (AF-022).
  xpPickups?.update(fixedDtMs, player.x, player.y, {
    pickupRadius: DEFAULT_XP_TUNING.basePickupRadius,
    magnetRadius: DEFAULT_XP_TUNING.baseMagnetRadius + sandboxBuild.magnetBonus,
  });

  // Ground loot collection + notice lifetimes (AF-023).
  groundLoot?.update(player.x, player.y, DEFAULT_XP_TUNING.basePickupRadius + 0.4);
  for (const notice of lootNotices) notice.ttlMs -= fixedDtMs;
  lootNotices = lootNotices.filter((n) => n.ttlMs > 0);

  // Level-up: consume one queued level, present an offer (AF-022 §4).
  if (xpSystem && upgradePool && xpSystem.snapshot.pendingLevels > 0 && machine.overlays.length === 0) {
    xpSystem.consumePendingLevel();
    currentOffer = upgradePool.offer(DEFAULT_XP_TUNING.choicesPerLevel).choices;
    machine.pushOverlay("LevelUp");
    return;
  }

  // Weapon (AF-032): nearest-priority target, WeaponRuntime gates cooldown
  // + energy cost, fire pattern determines spawn geometry.
  if (weaponRuntime) {
    weaponRuntime.intervalScale = sandboxBuild.fireIntervalScale;
    weaponRuntime.update(fixedDtMs);
    const candidates: TargetCandidate[] = drones
      .filter((d) => d.alive)
      .map((d) => ({ id: d.id, x: d.x, y: d.y, health: d.hull, maxHealth: d.maxHull, isBoss: false, isElite: d.elite }));
    const target = TARGET_SELECTORS.nearest(candidates, player.x, player.y);
    if (target && Math.hypot(target.x - player.x, target.y - player.y) <= sandboxWeapon.range) {
      const angle = Math.atan2(target.y - player.y, target.x - player.x);
      const shots = weaponRuntime.tryFire(angle);
      if (shots) {
        for (const shot of shots) {
          const projectile = projectilePool.acquire();
          projectile.x = player.x;
          projectile.y = player.y;
          projectile.originX = player.x;
          projectile.originY = player.y;
          projectile.velocityX = Math.cos(shot.angle) * sandboxWeapon.projectileSpeed;
          projectile.velocityY = Math.sin(shot.angle) * sandboxWeapon.projectileSpeed;
          projectile.ttlMs = (sandboxWeapon.range / sandboxWeapon.projectileSpeed) * 1000 + 200;
          projectile.elapsedMs = 0;
          projectile.bouncesRemaining = 1;
          projectile.reversed = false;
          projectile.behaviour = shot.behaviour;
          projectile.pierceRemaining = sandboxWeapon.pierceCount;
          projectile.live = true;
          projectiles.push(projectile);
        }
      }
    }
  }

  // Projectiles advance (deterministic per-behaviour motion, AF-032 §2) and resolve hits.
  for (const projectile of projectiles) {
    if (!projectile.live) continue;
    stepProjectile(projectile.behaviour, projectile, fixedDtMs, { bounds: ARENA });
    projectile.ttlMs -= fixedDtMs;
    if (projectile.ttlMs <= 0) {
      projectile.live = false;
      continue;
    }
    for (const drone of drones) {
      if (!drone.alive) continue;
      if (Math.hypot(drone.x - projectile.x, drone.y - projectile.y) < 0.6) {
        const result = resolveDamage(
          playerPacket(),
          {
            ...NEUTRAL_MODIFIERS,
            weapon: sandboxBuild.weaponBonus,
            research: sandboxBuild.researchWeaponBonus,
            equipment:
              sandboxBuild.equipmentWeaponBonus +
              (relicSystem.aggregate.bonuses.damage ?? 0) +
              (commanderRuntime?.bonuses.damage ?? 0),
          },
          { values: {} },
          DEFAULT_COMBAT_TUNING,
          combatRng,
        );
        drone.hull -= result.finalDamage;
        hitCount += 1;
        if (result.critical) critCount += 1;
        bus.emit("DamageDealt", { amount: result.finalDamage, critical: result.critical, kind: result.kind, targetId: drone.id });
        commanderRuntime?.notifyDamageDealt(result.finalDamage);
        // AF-032: status-on-hit applies through the same StatusEngine every status-inflicting system already uses.
        if (sandboxWeapon.statusOnHit && combatRng.next() < sandboxWeapon.statusOnHit.chance) {
          drone.status.apply({
            kind: sandboxWeapon.statusOnHit.kind,
            strength: sandboxWeapon.statusOnHit.strength,
            durationMs: sandboxWeapon.statusOnHit.durationMs,
          });
          bus.emit("StatusApplied", { targetId: drone.id, status: sandboxWeapon.statusOnHit.kind });
        }
        const popup = popupPool.acquire();
        popup.x = drone.x;
        popup.y = drone.y;
        popup.text = `${Math.round(result.finalDamage)}`;
        popup.critical = result.critical;
        popup.ttlMs = 600;
        popup.live = true;
        popups.push(popup);
        if (drone.hull <= 0) {
          killDrone(drone);
        }
        // AF-032: Pierce lets a projectile survive a hit instead of despawning immediately.
        if (projectile.pierceRemaining > 0) {
          projectile.pierceRemaining -= 1;
        } else {
          projectile.live = false;
          break;
        }
      }
    }
  }

  // Popup lifetimes + list compaction back into pools.
  for (const popup of popups) {
    if (!popup.live) continue;
    popup.ttlMs -= fixedDtMs;
    popup.y -= 1.5 * dt;
    if (popup.ttlMs <= 0) popup.live = false;
  }
  projectiles = projectiles.filter((p) => (p.live ? true : (projectilePool.release(p), false)));
  popups = popups.filter((p) => (p.live ? true : (popupPool.release(p), false)));
  drones = drones.filter((d) => d.alive);

  playerDefence.update(fixedDtMs);
}

const CAMERA_MODE_BY_STATE: Partial<Record<GameStateId, CameraMode>> = {
  MainMenu: "Menu",
  GalaxyCommand: "GalaxyCommand",
  MissionSelect: "MissionBriefing",
  Gameplay: "Gameplay",
  MissionComplete: "MissionComplete",
  Defeat: "Defeat",
  Statistics: "Results",
};

const machine = new StateMachine<GameStateId>({
  initial: "Boot",
  transitions: GAME_TRANSITIONS,
  overlayHosts: OVERLAY_HOSTS,
  strict: import.meta.env.DEV,
  onTransition: (info) => {
    if (info.kind === "transition") {
      bus.emit("GameStateChanged", { from: info.from, to: info.to, durationMs: info.durationMs });
    } else if (info.kind === "overlay-push") {
      bus.emit("OverlayPushed", { overlay: info.to, base: machine.base });
    } else {
      bus.emit("OverlayPopped", { overlay: info.from, base: machine.base });
    }
    const cameraMode = CAMERA_MODE_BY_STATE[machine.base];
    if (cameraMode) camera.setMode(cameraMode);
    syncInputContext();
    render();
  },
  onRejected: (from, to, reason) =>
    log.warn("state", `refused transition ${from} → ${to}`, { reason }),
});

/** Input context follows the state machine (AF-019 §2). */
function syncInputContext(): void {
  if (machine.overlays.length > 0) input.setContext("overlay");
  else if (machine.base === "Gameplay") input.setContext("gameplay");
  else input.setContext("menu");
}

/** Placeholder screens — one per state, replaced as AF-017+ modules land. */
function screen(title: string, subtitle: string, actions: Array<[string, () => void]>): void {
  if (!app) return;
  app.innerHTML = "";
  const box = document.createElement("div");
  box.style.cssText = "text-align:center;max-width:32rem";
  const h1 = document.createElement("h1");
  h1.textContent = title;
  h1.style.cssText =
    "font-size:2rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--energy-white);margin-bottom:0.5rem";
  const p = document.createElement("p");
  p.textContent = subtitle;
  p.style.cssText = "color:var(--neutral-grey);margin-bottom:1.5rem;white-space:pre-line";
  box.append(h1, p);
  for (const [label, onClick] of actions) {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.cssText = [
      "display:block",
      "margin:0.5rem auto",
      "min-width:16rem",
      "padding:0.6rem 1.2rem",
      "background:rgba(16,26,56,0.6)",
      "border:1px solid var(--space-blue)",
      "border-bottom:2px solid var(--energy-violet)",
      "color:var(--energy-white)",
      "font:inherit",
      "letter-spacing:0.08em",
      "cursor:pointer",
    ].join(";");
    button.addEventListener("click", onClick);
    box.appendChild(button);
  }
  app.appendChild(box);
}

function startRun(): void {
  const seed = new Rng(`${Date.now()}`).int(1, 2 ** 31);
  session = createRunSession(
    {
      missionId: "placeholder-mission",
      commanderId: "placeholder-commander",
      shipId: "placeholder-ship",
      weaponIds: [],
      equipmentIds: [],
      difficulty: "standard",
      ascension: 0,
      biomeId: "placeholder-biome",
    },
    seed,
    Date.now(),
  );
  sessionMs = 0;
  movement = new PlayerMovement(sandboxShip.movementProfile);
  movement.setPosition(30, 17);
  movement.setBounds(ARENA);
  movement.setObstacles(ARENA_OBSTACLES);
  camera.setBounds(ARENA);
  camera.snapTo(30, 17);
  playerDefence = new DefenceState(sandboxShip.shield, sandboxShip.hull, DEFAULT_COMBAT_TUNING);
  combatRng = new Rng(seed).fork("combat");
  drones = [];
  projectiles = [];
  popups = [];
  hitCount = 0;
  critCount = 0;
  sandboxBuild.weaponBonus = 0;
  sandboxBuild.critBonus = 0;
  sandboxBuild.fireIntervalScale = 1;
  sandboxBuild.speedStacks = 0;
  const research = researchEffects();
  sandboxBuild.magnetBonus = research.magnetBonus;
  sandboxBuild.researchWeaponBonus = research.weaponBonus;
  sandboxBuild.researchLootBonus = research.lootBonus;
  // AF-028: equipped bonuses feed existing systems directly — no new stat pipeline.
  const equipment = equipmentEffects();
  sandboxBuild.equipmentWeaponBonus = equipment.bonuses.damage ?? 0;
  playerDefence.addBarrier(equipment.bonuses.shieldCapacity ?? 0);
  shipRuntime = new ShipRuntime(sandboxShip);
  weaponRuntime = new WeaponRuntime(sandboxWeapon, (amount) => shipRuntime?.trySpendEnergy(amount) ?? true);
  const shipSpeedBonus = shipRuntime.bonuses.movementSpeed ?? 0;
  const equipmentSpeedBonus = equipment.bonuses.movementSpeed ?? 0;
  if (shipSpeedBonus + equipmentSpeedBonus > 0) {
    movement.addModifier({
      id: "ship-and-equipment-speed",
      kind: "speedMultiplier",
      multiplier: 1 + shipSpeedBonus + equipmentSpeedBonus,
      durationMs: Number.MAX_SAFE_INTEGER,
    });
  }
  currentOffer = [];
  relicSystem = newRelicSystem();
  commanderRuntime = new CommanderRuntime(sandboxCommander, () => {
    lootNotices.push({ text: `ULTIMATE READY · ${sandboxCommander.ultimate.name.toUpperCase()}`, colour: "#9b5cff", ttlMs: 2200 });
  });
  xpSystem = new XpSystem(DEFAULT_XP_TUNING, null, (level) =>
    bus.emit("CommanderLevelUp", { level }),
  );
  xpPickups = new XpPickups(DEFAULT_XP_TUNING, (amount, tier) => {
    xpSystem?.addXp(amount);
    bus.emit("XpCollected", { amount, tier });
  });
  upgradePool = new UpgradePool(SANDBOX_UPGRADES, new Rng(seed).fork("upgrades"));
  lootRng = new Rng(seed).fork("loot");
  lootNotices = [];
  lootBankedCount = 0;
  lootCollectedCount = 0;
  groundLoot = new GroundLoot(
    DEFAULT_LOOT_TUNING,
    (drop: LootDrop) => {
      lootCollectedCount += 1;
      lootNotices.push({
        text: `${drop.rarity.toUpperCase()} · ${drop.baseItemId.replaceAll("_", " ")}`,
        colour: RARITY_TABLE[drop.rarity].colour,
        ttlMs: 1600,
      });
      bus.emit("LootCollected", { itemId: drop.baseItemId, rarity: drop.rarity, category: drop.category });
      if (drop.category === "researchSample") bankResearchSample(drop);
      if (drop.category === "craftingMaterial") bankCraftingMaterial(drop);
      // Weapons/equipment/relics land in the persistent inventory (AF-027).
      if (drop.category === "weapon" || drop.category === "equipment" || drop.category === "relic") {
        inventory.add(drop, Date.now());
        persistInventory();
      }
    },
    () => {
      lootBankedCount += 1; // banked to Results — value preserved (AF-023 §6)
    },
  );
  director = new EnemyDirector({
    tuning: DEFAULT_DIRECTOR_TUNING,
    rng: new Rng(seed).fork("director"),
    threatInputs: {
      missionDifficulty: 1,
      biomeModifier: 1,
      mutatorModifier: 1,
      ascension: session.ascension,
      playerLevel: 1,
      equipmentQuality: 1,
    },
    onDirective: (directive) => {
      bus.emit("SpawnDirectiveIssued", {
        waveType: directive.waveType,
        budgetCost: directive.budgetCost,
        eliteCount: directive.eliteCount,
      });
      spawnWave(directive);
    },
    onPhaseChanged: (from, to) => bus.emit("DirectorPhaseChanged", { from, to }),
    onEnvironmentalEvent: (eventType) =>
      bus.emit("EnvironmentalEventTriggered", { eventType }),
  });
  log.info("run", "run started", { seed });
}

function endRun(result: "victory" | "defeat"): void {
  if (!session) return;
  session.result = result;
  session.playTimeMs = sessionMs;
  director = null;
  bus.emit("RunEnded", { result, seed: session.seed, playTimeMs: sessionMs });
  machine.transitionTo(result === "victory" ? "MissionComplete" : "Defeat");
}

/** Movement sandbox (AF-020): fly the ship — input → movement → camera. */
function renderGameplaySandbox(): void {
  if (!app) return;
  app.innerHTML = "";
  const box = document.createElement("div");
  box.style.cssText = "text-align:center";

  sandboxCanvas = document.createElement("canvas");
  sandboxCanvas.width = 640;
  sandboxCanvas.height = 360;
  sandboxCanvas.style.cssText =
    "border:1px solid var(--space-blue);max-width:100%;image-rendering:pixelated";
  box.appendChild(sandboxCanvas);

  const hint = document.createElement("p");
  hint.textContent =
    "WASD / stick — fly · Space — boost (i-frames) · Esc — pause · cannon fires itself — survive";
  hint.style.cssText = "color:var(--neutral-grey);font-size:0.85rem;margin:0.5rem 0 0.75rem";
  box.appendChild(hint);

  const buttons = document.createElement("div");
  for (const [label, onClick] of [
    [
      "Advance Run Phase",
      () => {
        if (session) {
          const previous = session.phase;
          const next = advancePhase(session);
          if (next) bus.emit("RunPhaseChanged", { from: previous, to: next });
          if (next === "Results") endRun("victory");
          else render();
        }
      },
    ],
    ["Simulate Defeat", () => endRun("defeat")],
  ] as Array<[string, () => void]>) {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.cssText =
      "margin:0 0.4rem;padding:0.4rem 1rem;background:rgba(16,26,56,0.6);border:1px solid var(--space-blue);color:var(--energy-white);font:inherit;font-size:0.85rem;cursor:pointer";
    button.addEventListener("click", onClick);
    buttons.appendChild(button);
  }
  box.appendChild(buttons);
  app.appendChild(box);
}

function drawSandbox(): void {
  if (!sandboxCanvas || machine.base !== "Gameplay" || !movement) return;
  const ctx = sandboxCanvas.getContext("2d");
  if (!ctx) return;

  const cam = camera.snapshot;
  const scale = 20 * cam.zoom;
  const originX = sandboxCanvas.width / 2 - (cam.x + cam.shakeOffsetX) * scale;
  const originY = sandboxCanvas.height / 2 - (cam.y + cam.shakeOffsetY) * scale;
  const toX = (worldX: number): number => originX + worldX * scale;
  const toY = (worldY: number): number => originY + worldY * scale;

  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, sandboxCanvas.width, sandboxCanvas.height);

  ctx.strokeStyle = "#101a38";
  ctx.lineWidth = 2;
  ctx.strokeRect(toX(ARENA.minX), toY(ARENA.minY), (ARENA.maxX - ARENA.minX) * scale, (ARENA.maxY - ARENA.minY) * scale);
  ctx.fillStyle = "#101a38";
  for (const box of ARENA_OBSTACLES) {
    ctx.fillRect(toX(box.minX), toY(box.minY), (box.maxX - box.minX) * scale, (box.maxY - box.minY) * scale);
  }

  // Drones: hostile = hot hues (AF-004 §3); elites read as diamonds (AF-007).
  for (const drone of drones) {
    const dx = toX(drone.x);
    const dy = toY(drone.y);
    const droneSize = (drone.elite ? 0.55 : 0.35) * scale;
    ctx.save();
    ctx.translate(dx, dy);
    ctx.fillStyle = drone.elite ? "#c8323c" : "#ff4054";
    ctx.shadowColor = "#ff4054";
    ctx.shadowBlur = 6;
    if (drone.elite) {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-droneSize, -droneSize, droneSize * 2, droneSize * 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, droneSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // Hull sliver under damaged drones.
    if (drone.hull < drone.maxHull) {
      ctx.fillStyle = "#101a38";
      ctx.fillRect(dx - droneSize, dy + droneSize + 3, droneSize * 2, 3);
      ctx.fillStyle = "#ff4054";
      ctx.fillRect(dx - droneSize, dy + droneSize + 3, (droneSize * 2 * drone.hull) / drone.maxHull, 3);
    }
  }

  // Loot beams: vertical, rarity-coloured — the unique shape read (AF-023 §5).
  if (groundLoot) {
    for (const ground of groundLoot.live) {
      if (!ground.drop) continue;
      const row = RARITY_TABLE[ground.drop.rarity];
      const bx = toX(ground.x);
      const by = toY(ground.y);
      const beamHeight = 46 * row.presentation + 14;
      const gradient = ctx.createLinearGradient(bx, by - beamHeight, bx, by);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, row.colour);
      ctx.fillStyle = gradient;
      ctx.fillRect(bx - 2, by - beamHeight, 4, beamHeight);
      ctx.fillStyle = row.colour;
      ctx.shadowColor = row.colour;
      ctx.shadowBlur = 10 * row.presentation;
      ctx.beginPath();
      ctx.ellipse(bx, by, 0.28 * scale, 0.12 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // XP gems: solar gold, size = significance (AF-002 §7, AF-022 §2).
  if (xpPickups) {
    ctx.fillStyle = "#ffc652";
    ctx.shadowColor = "#ffc652";
    ctx.shadowBlur = 6;
    for (const gem of xpPickups.live) {
      const gemSize = (gem.tier === "small" ? 0.12 : gem.tier === "elite" ? 0.22 : 0.17) * scale;
      ctx.beginPath();
      ctx.arc(toX(gem.x), toY(gem.y), gemSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // Player projectiles: cool light — ownership readable in one frame (AF-002 §3).
  ctx.fillStyle = "#3fd4f5";
  ctx.shadowColor = "#3fd4f5";
  ctx.shadowBlur = 8;
  for (const projectile of projectiles) {
    if (!projectile.live) continue;
    ctx.beginPath();
    ctx.arc(toX(projectile.x), toY(projectile.y), 0.12 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  const snap = movement.snapshot;
  const speed = Math.hypot(snap.velocityX, snap.velocityY);
  const dirX = speed > 0.1 ? snap.velocityX / speed : 0;
  const dirY = speed > 0.1 ? snap.velocityY / speed : -1;
  const px = toX(snap.x);
  const py = toY(snap.y);
  const size = sandboxShip.movementProfile.collisionRadius * scale * 2;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(Math.atan2(dirY, dirX) + Math.PI / 2);
  ctx.fillStyle = snap.boostActive ? "#3fd4f5" : "#f4f7ff";
  ctx.shadowColor = snap.boostActive ? "#3fd4f5" : "#9b5cff";
  ctx.shadowBlur = snap.boostActive ? 18 : 8;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.7, size);
  ctx.lineTo(-size * 0.7, size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Damage numbers: tabular feel, crits gold and larger (AF-002 §9 / AF-003 §4).
  for (const popup of popups) {
    if (!popup.live) continue;
    ctx.font = popup.critical ? "bold 16px monospace" : "12px monospace";
    ctx.fillStyle = popup.critical ? "#ffc652" : "#f4f7ff";
    ctx.globalAlpha = Math.min(1, popup.ttlMs / 300);
    ctx.fillText(popup.text, toX(popup.x), toY(popup.y));
    ctx.globalAlpha = 1;
  }

  // Loot pickup notices: rarity-coloured, top centre, brief (AF-003 §5).
  ctx.textAlign = "center";
  let noticeY = 30;
  for (const notice of lootNotices.slice(-3)) {
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = notice.colour;
    ctx.globalAlpha = Math.min(1, notice.ttlMs / 400);
    ctx.fillText(notice.text, sandboxCanvas.width / 2, noticeY);
    ctx.globalAlpha = 1;
    noticeY += 18;
  }
  ctx.textAlign = "left";

  // XP bar: solar gold, bottom centre (AF-003 §3 layout).
  if (xpSystem) {
    const xp = xpSystem.snapshot;
    const barWidth = sandboxCanvas.width * 0.6;
    const barX = (sandboxCanvas.width - barWidth) / 2;
    const barY = sandboxCanvas.height - 18;
    ctx.fillStyle = "rgba(5,6,10,0.7)";
    ctx.fillRect(barX - 2, barY - 2, barWidth + 4, 12);
    ctx.fillStyle = "#101a38";
    ctx.fillRect(barX, barY, barWidth, 8);
    ctx.fillStyle = "#ffc652";
    ctx.fillRect(barX, barY, barWidth * Math.min(1, xp.xp / xp.nextThreshold), 8);
    ctx.font = "11px monospace";
    ctx.fillStyle = "#f4f7ff";
    ctx.fillText(`Lv ${xp.level}`, barX + barWidth + 8, barY + 8);
  }

  // Player status bars: Shield = shield.blue, Health = danger.red (AF-002 §7).
  if (playerDefence) {
    const defence = playerDefence.snapshot;
    const barWidth = 150;
    ctx.fillStyle = "rgba(5,6,10,0.7)";
    ctx.fillRect(8, 8, barWidth + 4, 26);
    ctx.fillStyle = "#101a38";
    ctx.fillRect(10, 10, barWidth, 9);
    ctx.fillStyle = "#4d7cff";
    ctx.fillRect(10, 10, (barWidth * defence.shield) / defence.maxShield, 9);
    ctx.fillStyle = "#101a38";
    ctx.fillRect(10, 22, barWidth, 9);
    ctx.fillStyle = "#ff4054";
    ctx.fillRect(10, 22, (barWidth * defence.hull) / defence.maxHull, 9);
  }
}

function render(): void {
  const state = machine.current;
  switch (state) {
    case "Boot":
      screen("Afterlight", "Initialising…", []);
      break;
    case "Splash":
      screen("Afterlight", "The galaxy is dark. You carry the light.", [
        ["Continue", () => machine.transitionTo("MainMenu")],
      ]);
      break;
    case "MainMenu":
      screen("Afterlight", "Main Menu (placeholder)", [
        ["Enter Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
        ["Statistics", () => machine.transitionTo("Statistics")],
      ]);
      break;
    case "GalaxyCommand": {
      // Research panel (AF-024): spend banked points; unlocks persist forever.
      const snapshot = researchTree.snapshot;
      const nodeButtons: Array<[string, () => void]> = researchTree.visibleNodes
        .filter((n) => !researchTree.isUnlocked(n.id))
        .slice(0, 4)
        .map((n) => {
          const state = researchTree.stateOf(n.id);
          const tag = state === "available" ? `${n.cost} pts` : "locked";
          return [
            `Research: ${n.name} (${tag})`,
            () => {
              if (researchTree.unlock(n.id)) {
                persistResearch();
                render();
              }
            },
          ];
        });
      // Lightforge panel (AF-025): craft from known recipes, salvage the hangar.
      const forgeButtons: Array<[string, () => void]> = crafting.knownRecipes.map((recipe) => {
        const check = crafting.canCraft(recipe.id);
        const cost = Object.entries(recipe.materials)
          .map(([type, amount]) => `${amount} ${type.replace("Materials", "")}`)
          .join(", ");
        const tag = check.ok ? cost : check.reason === "insufficientMaterials" ? `needs ${cost}` : check.reason;
        return [
          `Lightforge: ${recipe.outputBaseItemId.replaceAll("_", " ")} (${tag})`,
          () => {
            const result = crafting.craft(recipe.id, xpSystem?.snapshot.level ?? 1, new Rng(Date.now()).fork("craft"));
            if (result.ok && result.item) {
              bus.emit("ItemCrafted", {
                recipeId: recipe.id,
                itemId: result.item.baseItemId,
                rarity: result.item.rarity,
                quality: result.item.quality,
              });
              persistCrafting();
              render();
            }
          },
        ];
      });
      const hangarItem = crafting.hangarItems[0];
      if (hangarItem) {
        forgeButtons.push([
          `Salvage: ${hangarItem.baseItemId.replaceAll("_", " ")} (${hangarItem.rarity}, q${hangarItem.quality})`,
          () => {
            const returned = crafting.salvageFromHangar(0);
            if (returned) {
              bus.emit("ItemSalvaged", { itemId: hangarItem.baseItemId, rarity: hangarItem.rarity });
              persistCrafting();
              render();
            }
          },
        ]);
      }
      screen(
        "Galaxy Command",
        `Research: ${snapshot.points} pts, ${snapshot.unlockedCount}/${SANDBOX_RESEARCH_TREE.length} tech · Materials: ${crafting.materialCount("commonMaterials")} common, ${crafting.materialCount("rareAlloys")} alloy · Hangar: ${crafting.hangarItems.length}`,
        [
          ["Select Mission", () => machine.transitionTo("MissionSelect")],
          ...nodeButtons,
          ...forgeButtons,
          ["Statistics", () => machine.transitionTo("Statistics")],
          ["Main Menu", () => machine.transitionTo("MainMenu")],
        ],
      );
      break;
    }
    case "MissionSelect":
      screen("Mission Selection", "One placeholder expedition is available.", [
        [
          "Launch Expedition",
          () => {
            startRun();
            machine.transitionTo("Loading");
          },
        ],
        ["Back", () => machine.transitionTo("GalaxyCommand")],
      ]);
      break;
    case "Loading":
      screen("Loading", "Streaming expedition data…", []);
      // Async loading pattern: heavy work happens here, never inside a transition.
      setTimeout(() => {
        if (machine.base === "Loading") machine.transitionTo("Gameplay");
      }, 250);
      break;
    case "Gameplay":
      renderGameplaySandbox();
      break;
    case "Pause":
      screen("Paused", "The run is preserved beneath this overlay.", [
        ["Resume", () => machine.popOverlay()],
        [
          "Abandon Run",
          () => {
            director = null;
            machine.transitionTo("GalaxyCommand");
          },
        ],
      ]);
      break;
    case "LevelUp": {
      // AF-003 §7 / AF-022 §4: three cards, immediate selection, instant resume.
      const level = xpSystem?.snapshot.level ?? 0;
      screen(
        `Level ${level}`,
        "Choose an upgrade — the run resumes instantly.",
        currentOffer.map((choice): [string, () => void] => [
          `${choice.name} — ${choice.description}`,
          () => {
            applyUpgrade(choice.id);
            upgradePool?.recordTaken(choice.id);
            currentOffer = [];
            machine.popOverlay();
          },
        ]),
      );
      break;
    }
    case "InventoryOverlay": {
      // AF-027: real persistent inventory, sorted by power, top entries shown.
      const topItems = inventory.sorted("power").slice(0, 6);
      const lines = topItems.length > 0
        ? topItems
            .map(
              (item) =>
                `${item.favourite ? "★" : " "} ${item.drop.rarity.toUpperCase()} ${item.drop.baseItemId.replaceAll("_", " ")} (lvl ${item.drop.itemLevel}, pwr ${Math.round(item.drop.affixes.reduce((s, a) => s + a.value, 0) + item.drop.itemLevel * 10)})`,
            )
            .join("\n")
        : "No items collected yet — weapons, equipment and relics found in expeditions land here permanently.";
      screen(`Inventory (${inventory.size} items)`, lines, [["Close", () => machine.popOverlay()]]);
      break;
    }
    case "MissionComplete":
      screen("Mission Complete", "Rewards banked. The galaxy grows brighter.", [
        ["Return to Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
        ["Statistics", () => machine.transitionTo("Statistics")],
      ]);
      break;
    case "Defeat":
      screen("Run Lost", "Knowledge, research, and statistics retained.", [
        ["Return to Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
        ["Statistics", () => machine.transitionTo("Statistics")],
      ]);
      break;
    case "Statistics": {
      // The account profile (AF-026 §7): the permanent ledger, readable.
      const profile = meta.snapshot;
      const stats = profile.statistics;
      const hours = ((stats["playTimeMs"] ?? 0) / 3_600_000).toFixed(2);
      const challengeLines = SANDBOX_CHALLENGES.map((c) => {
        const progress = meta.challengeProgress(c.id);
        const done = meta.isChallengeCompleted(c.id);
        return `${done ? "★" : "☆"} ${c.name} ${progress ? `${progress.current}/${progress.target}` : ""}`;
      }).join("   ");
      screen(
        `Account Level ${profile.accountLevel}`,
        [
          `Runs ${stats["runs"] ?? 0} · Victories ${stats["victories"] ?? 0} · Defeats ${stats["defeats"] ?? 0} · ${hours}h in expeditions`,
          `Enemies ${Math.round(stats["enemiesDestroyed"] ?? 0)} · Damage dealt ${Math.round(stats["damageDealt"] ?? 0)} · taken ${Math.round(stats["damageTaken"] ?? 0)}`,
          `Items ${stats["itemsCollected"] ?? 0} (rare ${stats["rareItemsFound"] ?? 0}) · Discovered: ${Object.entries(profile.collectionCounts).map(([k, v]) => `${k} ${v}`).join(", ") || "nothing yet"}`,
          `Challenges ${profile.completedChallenges}/${profile.totalChallenges}:   ${challengeLines}`,
        ].join("\n"),
        [
          ["Back to Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
          ["Back to Main Menu", () => machine.transitionTo("MainMenu")],
        ],
      );
      break;
    }
    case "Multiplayer":
    case "CommunityHub":
      screen(state, "Reserved for a future module.", []);
      break;
  }
}

// Frame loop: fixed-timestep sim (session timing for now; systems attach via
// GameManager as AF-017+ land) with an FPS estimate for the debug overlay.
let fps = 0;
let framesThisSecond = 0;
let fpsWindowStart = performance.now();

const loop = new GameLoop({
  update: (fixedDtMs) => {
    input.update(fixedDtMs);
    if (input.wasPressed("Pause") && machine.base === "Gameplay") {
      if (machine.overlays.at(-1) === "Pause") machine.popOverlay();
      else if (machine.overlays.length === 0) machine.pushOverlay("Pause");
    }
    if (input.consumeBuffered("InventoryOverlay") && machine.base === "Gameplay") {
      if (machine.overlays.at(-1) === "InventoryOverlay") machine.popOverlay();
      else if (machine.overlays.length === 0) machine.pushOverlay("InventoryOverlay");
    }
    if (machine.base === "Gameplay" && machine.overlays.length === 0) {
      sessionMs += fixedDtMs;
      director?.update(fixedDtMs);
      if (movement) {
        if (input.consumeBuffered("Boost")) movement.tryBoost();
        const move = input.movement;
        movement.update(fixedDtMs, move.x, move.y);
        updateSandboxCombat(fixedDtMs);
        const snap = movement.snapshot;
        camera.update(fixedDtMs, snap.x, snap.y, snap.velocityX, snap.velocityY);
      }
      if (commanderRuntime) {
        commanderRuntime.update(fixedDtMs);
        if (input.consumeBuffered("CommanderAbility") && commanderRuntime.tryActivateAbility()) {
          camera.shake("WeaponImpact");
          lootNotices.push({ text: sandboxCommander.active.name.toUpperCase(), colour: "#3fd4f5", ttlMs: 1200 });
        }
        if (input.consumeBuffered("Ultimate") && commanderRuntime.tryActivateUltimate()) {
          camera.shake("Ultimate");
          lootNotices.push({ text: `${sandboxCommander.ultimate.name.toUpperCase()}!`, colour: "#9b5cff", ttlMs: 2600 });
        }
      }
      if (shipRuntime) {
        shipRuntime.update(fixedDtMs);
        if (input.consumeBuffered("ShipAbility") && shipRuntime.tryActivateAbility()) {
          camera.shake("WeaponImpact");
          lootNotices.push({ text: sandboxShip.ability.name.toUpperCase(), colour: "#5cffa8", ttlMs: 1200 });
        }
      }
    }
  },
  render: () => {
    gamepad.poll();
    drawSandbox();
    framesThisSecond += 1;
    const now = performance.now();
    if (now - fpsWindowStart >= 1000) {
      fps = (framesThisSecond * 1000) / (now - fpsWindowStart);
      framesThisSecond = 0;
      fpsWindowStart = now;
    }
    if (debugOverlay) {
      debugOverlay.update({
        gameState: machine.base,
        overlays: machine.overlays,
        runPhase: session?.phase ?? null,
        missionSeed: session?.seed ?? null,
        difficulty: session ? `${session.difficulty} / A${session.ascension}` : null,
        build: session ? session.shipId : null,
        sessionSeconds: sessionMs / 1000,
        fps,
        lastTransitionMs: machine.lastTransitionMs,
        droppedTimeMs: loop.droppedTimeMs,
        director: director
          ? `${director.snapshot.phase} · threat ${director.snapshot.threat.toFixed(2)} · budget ${director.snapshot.budget.toFixed(0)} · enemies ${director.snapshot.activeEnemies} (${director.snapshot.activeElites}E)`
          : null,
        input: `${input.currentContext} · move (${input.movement.x.toFixed(2)}, ${input.movement.y.toFixed(2)}) · last ${input.lastAction ?? "—"}`,
        movement: movement
          ? `${movement.state} · speed ${movement.snapshot.speed.toFixed(1)} · boost cd ${movement.snapshot.boostCooldownMs.toFixed(0)}ms · contacts ${movement.snapshot.collisionContacts}`
          : null,
        combat: playerDefence
          ? `drones ${drones.length} · proj ${projectiles.length} · crit ${hitCount > 0 ? ((critCount / hitCount) * 100).toFixed(0) : 0}% (${critCount}/${hitCount}) · shield ${playerDefence.snapshot.shield.toFixed(0)}/${playerDefence.snapshot.maxShield} · hull ${playerDefence.snapshot.hull.toFixed(0)}/${playerDefence.snapshot.maxHull}`
          : null,
        xp: xpSystem
          ? `Lv ${xpSystem.snapshot.level} · ${xpSystem.snapshot.xp.toFixed(0)}/${xpSystem.snapshot.nextThreshold.toFixed(0)} · gems ${xpPickups?.live.length ?? 0} · dmg +${(sandboxBuild.weaponBonus * 100).toFixed(0)}% · rate ×${(1 / sandboxBuild.fireIntervalScale).toFixed(2)}`
          : null,
        loot: groundLoot
          ? `ground ${groundLoot.live.length}/${DEFAULT_LOOT_TUNING.maxGroundLoot} · collected ${lootCollectedCount} · banked ${lootBankedCount}`
          : null,
        research: `pts ${researchTree.snapshot.points} · unlocked ${researchTree.snapshot.unlockedCount} · wpn +${(sandboxBuild.researchWeaponBonus * 100).toFixed(0)}% · loot +${(sandboxBuild.researchLootBonus * 100).toFixed(0)}%`,
        meta: `acct Lv ${meta.snapshot.accountLevel} · runs ${meta.stat("runs")} · kills ${Math.round(meta.stat("enemiesDestroyed"))} · challenges ${meta.snapshot.completedChallenges}/${meta.snapshot.totalChallenges}`,
        inventory: `${inventory.size} items · player ${inventory.countIn("player")} · loadouts ${inventory.allLoadouts.length}`,
        equipment: (() => {
          const eq = equipmentEffects();
          return `wpn +${((eq.bonuses.damage ?? 0) * 100).toFixed(0)}% · shield +${(eq.bonuses.shieldCapacity ?? 0).toFixed(0)} · sets ${eq.activeSetBonuses.length} · pwr ${eq.powerRating}`;
        })(),
        relics: `active ${relicSystem.activeRelicIds.length} [${relicSystem.activeRelicIds.join(", ") || "none"}] · synergies ${relicSystem.aggregate.synergies.length}`,
        commander: commanderRuntime
          ? `${sandboxCommander.callsign} · ability cd ${commanderRuntime.snapshot.activeCooldownMs.toFixed(0)}ms · ult ${commanderRuntime.snapshot.ultimateCharge.toFixed(0)}/${sandboxCommander.ultimate.chargeRequired}${commanderRuntime.snapshot.ultimateReady ? " READY" : ""}`
          : null,
        ships: shipRuntime
          ? `${sandboxShip.name} (${sandboxShip.shipClass}) · energy ${shipRuntime.snapshot.energy.toFixed(0)}/${sandboxShip.maxEnergy} · ability cd ${shipRuntime.snapshot.abilityCooldownMs.toFixed(0)}ms`
          : null,
        weapons: weaponRuntime
          ? `${sandboxWeapon.name} (${sandboxWeapon.category}/${sandboxWeapon.firePattern}) · shots ${weaponRuntime.snapshot.shotsFired} · proj ${projectiles.filter((p) => p.live).length} · dmg ${hitCount > 0 ? ((critCount / hitCount) * 100).toFixed(0) : 0}%crit`
          : null,
      });
    }
  },
});

const debugOverlay = import.meta.env.DEV ? new DebugOverlay(document.body) : null;

render();
loop.start();
// Boot state loads persistent slices, then hands over (AF-016 Boot's job).
void (async () => {
  researchTree.loadSave(await researchSlice.load());
  crafting.loadSave(await craftingSlice.load());
  meta.loadSave(await metaSlice.load());
  inventory.loadSave(await inventorySlice.load());
  machine.transitionTo("Splash");
  log.info("boot", "Afterlight core gameplay skeleton started", {
    researchUnlocked: researchTree.snapshot.unlockedCount,
    hangar: crafting.hangarItems.length,
    accountLevel: meta.snapshot.accountLevel,
  });
})();
