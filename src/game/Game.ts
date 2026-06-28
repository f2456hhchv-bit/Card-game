import { Renderer } from "../engine/Renderer";
import { Camera } from "../engine/Camera";
import { Input } from "../engine/Input";
import { GameLoop } from "../engine/GameLoop";
import { World } from "./World";
import { GameRenderer } from "./render/GameRenderer";
import { AudioManager } from "./audio/AudioManager";
import { SaveManager } from "./save/SaveManager";
import { UIManager } from "../ui/UIManager";
import type { DraftOption } from "./Loadout";
import { clamp } from "../core/math/MathUtils";

/** High-level game states. The simulation only advances while `playing`. */
export type GameState = "menu" | "playing" | "paused" | "draft" | "gameover";

/**
 * Top-level orchestrator. Wires the fixed-step loop to the World, routes input,
 * manages state transitions (menu ↔ play ↔ draft ↔ pause ↔ game over), and
 * bridges gameplay events to audio, screen feedback and persistence.
 */
export class Game {
  private readonly renderer: Renderer;
  private readonly camera = new Camera();
  private readonly input: Input;
  private readonly loop: GameLoop;
  private readonly world: World;
  private readonly gameRenderer = new GameRenderer();
  private readonly audio = new AudioManager();
  private readonly save = new SaveManager();
  private readonly ui: UIManager;

  private state: GameState = "menu";
  /** Drafts queued faster than the player resolves them (multi-level-ups). */
  private draftQueue = 0;
  private shakeRand = Math.random;

  constructor(canvas: HTMLCanvasElement, uiParent: HTMLElement) {
    this.renderer = new Renderer(canvas);
    this.input = new Input(canvas);
    this.world = new World();

    this.save.load();
    this.audio.settings = this.save.data.audio;

    this.ui = new UIManager(uiParent, this.save, this.audio, {
      onStart: () => this.startRun(),
      onResume: () => this.resume(),
      onRestart: () => this.startRun(),
      onToMenu: () => this.toMenu(),
      onPickDraft: (opt) => this.pickDraft(opt),
    });

    this.loop = new GameLoop({
      update: (dt) => this.update(dt),
      render: (alpha, frameDt) => this.render(alpha, frameDt),
    });

    this.bindEvents();
    this.applyAccessibility();
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  start(): void {
    this.state = "menu";
    this.ui.showMenu();
    this.loop.start();
  }

  /**
   * Optional debug console API, attached to `window.afterlight` only when the
   * page is opened with `#dev` (see main.ts). Handy for playtesting specific
   * situations without grinding to them. Never enabled in normal play.
   */
  getDebugApi() {
    return {
      spawnBoss: () => this.world.debugTriggerBoss(),
      addLevel: () => this.world.events.emit("levelUp", { level: this.world.player.level + 1 }),
      world: this.world,
      state: () => this.state,
    };
  }

  private onResize = (): void => {
    this.renderer.resize();
    this.camera.setViewport(this.renderer.width, this.renderer.height);
  };

  private applyAccessibility(): void {
    const acc = this.save.data.accessibility;
    // Respect the OS-level reduce-motion preference as a default the first time.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      acc.reduceMotion = acc.reduceMotion || true;
    }
    this.gameRenderer.setReduceMotion(acc.reduceMotion);
  }

  private bindEvents(): void {
    const e = this.world.events;
    e.on("weaponFired", () => this.audio.shoot());
    e.on("enemyKilled", (p) => {
      this.audio.kill();
      if (p.elite) this.camera.addShake(7, 0.25);
    });
    e.on("playerHit", () => {
      this.audio.playerHurt();
      this.ui.flashDamage();
      this.camera.addShake(6, 0.22);
    });
    e.on("pickup", (p) => {
      if (p.kind === "xp") this.audio.pickup();
      else if (p.kind === "bomb") this.audio.bomb();
      else this.audio.select();
    });
    e.on("bombDetonate", () => this.camera.addShake(16, 0.5));
    e.on("levelUp", () => {
      this.audio.levelUp();
      this.draftQueue++;
    });
    e.on("bossSpawned", (b) => {
      this.ui.showBossBar(b.name, b.title);
      this.audio.bossWarn();
      this.camera.addShake(12, 0.6);
    });
    e.on("bossDefeated", () => {
      this.ui.hideBossBar();
      this.audio.bossDown();
      this.camera.addShake(20, 0.8);
    });
    e.on("playerDied", () => this.onPlayerDied());
  }

  // ---- State transitions -------------------------------------------------

  private startRun(): void {
    this.audio.unlock();
    this.world.reset();
    this.camera.snapTo(this.world.player.x, this.world.player.y);
    this.draftQueue = 0;
    this.applyAccessibility();
    this.ui.hideMenu();
    this.ui.hideGameOver();
    this.ui.hideDraft();
    this.ui.hidePause();
    this.ui.hideBossBar();
    this.ui.showHUD();
    this.state = "playing";
  }

  private toMenu(): void {
    this.state = "menu";
    this.ui.hideHUD();
    this.ui.hidePause();
    this.ui.hideGameOver();
    this.ui.hideDraft();
    this.ui.hideBossBar();
    this.ui.showMenu();
  }

  private pause(): void {
    if (this.state !== "playing") return;
    this.state = "paused";
    this.ui.showPause();
  }

  private resume(): void {
    if (this.state !== "paused") return;
    this.ui.hidePause();
    this.state = "playing";
  }

  private openDraftIfPending(): void {
    if (this.draftQueue <= 0 || this.state !== "playing") return;
    const options = this.world.loadout.rollDraft(this.world.rng, 3);
    if (options.length === 0) {
      // Everything maxed — convert pending level-ups into a small heal reward.
      this.world.player.hp = Math.min(
        this.world.player.stats.maxHp,
        this.world.player.hp + 25,
      );
      this.draftQueue = 0;
      return;
    }
    this.state = "draft";
    this.ui.showDraft(options);
  }

  private pickDraft(option: DraftOption): void {
    this.world.loadout.applyDraft(option, this.world.player);
    this.draftQueue = Math.max(0, this.draftQueue - 1);
    this.ui.hideDraft();
    this.state = "playing";
    // Immediately surface the next draft if more level-ups are queued.
    this.openDraftIfPending();
  }

  private onPlayerDied(): void {
    this.audio.gameOver();
    this.state = "gameover";
    const stats = this.world.stats;
    // Reward: motes scale with time survived and kills.
    const motes = Math.floor(stats.elapsed * 0.5 + stats.kills * 0.2);
    const records = this.save.recordRun(stats.elapsed, stats.kills, motes);
    this.checkAchievements();
    this.ui.hideHUD();
    this.ui.showGameOver(stats, motes, records);
  }

  private checkAchievements(): void {
    const s = this.world.stats;
    if (s.kills >= 100) this.save.unlockAchievement("centurion");
    if (s.elapsed >= 300) this.save.unlockAchievement("five-minute-vigil");
    if (s.elapsed >= 600) this.save.unlockAchievement("ten-minute-vigil");
    if (s.level >= 20) this.save.unlockAchievement("ascendant");
  }

  // ---- Fixed-step update -------------------------------------------------

  private update(dt: number): void {
    this.input.update();

    if (this.input.consumePause()) {
      if (this.state === "playing") this.pause();
      else if (this.state === "paused") this.resume();
    }

    if (this.state === "playing") {
      this.world.step(dt, this.input);
      this.camera.follow(this.world.player.x, this.world.player.y, dt);
      const acc = this.save.data.accessibility;
      const shakeScale = acc.screenShake ? 1 : 0;
      this.camera.updateShake(dt, this.shakeRand, shakeScale);
      // Surface any pending level-up draft (pauses the sim).
      this.openDraftIfPending();
    }
  }

  // ---- Render ------------------------------------------------------------

  private render(_alpha: number, frameDt: number): void {
    // Cosmetic systems update on real time even while drafting/paused looks
    // frozen — but we freeze them too for a clean "time stop" feel on overlays.
    if (this.state === "playing") {
      this.world.updateCosmetic(frameDt);
      const intensity = clamp(this.world.enemies.length / 300, 0, 1);
      this.audio.updateMusic(frameDt, intensity);
    }

    this.renderer.begin("#05060a");
    this.gameRenderer.render(this.renderer, this.camera, this.world, this.input);

    if (this.state === "playing" || this.state === "paused" || this.state === "draft") {
      this.ui.updateHUD(this.world, this.loop.fps);
    }
  }
}
