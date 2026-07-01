import { Renderer } from "../engine/Renderer";
import { Camera } from "../engine/Camera";
import { Input } from "../engine/Input";
import { GameLoop } from "../engine/GameLoop";
import { World } from "./World";
import { GameRenderer } from "./render/GameRenderer";
import { AudioManager } from "./audio/AudioManager";
import { SaveManager } from "./save/SaveManager";
import { UIManager } from "../ui/UIManager";
import { type RunSnapshot, SNAPSHOT_VERSION } from "./save/RunSnapshot";
import type { DraftOption } from "./Loadout";
import { metaMoteMultiplier } from "./data/metaDefs";
import {
  GEAR_ITEMS,
  SET_LIST,
  emptyEquip,
  completedSets,
  maxedItems,
  rarityName,
} from "./data/gearDefs";
import { getStage, isStageUnlocked } from "./data/stageDefs";
import { levelReward } from "./data/campaignDefs";
import { SIGNATURE_DEFS, SIGNATURE_LIST } from "./data/signatureDefs";
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
export type GameState = "menu" | "playing" | "paused" | "draft" | "gameover" | "cleared";

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
  /** True while the current run is a Boss Rush (endless boss gauntlet). */
  private isBossRush = false;
  /** True while the current run is Endless / Ascension mode. */
  private isEndless = false;
  /** True while the current run is a Stage Gauntlet. */
  private isGauntlet = false;
  /** True while playing a Campaign Sector; `campaignLevel` is which one. */
  private isCampaign = false;
  private campaignLevel = 0;
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
      onStartBossRush: () => this.startRun(false, true),
      onStartEndless: () => this.startRun(false, false, true),
      onStartGauntlet: () => this.startRun(false, false, false, true),
      onStartCampaign: (level: number) => this.startCampaign(level),
      onNextLevel: () => this.startCampaign(this.campaignLevel + 1),
      onContinueRun: () => this.resumeSavedRun(),
      onPause: () => this.pause(),
      onResume: () => this.resume(),
      onRestart: () =>
        this.isCampaign
          ? this.startCampaign(this.campaignLevel)
          : this.startRun(this.isDailyRun, this.isBossRush, this.isEndless, this.isGauntlet),
      onToMenu: () => this.toMenu(),
      onPickDraft: (opt) => this.pickDraft(opt),
      onGearChanged: () => this.checkAchievements(),
      onGraphicsChanged: () => this.applyAccessibility(),
    });

    this.loop = new GameLoop({
      update: (dt) => this.update(dt),
      render: (alpha, frameDt) => this.render(alpha, frameDt),
    });

    this.bindEvents();
    this.applyAccessibility();
    window.addEventListener("resize", this.onResize);
    // Persist a resumable snapshot if the player leaves mid-run (tab close,
    // navigation, or the app being backgrounded on mobile).
    window.addEventListener("pagehide", this.onLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.onLeave();
    });
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
    this.gameRenderer.setBloom(acc.bloom);
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
    e.on("bossDefeated", (b) => {
      this.ui.hideBossBar();
      this.audio.bossDown();
      this.camera.addShake(20, 0.8);
      // Bosses are the headline reward moment — guarantee a gear salvage so they
      // meaningfully advance set completion, on top of the loot shower.
      this.salvageGear();
      // First defeat of a boss type unlocks its signature relic.
      const sig = this.save.unlockSignature(b.id);
      if (sig?.isNew) {
        const def = SIGNATURE_DEFS[sig.id];
        this.ui.showToast(def.icon, `${def.name} claimed`, def.description);
      }
      this.checkAchievements(); // immediate boss-kill toasts
    });
    e.on("ascension", (a) => {
      this.audio.bossWarn();
      this.camera.addShake(8, 0.4);
      this.ui.showToast("▲", `Ascension ${a.level}`, "The Hollow grow stronger — push on.");
    });
    e.on("stageAdvance", (s) => {
      // Reward clearing a stage with a breather heal, then press on.
      const p = this.world.player;
      p.hp = Math.min(p.stats.maxHp, p.hp + p.stats.maxHp * 0.3);
      this.audio.bossDown();
      this.camera.addShake(10, 0.5);
      this.ui.showToast("⟶", `Stage ${s.cleared} cleared`, `Onward to ${s.name}…`);
    });
    e.on("revived", () => {
      // Aegis save — a dramatic beat the player should feel.
      this.audio.evolveFanfare();
      this.camera.addShake(14, 0.7);
      this.ui.flashDamage();
    });
    e.on("playerDied", () => this.onPlayerDied());
    e.on("levelCleared", (l) => this.onLevelCleared(l.level));
  }

  // ---- State transitions -------------------------------------------------

  private startRun(daily = false, bossRush = false, endless = false, gauntlet = false): void {
    this.audio.unlock();
    this.save.clearRunSnapshot(); // a fresh run supersedes any resumable one
    this.isDailyRun = daily;
    this.isBossRush = bossRush;
    this.isEndless = endless;
    this.isGauntlet = gauntlet;
    this.isCampaign = false;
    this.runEvolved = false;
    this.world.bossRush = bossRush;
    this.world.endless = endless;
    this.world.gauntlet = gauntlet;
    this.world.campaign = false;
    if (daily) {
      // Daily Run: a fair, equal challenge — fixed daily seed, default Warden,
      // and no permanent meta-upgrades, so the run is the same for everyone.
      this.world.metaLevels = {};
      this.world.gearInventory = {};
      this.world.gearEquipped = emptyEquip();
      this.world.signatureId = null;
      this.world.selectedWarden = "lumen";
      this.world.wardenLevel = 0; // equal footing — no mastery bonus
      this.world.stageId = "fade"; // Daily is always the base stage, equal footing.
      this.world.reset();
      this.world.reseed(Rng.seedFromString(dailyDateString()));
    } else {
      // Apply permanent meta-upgrades, equipped ship gear + selected Warden.
      this.world.metaLevels = this.save.data.meta;
      this.world.gearInventory = this.save.data.gear.inventory;
      this.world.gearEquipped = this.save.data.gear.equipped;
      this.world.signatureId = this.save.data.signatures.equipped;
      this.world.selectedWarden = this.save.data.selectedWarden;
      this.world.wardenLevel = this.save.wardenLevel(this.save.data.selectedWarden);
      this.world.stageId = this.selectedStageId();
      this.world.reset();
    }
    this.beginRunUi();
  }

  /**
   * Start a Campaign Sector: a finite level with a clear condition. Full loadout
   * (meta/gear/signature/Warden mastery) applies — it's the main progression.
   */
  private startCampaign(level: number): void {
    this.audio.unlock();
    this.save.clearRunSnapshot(); // a fresh run supersedes any resumable one
    this.isDailyRun = false;
    this.isBossRush = false;
    this.isEndless = false;
    this.isGauntlet = false;
    this.isCampaign = true;
    this.campaignLevel = level;
    this.runEvolved = false;
    this.world.bossRush = false;
    this.world.endless = false;
    this.world.gauntlet = false;
    this.world.campaign = true;
    this.world.campaignLevel = level;
    this.world.metaLevels = this.save.data.meta;
    this.world.gearInventory = this.save.data.gear.inventory;
    this.world.gearEquipped = this.save.data.gear.equipped;
    this.world.signatureId = this.save.data.signatures.equipped;
    this.world.selectedWarden = this.save.data.selectedWarden;
    this.world.wardenLevel = this.save.wardenLevel(this.save.data.selectedWarden);
    this.world.reset();
    this.beginRunUi();
  }

  /** Shared setup after any run's World is reset (camera, overlays, HUD, hints). */
  private beginRunUi(): void {
    this.camera.snapTo(this.world.player.x, this.world.player.y);
    this.draftQueue = 0;
    this.applyAccessibility();
    this.ui.hideMenu();
    this.ui.hideGameOver();
    this.ui.hideLevelCleared();
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
    this.ui.hideLevelCleared();
    this.ui.hideDraft();
    this.ui.hideBossBar();
    this.ui.hideHint();
    this.ui.showMenu();
  }

  private pause(): void {
    if (this.state !== "playing") return;
    this.state = "paused";
    this.ui.showPause();
    // Snapshot on pause so the run survives even a hard tab close afterwards.
    this.captureAndPersist();
  }

  // ---- Resumable run (mid-run "Continue") -------------------------------

  /** True while a run is live (playing, paused or mid-draft). */
  private inRun(): boolean {
    return this.state === "playing" || this.state === "paused" || this.state === "draft";
  }

  /** Capture and persist the current run so it can be resumed later. */
  private onLeave = (): void => {
    this.captureAndPersist();
  };

  private captureAndPersist(): void {
    if (!this.inRun()) return;
    const snap: RunSnapshot = {
      ...this.world.captureRunState(),
      version: SNAPSHOT_VERSION,
      mode: {
        daily: this.isDailyRun,
        bossRush: this.isBossRush,
        endless: this.isEndless,
        gauntlet: this.isGauntlet,
        campaign: this.isCampaign,
      },
      runEvolved: this.runEvolved,
      draftQueue: this.draftQueue,
      savedAt: Date.now(),
    };
    this.save.saveRunSnapshot(snap);
  }

  /** Resume a run stored by a previous session, continuing where it left off. */
  private resumeSavedRun(): void {
    const snap = this.save.loadRunSnapshot();
    if (!snap) {
      this.ui.refreshMenu();
      return;
    }
    this.audio.unlock();
    const m = snap.mode;
    this.isDailyRun = m.daily;
    this.isBossRush = m.bossRush;
    this.isEndless = m.endless;
    this.isGauntlet = m.gauntlet;
    this.isCampaign = m.campaign;
    this.campaignLevel = snap.campaignLevel;
    this.runEvolved = snap.runEvolved;
    this.world.bossRush = m.bossRush;
    this.world.endless = m.endless;
    this.world.gauntlet = m.gauntlet;
    this.world.campaign = m.campaign;
    this.world.campaignLevel = snap.campaignLevel;
    // Re-apply the same loadout sources the original run used, so recomputeStats
    // during restore lands on the identical stat block (Daily is equal-footing).
    if (m.daily) {
      this.world.metaLevels = {};
      this.world.gearInventory = {};
      this.world.gearEquipped = emptyEquip();
      this.world.signatureId = null;
      this.world.selectedWarden = "lumen";
      this.world.wardenLevel = 0;
      this.world.stageId = "fade";
    } else {
      this.world.metaLevels = this.save.data.meta;
      this.world.gearInventory = this.save.data.gear.inventory;
      this.world.gearEquipped = this.save.data.gear.equipped;
      this.world.signatureId = this.save.data.signatures.equipped;
      this.world.selectedWarden = this.save.data.selectedWarden;
      this.world.wardenLevel = this.save.wardenLevel(this.save.data.selectedWarden);
      this.world.stageId = snap.stageId;
    }
    this.world.reset();
    this.world.restoreRunState(snap);

    this.camera.snapTo(this.world.player.x, this.world.player.y);
    this.applyAccessibility();
    this.ui.hideMenu();
    this.ui.hideGameOver();
    this.ui.hideLevelCleared();
    this.ui.hideDraft();
    this.ui.hidePause();
    this.ui.hideBossBar();
    this.ui.hideHint();
    this.ui.showHUD();
    this.tutorialActive = false;
    this.draftQueue = snap.draftQueue;
    this.state = "playing";
    // If a level-up draft was open when they left, reopen it immediately.
    this.openDraftIfPending();
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

  /** A Campaign Sector was cleared — reward, record progress, offer to warp on. */
  private onLevelCleared(level: number): void {
    this.state = "cleared";
    this.save.clearRunSnapshot(); // run resolved — nothing to resume
    this.audio.bossDown();
    this.camera.addShake(14, 0.7);
    const firstClear = level >= this.save.data.campaignProgress;
    // Reward Motes (first clear pays full; replays pay a fraction), + Fortune.
    const base = levelReward(level) * (firstClear ? 1 : 0.3);
    const motes = Math.floor(base * metaMoteMultiplier(this.save.data.meta));
    this.save.data.motes += motes;
    if (firstClear) this.save.data.campaignProgress = level + 1;
    // Every clear salvages gear + earns the Warden mastery XP.
    this.salvageGear();
    const wid = this.save.data.selectedWarden;
    this.save.grantWardenXp(wid, 20 + level * 4 + this.world.stats.kills);
    this.save.save();
    this.checkAchievements();
    const hasNext = true; // the campaign is endless (procedural galaxies)
    this.ui.hideHUD();
    this.ui.showLevelCleared(level, motes, firstClear, hasNext);
  }

  private onPlayerDied(): void {
    this.audio.gameOver();
    this.state = "gameover";
    this.save.clearRunSnapshot(); // run resolved — nothing to resume
    const stats = this.world.stats;
    // Reward: motes scale with time survived, kills and bosses felled (the last
    // makes Boss Rush worthwhile), boosted by Fortune.
    const base =
      stats.elapsed * 0.5 +
      stats.kills * 0.2 +
      stats.bossKills * 15 +
      stats.ascension * 8 +
      stats.stagesCleared * 20;
    const motes = Math.floor(base * metaMoteMultiplier(this.save.data.meta));
    const records = this.save.recordRun(stats, motes, {
      stageId: this.world.stageId,
      bossRush: this.isBossRush,
      endless: this.isEndless,
      gauntlet: this.isGauntlet,
      daily: this.isDailyRun,
    });
    if (this.isDailyRun) {
      this.save.recordDaily(dailyDateString(), stats.elapsed, stats.kills);
    }
    // Salvage a gear item from the wreck — every run advances the Hangar.
    this.salvageGear();
    // Warden mastery: the played Warden earns XP from the run (not the Daily,
    // which is equal-footing). Daily forces Lumen, so attribute by save selection.
    if (!this.isDailyRun) {
      const wid = this.save.data.selectedWarden;
      const xp =
        stats.kills +
        Math.floor(stats.elapsed / 2) +
        stats.bossKills * 25 +
        stats.ascension * 8 +
        stats.stagesCleared * 15;
      const res = this.save.grantWardenXp(wid, xp);
      if (res.gained > 0) {
        const w = WARDEN_LIST.find((x) => x.id === wid);
        this.ui.showToast("⬆", `${w?.name ?? "Warden"} — Level ${res.level}`, "Warden mastery deepens.");
      }
    }
    this.checkAchievements();
    this.ui.hideHUD();
    this.ui.showGameOver(
      stats,
      motes,
      records,
      this.isDailyRun,
      this.isBossRush,
      this.isEndless,
      this.isGauntlet,
    );
  }

  /** Grant one gear-item salvage and toast the result (boss kill / run end). */
  private salvageGear(): void {
    const drop = this.save.grantItemDrop();
    const def = GEAR_ITEMS[drop.id];
    if (!def) return;
    const rarity = rarityName(drop.rarity);
    let title: string;
    let body: string;
    if (drop.isNew) {
      title = `${rarity} ${def.name} found`;
      body = "New gear unlocked — equip it in the Hangar.";
    } else if (drop.rarityUp) {
      title = `${def.name} → ${rarity}!`;
      body = "A finer salvage — its rarity (and stats) just rose.";
    } else {
      title = `${def.name} core`;
      body = "Duplicate core banked. Merge it in the Hangar to upgrade.";
    }
    this.ui.showToast(def.icon, title, body);
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
      fullSetsOwned: completedSets(d.gear.inventory),
      setsTotal: SET_LIST.length,
      maxedGearItems: maxedItems(d.gear.inventory),
      signaturesOwned: d.signatures.owned.length,
      signaturesTotal: SIGNATURE_LIST.length,
      wardenMaxLevel: Object.values(d.wardenProgress).reduce((m, p) => Math.max(m, p.level), 0),
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
