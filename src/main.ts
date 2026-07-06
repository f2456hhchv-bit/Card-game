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
import { DEFAULT_MOVEMENT_PROFILE } from "./game/movement/movementTuning";
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
  p.style.cssText = "color:var(--neutral-grey);margin-bottom:1.5rem";
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
  movement = new PlayerMovement(DEFAULT_MOVEMENT_PROFILE);
  movement.setPosition(30, 17);
  movement.setBounds(ARENA);
  movement.setObstacles(ARENA_OBSTACLES);
  camera.setBounds(ARENA);
  camera.snapTo(30, 17);
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
    onDirective: (directive) =>
      bus.emit("SpawnDirectiveIssued", {
        waveType: directive.waveType,
        budgetCost: directive.budgetCost,
        eliteCount: directive.eliteCount,
      }),
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
    "WASD / stick — fly · Space — boost · Esc — pause · combat arrives with AF-021";
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

  const snap = movement.snapshot;
  const speed = Math.hypot(snap.velocityX, snap.velocityY);
  const dirX = speed > 0.1 ? snap.velocityX / speed : 0;
  const dirY = speed > 0.1 ? snap.velocityY / speed : -1;
  const px = toX(snap.x);
  const py = toY(snap.y);
  const size = DEFAULT_MOVEMENT_PROFILE.collisionRadius * scale * 2;

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
    case "GalaxyCommand":
      screen("Galaxy Command", "Prepare your build. Choose your mission.", [
        ["Select Mission", () => machine.transitionTo("MissionSelect")],
        ["Statistics", () => machine.transitionTo("Statistics")],
        ["Main Menu", () => machine.transitionTo("MainMenu")],
      ]);
      break;
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
    case "LevelUp":
    case "InventoryOverlay":
      screen(state, "Overlay placeholder.", [["Close", () => machine.popOverlay()]]);
      break;
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
    case "Statistics":
      screen("Statistics", "Lifetime records (placeholder).", [
        ["Back to Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
        ["Back to Main Menu", () => machine.transitionTo("MainMenu")],
      ]);
      break;
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
    if (machine.base === "Gameplay" && machine.overlays.length === 0) {
      sessionMs += fixedDtMs;
      director?.update(fixedDtMs);
      if (movement) {
        if (input.consumeBuffered("Boost")) movement.tryBoost();
        const move = input.movement;
        movement.update(fixedDtMs, move.x, move.y);
        const snap = movement.snapshot;
        camera.update(fixedDtMs, snap.x, snap.y, snap.velocityX, snap.velocityY);
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
      });
    }
  },
});

const debugOverlay = import.meta.env.DEV ? new DebugOverlay(document.body) : null;

render();
loop.start();
machine.transitionTo("Splash");
log.info("boot", "Afterlight core gameplay skeleton started");
