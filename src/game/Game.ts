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
import { metaMoteMultiplier } from "./data/metaDefs";
import { GEAR_ITEMS, emptyEquip } from "./data/gearDefs";
import { getStage, isStageUnlocked } from "./data/stageDefs";
import { WARDEN_LIST } from "./data/wardenDefs";
import { ACHIEVEMENT_DEFS, type AchievementContext } from "./data/achievementDefs";
import { Rng } from "../core/math/Rng";
import { clamp } from "../core/math/MathUtils";

/** Local calendar date as YYYY-MM-DD — the Daily Run seed source. */
function dailyDateString(): string {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

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

  /** True while the current run is a Daily Run (fixed seed, equal footing). */
  private isDailyRun = false;
  /** Whether a weapon was evolved this run (for the achievement). */
  private runEvolved = false;

  // First-run tutorial (non-blocking coach hints).
  private tutorialActive = false;
  private tutorialStep = 0;
  private tutorialStepTime = 0;
  private tutorialMoveTime = 0;

  constructor(canvas: HTMLCanvasElement, uiParent: HTMLElement) {
    this.renderer = new Renderer(canvas);
    this.input = new Input(canvas);
    this.world = new World();

    this.save.load();
    this.audio.settings = this.save.data.audio;

    this.ui = new UIManager(uiParent, this.save, this.audio, {
      onStart: () => this.startRun(false),
      onStartDaily: () => this.startRun(true),
      onPause: () => this.pause(),
      onResume: () => this.resume(),
      onRestart: () => this.startRun(this.isDailyRun),
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
      giveWeapon: (id: string) => this.world.debugGiveWeapon(id),
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
      // Bosses are the headline reward moment — guarantee a gear salvage so they
      // meaningfully advance set completion, on top of the loot shower.
      this.salvageGear();
      this.checkAchievements(); // immediate boss-kill toasts
    });
    e.on("revived", () => {
      // Aegis save — a dramatic beat the player should feel.
      this.audio.evolveFanfare();
      this.camera.addShake(14, 0.7);
      this.ui.flashDamage();
    });
    e.on("playerDied", () => this.onPlayerDied());
  }

  // ---- State transitions -------------------------------------------------

  private startRun(daily = false): void {
    this.audio.unlock();
    this.isDailyRun = daily;
    this.runEvolved = false;
    if (daily) {
      // Daily Run: a fair, equal challenge — fixed daily seed, default Warden,
      // and no permanent meta-upgrades, so the run is the same for everyone.
      this.world.metaLevels = {};
      this.world.gearInventory = {};
      this.world.gearEquipped = emptyEquip();
      this.world.selectedWarden = "lumen";
      this.world.stageId = "fade"; // Daily is always the base stage, equal footing.
      this.world.reset();
      this.world.reseed(Rng.seedFromString(dailyDateString()));
    } else {
      // Apply permanent meta-upgrades, equipped ship gear + selected Warden.
      this.world.metaLevels = this.save.data.meta;
      this.world.gearInventory = this.save.data.gear.inventory;
      this.world.gearEquipped = this.save.data.gear.equipped;
      this.world.selectedWarden = this.save.data.selectedWarden;
      this.world.stageId = this.selectedStageId();
      this.world.reset();
    }
    this.camera.snapTo(this.world.player.x, this.world.player.y);
    this.draftQueue = 0;
    this.applyAccessibility();
    this.ui.hideMenu();
    this.ui.hideGameOver();
    this.ui.hideDraft();
    this.ui.hidePause();
    this.ui.hideBossBar();
    this.ui.hideHint();
    this.ui.showHUD();
    this.state = "playing";

    // First run only: kick off the coach-hint sequence.
    this.tutorialActive = !this.save.data.tutorialSeen;
    this.tutorialStep = 0;
    this.tutorialStepTime = 0;
    this.tutorialMoveTime = 0;
  }

  /** The selected stage id, falling back to base if it's somehow still locked. */
  private selectedStageId(): string {
    const stage = getStage(this.save.data.selectedStage);
    if (isStageUnlocked(stage, this.save.data.lifetime.bosses)) return stage.id;
    return "fade";
  }

  private toMenu(): void {
    this.state = "menu";
    this.tutorialActive = false;
    this.ui.hideHUD();
    this.ui.hidePause();
    this.ui.hideGameOver();
    this.ui.hideDraft();
    this.ui.hideBossBar();
    this.ui.hideHint();
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
    // A weapon evolution is a build-defining moment — celebrate it.
    if (option.kind === "weapon-evolve") {
      this.world.spawnEvolveBurst();
      this.camera.addShake(10, 0.5);
      this.audio.evolveFanfare();
      this.runEvolved = true;
      this.checkAchievements(); // immediate toast for the evolution achievement
    }
    this.ui.hideDraft();
    this.state = "playing";
    // Immediately surface the next draft if more level-ups are queued.
    this.openDraftIfPending();
  }

  private onPlayerDied(): void {
    this.audio.gameOver();
    this.state = "gameover";
    const stats = this.world.stats;
    // Reward: motes scale with time survived and kills, boosted by Fortune.
    const base = stats.elapsed * 0.5 + stats.kills * 0.2;
    const motes = Math.floor(base * metaMoteMultiplier(this.save.data.meta));
    const records = this.save.recordRun(stats, motes);
    if (this.isDailyRun) {
      this.save.recordDaily(dailyDateString(), stats.elapsed, stats.kills);
    }
    // Salvage a gear item from the wreck — every run advances the Hangar.
    this.salvageGear();
    this.checkAchievements();
    this.ui.hideHUD();
    this.ui.showGameOver(stats, motes, records, this.isDailyRun);
  }

  /** Grant one gear-item salvage and toast the result (boss kill / run end). */
  private salvageGear(): void {
    const drop = this.save.grantItemDrop();
    const def = GEAR_ITEMS[drop.id];
    if (!def) return;
    this.ui.showToast(
      def.icon,
      drop.isNew ? `${def.name} found` : `${def.name} core`,
      drop.isNew
        ? `New gear unlocked — equip it in the Hangar.`
        : `Duplicate core banked. Merge it in the Hangar to upgrade.`,
    );
  }

  private achievementContext(): AchievementContext {
    const s = this.world.stats;
    const d = this.save.data;
    const metaPurchases = Object.values(d.meta).reduce((a, b) => a + b, 0);
    return {
      runTime: s.elapsed,
      runKills: s.kills,
      runEliteKills: s.eliteKills,
      runBossKills: s.bossKills,
      runLevel: s.level,
      runEvolved: this.runEvolved,
      runDaily: this.isDailyRun,
      lifetimeBosses: d.lifetime.bosses + s.bossKills,
      metaPurchases,
      wardensUnlocked: d.wardens.length,
      wardensTotal: WARDEN_LIST.length,
    };
  }

  /** Evaluate all achievements; award + toast any newly unlocked. */
  private checkAchievements(): void {
    const ctx = this.achievementContext();
    for (const def of ACHIEVEMENT_DEFS) {
      if (!def.check(ctx)) continue;
      if (this.save.unlockAchievement(def.id)) {
        this.ui.showToast(def.icon, def.name, def.description);
      }
    }
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
      if (this.tutorialActive) this.updateTutorial(dt);
      // Surface any pending level-up draft (pauses the sim).
      this.openDraftIfPending();
    }
  }

  /**
   * First-run coach hints — a short, non-blocking sequence that advances on the
   * player actually doing the thing (or a timeout), then never shows again.
   */
  private updateTutorial(dt: number): void {
    this.tutorialStepTime += dt;
    const moving = this.input.moveX !== 0 || this.input.moveY !== 0;
    if (moving) this.tutorialMoveTime += dt;

    switch (this.tutorialStep) {
      case 0: {
        const touch = (navigator.maxTouchPoints ?? 0) > 0;
        this.ui.showHint(
          touch
            ? "Drag anywhere to move — your weapon fires on its own"
            : "Use WASD or arrow keys to move — your weapon fires on its own",
        );
        // Advance once they've moved for a moment, or after a grace period.
        if (this.tutorialMoveTime > 1.4 || this.tutorialStepTime > 9) this.nextHint();
        break;
      }
      case 1: {
        this.ui.showHint("Defeat the Hollow and gather the light they drop");
        if (this.world.stats.xpCollected > 0 || this.tutorialStepTime > 8) this.nextHint();
        break;
      }
      case 2: {
        this.ui.showHint("Fill the bar to level up, then choose a power-up");
        if (this.world.player.level >= 2 || this.tutorialStepTime > 10) this.nextHint();
        break;
      }
      default: {
        this.finishTutorial();
      }
    }
  }

  private nextHint(): void {
    this.tutorialStep++;
    this.tutorialStepTime = 0;
  }

  private finishTutorial(): void {
    this.tutorialActive = false;
    this.ui.hideHint();
    this.save.data.tutorialSeen = true;
    this.save.save();
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
