import { Renderer } from "../engine/Renderer";
import { Camera } from "../engine/Camera";
import { Input } from "../engine/Input";
import { GameLoop } from "../engine/GameLoop";
import { World } from "./World";
import { GameRenderer } from "./render/GameRenderer";
import { AudioManager } from "./audio/AudioManager";
import { SaveManager } from "./save/SaveManager";
import { UIManager } from "../ui/UIManager";
import { glyphIcon, signatureIcon, gearIcon } from "../ui/iconArt";
import { type RunSnapshot, SNAPSHOT_VERSION } from "./save/RunSnapshot";
import type { DraftOption } from "./Loadout";
import { metaMoteMultiplier } from "./data/metaDefs";
import {
  GEAR_ITEMS,
  SET_LIST,
  completedSets,
  maxedItems,
  rarityName,
} from "./data/gearDefs";
import { getStage, isStageUnlocked } from "./data/stageDefs";
import { levelReward, isFinalLevel, MAX_LEVEL } from "./data/campaignDefs";
import { SIGNATURE_DEFS, SIGNATURE_LIST } from "./data/signatureDefs";
import { WARDEN_LIST } from "./data/wardenDefs";
import { CHASSIS_LIST } from "./data/chassisDefs";
import { ACHIEVEMENT_DEFS, type AchievementContext } from "./data/achievementDefs";
import { clamp } from "../core/math/MathUtils";

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

  // Cinematic slow-motion (boss beats, big hits). While active, the fixed sim
  // steps less often via a fractional carry, then eases back to full speed.
  private slowmoTime = 0;
  private slowmoDur = 0;
  private slowmoScale = 1;
  private simCarry = 0;

  /** True while the current run is Endless / Ascension mode. */
  private isEndless = false;
  /** True while playing a Story Sector; `campaignLevel` is which one. */
  private isCampaign = false;
  private campaignLevel = 0;
  /** Whether a weapon was evolved this run (for the achievement). */
  private runEvolved = false;
  /** Whether a modified Sector was just cleared (for the achievement). */
  private runModifierCleared = false;

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
      onStartEndless: () => this.startEndless(),
      onStartCampaign: (level: number) => this.startCampaign(level),
      onNextLevel: () => this.startCampaign(Math.min(this.campaignLevel + 1, MAX_LEVEL)),
      onContinueRun: () => this.resumeSavedRun(),
      onPause: () => this.pause(),
      onResume: () => this.resume(),
      onSpecial: () => {
        if (this.state === "playing") this.world.activateSpecial();
      },
      onRestart: () =>
        this.isCampaign ? this.startCampaign(this.campaignLevel) : this.startEndless(),
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
      // Elite kills land with weight: a shake and a crisp hit-stop.
      if (p.elite) {
        this.camera.addShake(7, 0.25);
        this.hitstop(0.05);
      }
    });
    e.on("playerHit", () => {
      this.audio.playerHurt();
      this.ui.flashDamage();
      this.camera.addShake(6, 0.22);
      // Getting struck bites — a brief freeze (throttled by the ~0.5s iframes).
      this.hitstop(0.04);
    });
    e.on("pickup", (p) => {
      if (p.kind === "xp") this.audio.pickup();
      else if (p.kind === "bomb") this.audio.bomb();
      else if (p.kind === "pod") {
        // Securing a Supply Pod is a headline moment — fanfare + a beat of shake.
        this.audio.levelUp();
        this.camera.addShake(8, 0.3);
        this.checkAchievements();
      } else this.audio.select();
    });
    e.on("podSpawned", () => {
      this.audio.bossWarn();
      this.ui.showToast(glyphIcon("pod", 42), "Supply Pod inbound", "Reach it before it self-destructs — 20 seconds.", "Run Event");
    });
    e.on("bombDetonate", () => this.camera.addShake(16, 0.5));
    e.on("levelUp", () => {
      this.audio.levelUp();
      this.draftQueue++;
    });
    e.on("bossSpawned", (b) => {
      this.ui.showBossBar(b.name, b.title);
      this.ui.showBossIntro(b.name, b.title, b.id, b.hue); // cinematic name card
      this.audio.bossWarn();
      this.audio.setBossMode(true); // darker, faster score for the duel
      this.camera.addShake(12, 0.6);
      this.camera.punchZoom(1.16); // quick push-in on the reveal
      this.slowmo(0.55, 0.4); // a held breath as it arrives
    });
    e.on("bossDefeated", (b) => {
      this.ui.hideBossBar();
      this.audio.bossDown();
      this.audio.setBossMode(false);
      this.camera.addShake(24, 0.9);
      this.camera.punchZoom(1.12);
      this.slowmo(0.8, 0.28); // savour the kill
      this.ui.flashScreen(255, 255, 255, 0.5); // white blowout
      // Bosses are the headline reward moment — guarantee a gear salvage so they
      // meaningfully advance set completion, on top of the loot shower.
      this.salvageGear();
      // First defeat of a boss type unlocks its signature relic.
      const sig = this.save.unlockSignature(b.id);
      if (sig?.isNew) {
        const def = SIGNATURE_DEFS[sig.id];
        this.ui.showToast(signatureIcon(def.id, def.hue), `${def.name} claimed`, def.description, "Boss Signature");
      }
      this.checkAchievements(); // immediate boss-kill toasts
    });
    e.on("ascension", (a) => {
      this.audio.bossWarn();
      this.camera.addShake(8, 0.4);
      this.ui.showToast("▲", `Ascension ${a.level}`, "The Hollow grow stronger — push on.", "Endless");
    });
    e.on("stageAdvance", (s) => {
      // Reward clearing a stage with a breather heal, then press on.
      const p = this.world.player;
      p.hp = Math.min(p.stats.maxHp, p.hp + p.stats.maxHp * 0.3);
      this.audio.bossDown();
      this.camera.addShake(10, 0.5);
      this.ui.showToast("⟶", `Stage ${s.cleared} cleared`, `Onward to ${s.name}…`, "Gauntlet");
    });
    e.on("revived", () => {
      // Aegis save — a dramatic beat the player should feel.
      this.audio.evolveFanfare();
      this.camera.addShake(14, 0.7);
      this.ui.flashDamage();
    });
    e.on("playerDied", () => this.onPlayerDied());
    e.on("levelCleared", (l) => this.onLevelCleared(l.level));
    e.on("waveStarted", (w) => {
      // The boss wave announces itself via bossSpawned; earlier waves get a tick.
      if (w.wave > 1 && w.wave < w.total) this.audio.select();
    });
    e.on("special", (sp) => {
      this.audio.evolveFanfare();
      this.camera.addShake(sp.kind === "nova" ? 12 : 7, 0.45);
    });
  }

  // ---- State transitions -------------------------------------------------

  private startEndless(): void {
    this.audio.unlock();
    this.save.clearRunSnapshot(); // a fresh run supersedes any resumable one
    this.isEndless = true;
    this.isCampaign = false;
    this.runEvolved = false;
    this.runModifierCleared = false;
    this.world.endless = true;
    this.world.campaign = false;
    // Apply permanent meta-upgrades, equipped ship gear + selected Warden.
    this.world.metaLevels = this.save.data.meta;
    this.world.gearInventory = this.save.data.gear.inventory;
    this.world.gearEquipped = this.save.data.gear.equipped;
    this.world.signatureId = this.save.data.signatures.equipped;
    this.world.selectedWarden = this.save.data.selectedWarden;
    this.world.wardenLevel = this.save.wardenLevel(this.save.data.selectedWarden);
    this.world.selectedChassis = this.save.data.selectedChassis;
    this.world.stageId = this.selectedStageId();
    this.world.reset();
    this.beginRunUi();
  }

  /**
   * Start a Story Sector: a finite level with a clear condition. Full loadout
   * (meta/gear/signature/Warden mastery) applies — it's the main progression.
   */
  private startCampaign(level: number): void {
    this.audio.unlock();
    this.save.clearRunSnapshot(); // a fresh run supersedes any resumable one
    this.isEndless = false;
    this.isCampaign = true;
    this.campaignLevel = level;
    this.runEvolved = false;
    this.runModifierCleared = false;
    this.world.endless = false;
    this.world.campaign = true;
    this.world.campaignLevel = level;
    this.world.metaLevels = this.save.data.meta;
    this.world.gearInventory = this.save.data.gear.inventory;
    this.world.gearEquipped = this.save.data.gear.equipped;
    this.world.signatureId = this.save.data.signatures.equipped;
    this.world.selectedWarden = this.save.data.selectedWarden;
    this.world.wardenLevel = this.save.wardenLevel(this.save.data.selectedWarden);
    this.world.selectedChassis = this.save.data.selectedChassis;
    this.world.reset();
    this.beginRunUi();
    // Announce the Sector's Modifier so its rules never feel like a cheap shot.
    const mod = this.world.modifier;
    if (mod) {
      this.ui.showToast(glyphIcon(mod.icon, 32), mod.name, `${mod.description} Reward ×${mod.rewardMult}.`, "Sector Modifier");
    }
  }

  /** Shared setup after any run's World is reset (camera, overlays, HUD, hints). */
  private beginRunUi(): void {
    this.camera.snapTo(this.world.player.x, this.world.player.y);
    this.draftQueue = 0;
    this.audio.setBossMode(false); // fresh run starts on the calm score
    this.applyAccessibility();
    // One choke-point hides every menu surface (overlays + tab bar) and shows the
    // HUD, so no page can ever be left covering the game.
    this.ui.enterRunUI();
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

  /**
   * Self-update: a newer build is live on the server. Reload immediately if
   * we're on the menu; otherwise wait for the run to end (never yank a run —
   * the pagehide snapshot makes even that safe, but it would feel rude).
   */
  private updateReadyId: string | null = null;
  markUpdateReady(id: string): void {
    this.updateReadyId = id;
    if (this.state === "menu") this.applyUpdate();
  }
  private applyUpdate(): void {
    const id = this.updateReadyId;
    if (!id) return;
    this.updateReadyId = null;
    this.ui.showToast(glyphIcon("chevronUp", 200), "Update ready", "Loading the newest build…", "Update");
    // Navigate with a cache-busting query so a stale cached index.html can't
    // be served back to us (GitHub Pages caches for ~10 minutes; iOS
    // home-screen apps cache harder still).
    setTimeout(() => {
      window.location.replace(`${window.location.pathname}?v=${id}${window.location.hash}`);
    }, 900);
  }

  private toMenu(): void {
    this.state = "menu";
    this.tutorialActive = false;
    if (this.updateReadyId) this.applyUpdate();
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
        daily: false,
        bossRush: false,
        endless: this.isEndless,
        gauntlet: false,
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
    this.isEndless = m.endless;
    this.isCampaign = m.campaign;
    this.campaignLevel = snap.campaignLevel;
    this.runEvolved = snap.runEvolved;
    this.world.endless = m.endless;
    this.world.campaign = m.campaign;
    this.world.campaignLevel = snap.campaignLevel;
    // Re-apply the same loadout sources the original run used, so recomputeStats
    // during restore lands on the identical stat block.
    this.world.metaLevels = this.save.data.meta;
    this.world.gearInventory = this.save.data.gear.inventory;
    this.world.gearEquipped = this.save.data.gear.equipped;
    this.world.signatureId = this.save.data.signatures.equipped;
    this.world.selectedWarden = this.save.data.selectedWarden;
    this.world.wardenLevel = this.save.wardenLevel(this.save.data.selectedWarden);
    this.world.selectedChassis = this.save.data.selectedChassis;
    this.world.stageId = snap.stageId;
    this.world.reset();
    this.world.restoreRunState(snap);

    this.camera.snapTo(this.world.player.x, this.world.player.y);
    this.applyAccessibility();
    this.ui.enterRunUI();
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
    this.runModifierCleared = this.world.modifier != null;
    // Reward Motes (first clear pays full; replays pay a fraction), + Fortune.
    // Field-collected Motes join the payout (and enjoy the Fortune multiplier).
    // Sector Modifiers pay a premium for the tougher rules.
    const modMult = this.world.modifier?.rewardMult ?? 1;
    const base = levelReward(level) * (firstClear ? 1 : 0.3) * modMult + this.world.stats.motesCollected;
    const motes = Math.floor(base * metaMoteMultiplier(this.save.data.meta));
    this.save.data.motes += motes;
    // Advance progress (may reach TOTAL_SECTORS = "all cleared"; the map clamps
    // its display so it never shows a Galaxy beyond 100).
    if (firstClear) this.save.data.campaignProgress = level + 1;
    // Every clear salvages gear + earns the Commander mastery XP.
    this.salvageGear();
    const wid = this.save.data.selectedWarden;
    this.save.grantWardenXp(wid, 20 + level * 4 + this.world.stats.kills);
    this.save.save();
    this.checkAchievements();
    const final = isFinalLevel(level);
    if (final) {
      this.ui.showToast(glyphIcon("star", 45), "Campaign Complete!", "You have conquered all 100 Galaxies. The dark is held.", "Victory");
    }
    this.ui.hideHUD();
    this.ui.showLevelCleared(level, motes, firstClear, !final);
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
      stats.stagesCleared * 20 +
      stats.motesCollected;
    const motes = Math.floor(base * metaMoteMultiplier(this.save.data.meta));
    const records = this.save.recordRun(stats, motes, {
      stageId: this.world.stageId,
      bossRush: false,
      endless: this.isEndless,
      gauntlet: false,
      daily: false,
    });
    // Feed the run into every active Directive (rotating objectives).
    this.save.recordDirectiveProgress(stats);
    // Salvage a gear item from the wreck — every run advances the Hangar.
    this.salvageGear();
    // Warden mastery: the played Warden earns XP from the run.
    {
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
        this.ui.showToast(glyphIcon("chevronUp", 130), `${w?.name ?? "Commander"} — Level ${res.level}`, "Commander mastery deepens.", "Mastery");
      }
    }
    this.checkAchievements();
    this.ui.hideHUD();
    this.ui.showGameOver(stats, motes, records, this.isEndless);
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
    this.ui.showToast(gearIcon(def.slot), title, body, "Gear Salvaged");
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
      runDaily: false,
      runMotes: s.motesCollected,
      runAffixKills: s.affixKills,
      runPods: s.podsCollected,
      runAscension: s.ascension,
      runStagesCleared: s.stagesCleared,
      runModifierCleared: this.runModifierCleared,
      lifetimeBosses: d.lifetime.bosses + s.bossKills,
      metaPurchases,
      runsPlayed: d.runsPlayed,
      campaignProgress: d.campaignProgress,
      wardensUnlocked: d.wardens.length,
      wardensTotal: WARDEN_LIST.length,
      chassisUnlocked: d.chassis.length,
      chassisTotal: CHASSIS_LIST.length,
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
        this.ui.showToast(glyphIcon(def.icon, 45), def.name, def.description);
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

    if (this.input.consumeSpecial() && this.state === "playing") {
      this.world.activateSpecial();
    }

    if (this.state === "playing") {
      // Cinematic slow-mo: feed the fixed sim on a fractional carry so it steps
      // less often (deterministic; the render loop keeps interpolating between
      // ticks, so slow-mo looks smooth rather than choppy).
      const scale = this.currentTimeScale(dt);
      this.simCarry += scale;
      if (this.simCarry >= 1) {
        this.simCarry -= 1;
        this.world.step(dt, this.input);
      }
      // Camera follow/shake moved to render() so they advance at the display's
      // refresh rate (120Hz iPhones) against the interpolated ship position —
      // stepping them at the 60Hz sim rate made motion judder ("flicker").
      if (this.tutorialActive) this.updateTutorial(dt);
      // Surface any pending level-up draft (pauses the sim).
      this.openDraftIfPending();
    }
  }

  /**
   * Trigger a slow-motion beat: the sim runs at `scale` speed, easing back to
   * 1× over `dur` seconds. No-op under reduce-motion. A stronger beat overrides
   * a weaker one in progress.
   */
  private slowmo(dur: number, scale: number): void {
    if (this.save.data.accessibility.reduceMotion) return;
    if (this.slowmoTime > 0 && scale >= this.slowmoScale) return;
    this.slowmoTime = dur;
    this.slowmoDur = dur;
    this.slowmoScale = scale;
  }

  /**
   * A hit-stop: a very brief near-freeze that snaps back to full speed — the
   * classic "impact" juice. Implemented as an instant slow-mo from ~0. Natural
   * throttling: it won't retrigger while one is already in flight.
   */
  private hitstop(dur: number): void {
    this.slowmo(dur, 0.02);
  }

  /** Current sim time-scale (1 = normal), advancing any active slow-mo. */
  private currentTimeScale(dt: number): number {
    if (this.slowmoTime <= 0) return 1;
    this.slowmoTime = Math.max(0, this.slowmoTime - dt);
    const p = this.slowmoDur > 0 ? this.slowmoTime / this.slowmoDur : 0; // 1→0
    return this.slowmoScale + (1 - this.slowmoScale) * (1 - p); // ease to 1×
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

  private render(alpha: number, frameDt: number): void {
    // Cosmetic systems update on real time even while drafting/paused looks
    // frozen — but we freeze them too for a clean "time stop" feel on overlays.
    const interp = this.state === "playing" ? alpha : 1;
    if (this.state === "playing") {
      this.world.updateCosmetic(frameDt);
      const intensity = clamp(this.world.enemies.length / 300, 0, 1);
      this.audio.updateMusic(frameDt, intensity);
      // Track the ship's interpolated position at full display refresh rate.
      const p = this.world.player;
      const px = p.prevX + (p.x - p.prevX) * interp;
      const py = p.prevY + (p.y - p.prevY) * interp;
      this.camera.follow(px, py, frameDt);
      const acc = this.save.data.accessibility;
      this.camera.updateShake(frameDt, this.shakeRand, acc.screenShake ? 1 : 0);
      this.camera.updateZoom(frameDt);
    }

    this.renderer.begin("#05060a");
    this.gameRenderer.render(this.renderer, this.camera, this.world, this.input, interp);

    if (this.state === "playing" || this.state === "paused" || this.state === "draft") {
      this.ui.updateHUD(this.world, this.loop.fps);
    }
  }
}
