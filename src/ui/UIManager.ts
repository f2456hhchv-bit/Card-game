import type { World, RunStats } from "../game/World";
import type { Loadout } from "../game/Loadout";
import type { DraftOption } from "../game/Loadout";
import type { SaveManager } from "../game/save/SaveManager";
import type { AudioManager } from "../game/audio/AudioManager";
import { META_LIST } from "../game/data/metaDefs";
import {
  WARDEN_LIST,
  WARDEN_LEVEL_CAP,
  wardenXpToNext,
  wardenLevelBonus,
} from "../game/data/wardenDefs";
import { WEAPON_DEFS } from "../game/data/weaponDefs";
import { CHASSIS_LIST } from "../game/data/chassisDefs";
import {
  SLOTS,
  SLOT_META,
  SET_LIST,
  GEAR_ITEMS,
  itemId,
  mergeCost,
  setCounts,
  rarityName,
  rarityColor,
  rarityMult,
  affixText,
  rerollCost,
} from "../game/data/gearDefs";
import { ACHIEVEMENT_DEFS } from "../game/data/achievementDefs";
import { STAGE_LIST, getStage, isStageUnlocked } from "../game/data/stageDefs";
import { SIGNATURE_LIST } from "../game/data/signatureDefs";
import {
  getGalaxy,
  galaxyOf,
  levelLabel,
  isBossSector,
  levelDifficulty,
  SECTORS_PER_GALAXY,
  GALAXY_COUNT,
} from "../game/data/campaignDefs";
import { formatTime } from "../core/format";

/**
 * Owns all DOM-based UI: HUD, main menu, level-up draft, pause, game over and
 * settings. Kept entirely separate from the canvas renderer — gameplay never
 * touches the DOM and UI never touches the simulation, communicating only
 * through explicit method calls and callbacks. This separation keeps both the
 * 120 FPS render path and the accessible, native-feeling UI clean.
 */
export interface UICallbacks {
  onStart(): void;
  onStartDaily(): void;
  onStartBossRush(): void;
  onStartEndless(): void;
  onStartGauntlet(): void;
  /** Launch a Campaign Sector by its global level index. */
  onStartCampaign(level: number): void;
  /** Warp to the next Campaign Sector from the cleared screen. */
  onNextLevel(): void;
  /** Resume the previously-saved mid-run from the menu. */
  onContinueRun(): void;
  onPause(): void;
  onResume(): void;
  /** Fire the Commander's special ability (on-screen button). */
  onSpecial(): void;
  onRestart(): void;
  onToMenu(): void;
  onPickDraft(option: DraftOption): void;
  /** Fired after the player changes gear in the Hangar (merge/equip). */
  onGearChanged(): void;
  /** Fired after a graphics setting (e.g. Bloom) changes, to re-apply it live. */
  onGraphicsChanged?(): void;
}

export class UIManager {
  private readonly root: HTMLDivElement;
  private readonly save: SaveManager;
  private readonly audio: AudioManager;
  private readonly cb: UICallbacks;

  // HUD elements (cached for cheap per-frame updates).
  private hud!: HTMLDivElement;
  private xpFill!: HTMLDivElement;
  private levelLabel!: HTMLDivElement;
  private timerLabel!: HTMLDivElement;
  private killsLabel!: HTMLDivElement;
  private hpFill!: HTMLDivElement;
  private hpText!: HTMLDivElement;
  private loadoutBar!: HTMLDivElement;
  private specialBtn!: HTMLButtonElement;
  private specialIcon!: HTMLSpanElement;
  private specialCdEl!: HTMLDivElement;
  private perf!: HTMLDivElement;
  private flash!: HTMLDivElement;
  private hint!: HTMLDivElement;
  private bossBar!: HTMLDivElement;
  private bossName!: HTMLDivElement;
  private bossFill!: HTMLDivElement;
  private ascLabel!: HTMLDivElement;

  private menu!: HTMLDivElement;
  private bossRushBtn!: HTMLButtonElement;
  private continueBtn!: HTMLButtonElement;
  // Tabbed main-menu structure.
  private tabBar!: HTMLDivElement;
  private journeyPanel!: HTMLDivElement;
  private journeyBody!: HTMLDivElement;
  private playPanel!: HTMLDivElement;
  private morePanel!: HTMLDivElement;
  private activeMenuTab = "journey";
  private currentStop?: HTMLElement;
  private draft!: HTMLDivElement;
  private pause!: HTMLDivElement;
  private gameover!: HTMLDivElement;
  private settings!: HTMLDivElement;
  private campaign!: HTMLDivElement;
  private campaignBody!: HTMLDivElement;
  private levelCleared!: HTMLDivElement;
  /** Which Galaxy the campaign map is currently showing. */
  private viewedGalaxy = 0;

  private showPerf = false;
  private flashTimer = 0;

  constructor(
    parent: HTMLElement,
    save: SaveManager,
    audio: AudioManager,
    cb: UICallbacks,
  ) {
    this.save = save;
    this.audio = audio;
    this.cb = cb;
    this.root = document.createElement("div");
    this.root.className = "ui-root";
    parent.appendChild(this.root);
    this.build();
  }

  private el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: string,
  ): HTMLElementTagNameMap[K] {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  private build(): void {
    this.buildHUD();
    this.buildMenu();
    this.buildDraft();
    this.buildPause();
    this.buildGameOver();
    this.buildSettings();
    this.buildHowTo();
    this.buildShop();
    this.buildWardens();
    this.buildChassis();
    this.buildHangar();
    this.buildRecords();
    this.buildCampaign();
    this.buildLevelCleared();
    this.toastLayer = this.el("div", "toast-layer");
    this.root.appendChild(this.toastLayer);
  }

  // ---- Achievement toasts ------------------------------------------------

  private toastLayer!: HTMLDivElement;

  /** Pop a transient achievement-unlock notification. */
  showToast(icon: string, name: string, description: string): void {
    const t = this.el("div", "toast");
    const ic = this.el("div", "toast-icon", icon);
    const body = this.el("div", "toast-body");
    body.append(
      this.el("div", "toast-title", "Achievement Unlocked"),
      this.el("div", "toast-name", name),
      this.el("div", "toast-desc", description),
    );
    t.append(ic, body);
    this.toastLayer.appendChild(t);
    this.audio.levelUp();
    // Enter, hold, leave, remove.
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => t.classList.remove("show"), 3600);
    setTimeout(() => t.remove(), 4100);
  }

  // ---- HUD ---------------------------------------------------------------

  private buildHUD(): void {
    const hud = this.el("div", "hud hidden");
    const top = this.el("div", "hud-top");

    this.xpFill = this.el("div", "xp-fill");
    const xpBar = this.el("div", "xp-bar");
    xpBar.appendChild(this.xpFill);

    const row = this.el("div", "hud-row");
    this.levelLabel = this.el("div", "hud-level", "LV 1");
    this.timerLabel = this.el("div", "hud-timer", "00:00");
    this.killsLabel = this.el("div", "hud-kills", "0 felled");
    row.append(this.levelLabel, this.timerLabel, this.killsLabel);

    // Endless-only Ascension badge (hidden in other modes).
    this.ascLabel = this.el("div", "hud-asc hidden", "▲ 0");

    top.append(xpBar, row, this.ascLabel);

    // Boss bar (hidden until a boss is active).
    this.bossName = this.el("div", "boss-name", "");
    this.bossFill = this.el("div", "boss-fill");
    const bossTrack = this.el("div", "boss-track");
    bossTrack.appendChild(this.bossFill);
    this.bossBar = this.el("div", "boss-bar hidden");
    this.bossBar.append(this.bossName, bossTrack);

    this.hpFill = this.el("div", "hp-fill");
    const hpBar = this.el("div", "hp-bar");
    hpBar.appendChild(this.hpFill);
    this.hpText = this.el("div", "hp-text", "100 / 100");
    const hpWrap = this.el("div", "hp-wrap");
    hpWrap.append(hpBar, this.hpText);

    this.loadoutBar = this.el("div", "loadout-bar");
    this.perf = this.el("div", "perf hidden");
    this.flash = this.el("div", "fade-flash");
    this.hint = this.el("div", "coach-hint hidden");

    // On-screen pause button (essential on touch — there's no keyboard).
    const pauseBtn = this.el("button", "pause-btn");
    pauseBtn.setAttribute("aria-label", "Pause");
    pauseBtn.innerHTML = '<span class="bar"></span><span class="bar"></span>';
    pauseBtn.addEventListener("click", () => {
      this.audio.select();
      this.cb.onPause();
    });

    // Commander special-ability button (bottom-right thumb reach; Space on desktop).
    this.specialBtn = this.el("button", "special-btn");
    this.specialBtn.setAttribute("aria-label", "Special ability");
    this.specialCdEl = this.el("div", "special-cd");
    this.specialIcon = this.el("span", "special-icon", "✦");
    this.specialBtn.append(this.specialCdEl, this.specialIcon);
    this.specialBtn.addEventListener("click", () => this.cb.onSpecial());

    hud.append(top, this.bossBar, this.hint, hpWrap, this.loadoutBar, pauseBtn, this.specialBtn, this.perf, this.flash);
    this.root.appendChild(hud);
    this.hud = hud;
  }

  private currentHint = "";
  /** Show a non-blocking coach hint (pointer-events pass through). */
  showHint(text: string): void {
    if (this.currentHint === text) return;
    this.currentHint = text;
    this.hint.textContent = text;
    this.hint.classList.remove("hidden");
  }
  hideHint(): void {
    this.currentHint = "";
    this.hint.classList.add("hidden");
  }

  /** Show the boss bar with a name; called when a boss spawns. */
  showBossBar(name: string, title: string): void {
    this.bossName.textContent = `${name} — ${title}`;
    this.bossFill.style.width = "100%";
    this.bossBar.classList.remove("hidden");
  }
  hideBossBar(): void {
    this.bossBar.classList.add("hidden");
  }

  updateHUD(world: World, fps: number): void {
    const p = world.player;
    this.xpFill.style.width = `${Math.min(100, (p.xp / p.xpToNext) * 100)}%`;
    this.levelLabel.textContent = `LV ${p.level}`;
    this.timerLabel.textContent = formatTime(world.stats.elapsed);
    this.killsLabel.textContent = `${world.stats.kills} felled`;
    // Mode badge: Endless Ascension tier, or Gauntlet stage progress.
    if (world.endless) {
      this.ascLabel.classList.remove("hidden");
      this.ascLabel.textContent = `▲ Ascension ${world.stats.ascension}`;
    } else if (world.gauntlet) {
      this.ascLabel.classList.remove("hidden");
      this.ascLabel.textContent = `⟶ Gauntlet · Stage ${Math.min(3, world.stats.stagesCleared + 1)}/3`;
    } else {
      this.ascLabel.classList.add("hidden");
    }
    const hpFrac = Math.max(0, p.hp / p.stats.maxHp);
    this.hpFill.style.width = `${hpFrac * 100}%`;
    this.hpText.textContent = `${Math.ceil(p.hp)} / ${Math.round(p.stats.maxHp)}`;
    this.updateLoadoutBar(world.loadout);

    // Commander special button: icon + radial cooldown sweep + ready glow.
    this.specialIcon.textContent = world.special.icon;
    const cd = world.specialCooldownFraction;
    this.specialCdEl.style.height = `${cd * 100}%`;
    this.specialBtn.classList.toggle("ready", world.specialReady);

    if (world.bossActive) {
      this.bossFill.style.width = `${world.bossHpFraction * 100}%`;
    }

    if (this.showPerf) {
      this.perf.textContent =
        `${fps.toFixed(0)} FPS\n` +
        `${world.enemies.length} hollow\n` +
        `${world.entityCount} entities`;
    }
    // Decay damage flash.
    if (this.flashTimer > 0) {
      this.flashTimer -= 0.016;
      const a = Math.max(0, this.flashTimer) * 0.5;
      this.flash.style.background = `rgba(255,60,90,${a})`;
    }
  }

  private lastLoadoutSig = "";
  private updateLoadoutBar(loadout: Loadout): void {
    // Only rebuild when composition/levels change (avoids per-frame DOM churn).
    let sig = "";
    for (const w of loadout.weapons) sig += `${w.def.id}${w.level},`;
    for (const [id, lvl] of loadout.passives) sig += `${id}${lvl},`;
    if (sig === this.lastLoadoutSig) return;
    this.lastLoadoutSig = sig;

    this.loadoutBar.replaceChildren();
    for (const w of loadout.weapons) {
      const slot = this.el("div", "slot");
      slot.style.background = `hsl(${w.def.hue} 80% 65%)`;
      slot.textContent = w.def.name.slice(0, 2).toUpperCase();
      const lvl = this.el("span", "lvl", `${w.level}`);
      slot.appendChild(lvl);
      slot.title = w.def.name;
      this.loadoutBar.appendChild(slot);
    }
  }

  setPerfVisible(v: boolean): void {
    this.showPerf = v;
    this.perf.classList.toggle("hidden", !v);
  }

  flashDamage(): void {
    this.flashTimer = 0.3;
  }

  showHUD(): void {
    this.hud.classList.remove("hidden");
    // A run is starting — the persistent tab bar must never show over gameplay.
    this.tabBar?.classList.add("hidden");
  }
  hideHUD(): void {
    this.hud.classList.add("hidden");
  }

  // ---- Main menu ---------------------------------------------------------

  private buildMenu(): void {
    const o = this.el("div", "overlay menu-overlay");
    const menuHeader = this.el("div", "menu-header");
    const title = this.el("h1", "menu-title", "AFTERLIGHT");
    const sub = this.el("div", "subtitle", "Hold back the dark");
    const stats = this.el("div", "menu-stats");
    stats.id = "menu-stats";
    menuHeader.append(title, sub, stats);

    // Continue — resume a run left mid-play. Only shown when one is stored.
    this.continueBtn = this.el("button", "btn", "▶ Continue Run");
    this.continueBtn.addEventListener("click", () => this.cb.onContinueRun());

    // ---- Inline panels (switched by the bottom tab bar) ----
    const panels = this.el("div", "menu-panels");

    // Journey — the vertical Galaxy pathway (the hero of the main screen).
    this.journeyPanel = this.el("div", "menu-panel");
    this.journeyBody = this.el("div", "journey");
    this.journeyPanel.append(this.continueBtn, this.journeyBody);

    // Play — the game modes, with the Quick Play stage chooser.
    this.playPanel = this.el("div", "menu-panel hidden");
    const stageRow = this.el("div", "stage-row");
    stageRow.id = "stage-row";
    const play = this.el("button", "btn", "Quick Play");
    play.addEventListener("click", () => this.cb.onStart());
    const dailyBtn = this.el("button", "btn secondary", "Daily Run");
    dailyBtn.addEventListener("click", () => this.cb.onStartDaily());
    const dailyLine = this.el("div", "daily-line");
    dailyLine.id = "daily-line";
    this.bossRushBtn = this.el("button", "btn secondary", "Boss Rush");
    this.bossRushBtn.addEventListener("click", () => {
      if (this.bossRushBtn.classList.contains("locked")) {
        this.showToast("☠", "Boss Rush locked", "Fell a boss in a normal run to unlock the gauntlet.");
        return;
      }
      this.cb.onStartBossRush();
    });
    const endlessBtn = this.el("button", "btn secondary", "Endless");
    endlessBtn.addEventListener("click", () => this.cb.onStartEndless());
    const gauntletBtn = this.el("button", "btn secondary", "Gauntlet");
    gauntletBtn.addEventListener("click", () => this.cb.onStartGauntlet());
    const modeGrid = this.el("div", "mode-grid");
    modeGrid.append(play, dailyBtn, this.bossRushBtn, endlessBtn, gauntletBtn);
    this.playPanel.append(
      this.el("div", "panel-head", "Quick Play — choose a region"),
      stageRow,
      modeGrid,
      dailyLine,
    );

    // More — the secondary destinations.
    this.morePanel = this.el("div", "menu-panel hidden");
    const recordsBtn = this.el("button", "btn secondary", "Records");
    recordsBtn.addEventListener("click", () => this.openRecords());
    const howBtn = this.el("button", "btn secondary", "How to Play");
    howBtn.addEventListener("click", () => this.openHowTo());
    const settingsBtn = this.el("button", "btn secondary", "Settings");
    settingsBtn.addEventListener("click", () => this.openSettings());
    const moreGrid = this.el("div", "mode-grid");
    moreGrid.append(recordsBtn, howBtn, settingsBtn);
    this.morePanel.append(this.el("div", "panel-head", "More"), moreGrid);

    panels.append(this.journeyPanel, this.playPanel, this.morePanel);

    // ---- Bottom tab bar — a persistent shell appended to the ROOT (not the
    // menu overlay), so it stays visible and highlighted across every menu page.
    this.tabBar = this.el("div", "tab-bar hidden");
    const tab = (id: string, icon: string, label: string) => {
      const b = this.el("button", "tab-btn");
      b.append(this.el("span", "tab-icon", icon), this.el("span", "tab-label", label));
      b.dataset.tab = id;
      b.addEventListener("click", () => this.goTab(id));
      this.tabBar.appendChild(b);
    };
    tab("journey", "🗺", "Journey");
    tab("play", "⚔", "Play");
    tab("wardens", "🎖", "Crew");
    tab("ships", "🚀", "Ships");
    tab("hangar", "🧩", "Hangar");
    tab("shop", "🛒", "Shop");
    tab("more", "☰", "More");

    o.append(menuHeader, panels);
    this.root.appendChild(o);
    this.root.appendChild(this.tabBar);
    this.menu = o;
    this.selectMenuPanel("journey");
    this.setActiveTab("journey");
  }

  /** Every full-screen menu sub-page (reached from a tab or a panel button). */
  private hideSubPages(): void {
    for (const o of [
      this.wardens,
      this.chassis,
      this.hangar,
      this.shop,
      this.records,
      this.howto,
      this.settings,
      this.campaign,
    ]) {
      o?.classList.add("hidden");
    }
  }

  /** Highlight the tab for the page the player is currently on. */
  private setActiveTab(id: string): void {
    this.activeMenuTab = id;
    for (const b of Array.from(this.tabBar.children) as HTMLElement[]) {
      b.classList.toggle("active", b.dataset.tab === id);
    }
  }

  /** Show one of the three inline menu panels (Journey / Play / More). */
  private selectMenuPanel(tab: string): void {
    this.journeyPanel.classList.toggle("hidden", tab !== "journey");
    this.playPanel.classList.toggle("hidden", tab !== "play");
    this.morePanel.classList.toggle("hidden", tab !== "more");
    if (tab === "journey") this.refreshJourney();
  }

  /** Navigate to a tab's page (called by the persistent bottom tab bar). */
  private goTab(id: string): void {
    this.audio.select();
    switch (id) {
      case "wardens":
        this.openWardens();
        break;
      case "ships":
        this.openChassis();
        break;
      case "hangar":
        this.openHangar();
        break;
      case "shop":
        this.openShop();
        break;
      default:
        // Inline panel pages live inside the menu overlay.
        this.hideSubPages();
        this.menu.classList.remove("hidden");
        this.selectMenuPanel(id);
        this.setActiveTab(id);
    }
  }

  /**
   * Hide every menu surface (overlays + tab bar) and show the HUD — a guaranteed
   * clean gameplay screen no matter which page the run was launched from. This
   * is the single choke-point that prevents any overlay lingering over the game.
   */
  enterRunUI(): void {
    this.hideSubPages();
    this.menu.classList.add("hidden");
    this.tabBar.classList.add("hidden");
    this.hideGameOver();
    this.hideLevelCleared();
    this.hideDraft();
    this.hidePause();
    this.hideBossBar();
    this.hideHint();
    this.showHUD();
  }

  /**
   * The vertical Galaxy pathway. Galaxies stack with the earliest at the bottom
   * and later ones above, joined by a trailing link — so the player "climbs"
   * upward, scrolling up to preview Galaxies they've yet to conquer. Tapping an
   * unlocked Galaxy opens its Sector map.
   */
  private refreshJourney(): void {
    const progress = this.campaignProgress();
    // Clamp to the finite Galaxy 100 endgame (progress may reach "all cleared").
    const currentGalaxy = Math.min(galaxyOf(progress), GALAXY_COUNT - 1);
    const topGalaxy = Math.min(currentGalaxy + 2, GALAXY_COUNT - 1);
    this.currentStop = undefined;

    this.journeyBody.replaceChildren();
    for (let i = topGalaxy; i >= 0; i--) {
      const g = getGalaxy(i);
      const clearedSectors = Math.max(
        0,
        Math.min(SECTORS_PER_GALAXY, progress - i * SECTORS_PER_GALAXY),
      );
      const unlocked = i <= currentGalaxy;
      const isCurrent = i === currentGalaxy;
      const complete = clearedSectors >= SECTORS_PER_GALAXY;
      const hues = g.palette.nebulaHues;
      const accent = `hsl(${g.palette.fogHue} 72% 62%)`;

      // Trailing link above each stop (except the topmost).
      if (i < topGalaxy) {
        const link = this.el("div", "galaxy-link");
        if (unlocked) link.classList.add("lit");
        this.journeyBody.appendChild(link);
      }

      const stop = this.el("button", "galaxy-stop");
      if (!unlocked) stop.classList.add("locked");
      if (isCurrent) stop.classList.add("current");
      if (complete) stop.classList.add("complete");
      stop.style.setProperty("--accent", accent);

      const emblem = this.el("div", "galaxy-emblem");
      emblem.style.background =
        `radial-gradient(circle at 34% 30%, hsl(${hues[0]} 78% 64%), ` +
        `hsl(${hues[1] ?? hues[0]} 60% 34%) 52%, ${g.palette.baseBottom} 100%)`;
      emblem.append(this.el("div", "galaxy-emblem-core"));
      if (!unlocked) emblem.append(this.el("div", "galaxy-lock", "🔒"));

      const info = this.el("div", "galaxy-info");
      info.append(
        this.el("div", "galaxy-idx", `GALAXY ${i + 1}`),
        this.el("div", "galaxy-name", g.name),
        this.el("div", "galaxy-sub", unlocked ? g.title : "Uncharted — press on to reveal"),
      );
      const pips = this.el("div", "galaxy-pips");
      for (let s = 0; s < SECTORS_PER_GALAXY; s++) {
        const pip = this.el("div", "pip");
        if (s < clearedSectors) pip.classList.add("done");
        if (isBossSector(i * SECTORS_PER_GALAXY + s)) pip.classList.add("boss");
        pips.appendChild(pip);
      }
      info.appendChild(pips);

      stop.append(emblem, info);
      if (unlocked) {
        stop.addEventListener("click", () => {
          this.audio.select();
          this.openCampaignGalaxy(i);
        });
      } else {
        stop.disabled = true;
      }
      if (isCurrent) this.currentStop = stop;
      this.journeyBody.appendChild(stop);
    }
    // Snap the view to the current Galaxy so the player lands on "where I am".
    requestAnimationFrame(() => this.currentStop?.scrollIntoView({ block: "center" }));
  }

  /** Open the Sector map focused on a specific Galaxy (from the Journey map). */
  private openCampaignGalaxy(galaxy: number): void {
    this.viewedGalaxy = galaxy;
    this.refreshCampaign();
    this.hideSubPages();
    this.menu.classList.add("hidden");
    this.campaign.classList.remove("hidden");
    this.setActiveTab("journey");
  }

  /** Rebuild the stage chooser chips (unlock-gated) from the save. */
  private refreshStageChooser(): void {
    const row = this.menu.querySelector("#stage-row");
    if (!row) return;
    const d = this.save.data;
    const selected = getStage(d.selectedStage);
    // If the saved stage is locked, fall the selection back to base.
    if (!isStageUnlocked(selected, d.lifetime.bosses)) d.selectedStage = "fade";

    row.replaceChildren();
    for (const stage of STAGE_LIST) {
      const unlocked = isStageUnlocked(stage, d.lifetime.bosses);
      const active = d.selectedStage === stage.id;
      const chip = this.el("button", "stage-chip");
      chip.style.setProperty("--card-accent", `hsl(${stage.accentHue} 80% 62%)`);
      if (active) chip.classList.add("active");
      if (!unlocked) chip.classList.add("locked");
      const nameRow = this.el("div", "stage-chip-name", stage.name);
      if (unlocked && stage.difficulty > 1) {
        // A small threat badge signals the tougher (richer-salvage) stage.
        nameRow.append(this.el("span", "stage-threat", `▲${stage.difficulty.toFixed(2)}`));
      }
      chip.append(
        nameRow,
        this.el(
          "div",
          "stage-chip-sub",
          unlocked ? stage.title : `🔒 Fell ${stage.unlockBosses} boss to unlock`,
        ),
      );
      if (unlocked) {
        chip.addEventListener("click", () => {
          d.selectedStage = stage.id;
          this.save.save();
          this.audio.select();
          this.refreshStageChooser();
        });
      } else {
        chip.disabled = true;
      }
      row.appendChild(chip);
    }
  }

  /** Today's local date as YYYY-MM-DD, matching Game's Daily Run seed. */
  private todayString(): string {
    const d = new Date();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }

  // ---- How to Play -------------------------------------------------------

  private howto!: HTMLDivElement;
  private buildHowTo(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "HOW TO PLAY");

    const list = this.el("div", "howto");
    const row = (icon: string, text: string) => {
      const r = this.el("div", "howto-row");
      r.append(this.el("div", "howto-icon", icon), this.el("div", "howto-text", text));
      return r;
    };
    const touch = (navigator.maxTouchPoints ?? 0) > 0;
    list.append(
      row("🕹", touch ? "Drag anywhere to move." : "Move with WASD or the arrow keys."),
      row("✦", "Your weapons fire automatically — focus on positioning and dodging."),
      row("◆", "Defeat the Hollow to drop light shards. Walk over them to gain XP."),
      row("⬆", "Each level-up, choose one of three power-ups. Build synergies!"),
      row("★", "Max a weapon + its paired relic to evolve it into a signature form."),
      row("⏸", touch ? "Tap the pause button (top-right) to pause." : "Press Esc or P to pause."),
      row("☠", "Bosses telegraph before they strike — each has its own signature pattern. Learn the tell, then punish the wind-up."),
    );

    // Systems guide — a plain-language tour of everything the menus unlock, so
    // new players aren't lost among Commanders, the Hangar and the game modes.
    const guideTitle = this.el("h3", "howto-subhead", "THE SYSTEMS");
    const guide = this.el("div", "howto");
    const grow = (icon: string, name: string, text: string) => {
      const r = this.el("div", "howto-row");
      const body = this.el("div", "howto-text");
      body.append(this.el("strong", undefined, name + " — "), document.createTextNode(text));
      r.append(this.el("div", "howto-icon", icon), body);
      return r;
    };
    guide.append(
      grow("🎖", "Commanders", "The heroes you pilot. Each starts with a different weapon, a permanent perk, and a signature special power (tap the glowing button, bottom-right, or press Space). Playing a Commander levels up its Mastery for a lasting bonus. Unlock new Commanders with Light Motes."),
      grow("🧩", "Hangar", "Your gear inventory. Equip one item per slot (Hull / Core / Engines / Wings). Items roll a rarity and bonus affixes, and matching a full 4-piece Set grants a powerful set bonus. Merge duplicates to raise an item's grade."),
      grow("⚙", "Alloy & Salvage", "Dismantle spare gear into Alloy, then spend it to re-roll an item's affixes — turning unwanted drops into the stats you actually want."),
      grow("🌌", "Campaign", "The main journey: clear a Sector to warp to the next. Survive the timer (or fell the Sector boss) to advance. Difficulty climbs slowly, Galaxy by Galaxy — endlessly."),
      grow("♾", "Endless", "One run, difficulty ramps every 45s without limit. A pure high-score chase — how far up the Ascension tiers can you climb?"),
      grow("⚔", "Boss Rush", "No fodder — just boss after escalating boss. The place to test a finished build."),
      grow("🏰", "Gauntlet", "Clear three stages back-to-back on a single life. Your HP, level and loadout carry across each stage — pace yourself."),
      grow("🛒", "Shop", "Spend Light Motes (earned every run) on permanent meta-upgrades and Supply Drops. Everything is unlockable through play — no purchases, ever."),
    );

    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeHowTo());
    o.append(title, list, guideTitle, guide, back);
    this.root.appendChild(o);
    this.howto = o;
  }

  private openHowTo(): void {
    this.hideSubPages();
    this.menu.classList.add("hidden");
    this.howto.classList.remove("hidden");
    this.setActiveTab("more"); // How to Play lives under the More tab
  }
  private closeHowTo(): void {
    this.goTab("more");
  }

  // ---- Light Motes shop --------------------------------------------------

  private shop!: HTMLDivElement;
  private shopBalance!: HTMLDivElement;
  private shopCrate!: HTMLDivElement;
  private shopGrid!: HTMLDivElement;

  /** Flat Light-Mote price of a Supply Drop (an infinite gear-chase sink). */
  private static readonly SUPPLY_DROP_COST = 150;

  private buildShop(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "LIGHT MOTES");
    this.shopBalance = this.el("div", "shop-balance");
    this.shopCrate = this.el("div", "shop-crate");
    this.shopGrid = this.el("div", "shop-grid");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeShop());
    o.append(title, this.shopBalance, this.shopCrate, this.shopGrid, back);
    this.root.appendChild(o);
    this.shop = o;
  }

  /** The Supply Drop banner: spend Motes for a random gear item (never maxes). */
  private refreshShopCrate(): void {
    const d = this.save.data;
    const cost = UIManager.SUPPLY_DROP_COST;
    this.shopCrate.replaceChildren();
    const card = this.el("div", "crate-card");
    const body = this.el("div", "crate-body");
    body.append(
      this.el("div", "crate-icon", "🎁"),
      (() => {
        const t = this.el("div", "crate-text");
        t.append(
          this.el("div", "crate-name", "Supply Drop"),
          this.el(
            "div",
            "crate-desc",
            "Salvage a random ship-gear item — rolls rarity + affixes. Chase Legendaries, complete sets, then merge & equip in the Hangar.",
          ),
        );
        return t;
      })(),
    );
    const buy = this.el("button", "btn buy");
    const affordable = d.motes >= cost;
    buy.textContent = `✦ ${cost}`;
    buy.disabled = !affordable;
    if (!affordable) buy.classList.add("cant-afford");
    buy.addEventListener("click", () => this.buySupplyDrop());
    card.append(body, buy);
    this.shopCrate.appendChild(card);
  }

  private buySupplyDrop(): void {
    const d = this.save.data;
    const cost = UIManager.SUPPLY_DROP_COST;
    if (d.motes < cost) return;
    d.motes -= cost;
    const drop = this.save.grantItemDrop(); // also persists
    this.save.save();
    const def = GEAR_ITEMS[drop.id];
    if (def) {
      const rarity = rarityName(drop.rarity);
      this.showToast(
        def.icon,
        drop.isNew ? `${rarity} ${def.name} found` : drop.rarityUp ? `${def.name} → ${rarity}!` : `${def.name} core`,
        drop.isNew ? "New gear — equip it in the Hangar." : "Banked toward a merge in the Hangar.",
      );
    }
    this.audio.levelUp();
    this.refreshShop();
  }

  private refreshShop(): void {
    const d = this.save.data;
    this.shopBalance.textContent = `✦ ${d.motes} Light Motes`;
    this.refreshShopCrate();
    this.shopGrid.replaceChildren();
    for (const def of META_LIST) {
      const level = d.meta[def.id] ?? 0;
      const maxed = level >= def.maxLevel;
      const cost = maxed ? 0 : def.cost(level);

      const card = this.el("div", "shop-card");
      card.style.setProperty("--card-accent", `hsl(${def.hue} 80% 65%)`);
      const head = this.el("div", "shop-card-head");
      head.append(
        this.el("div", "shop-name", def.name),
        this.el("div", "shop-level", `Lv ${level}/${def.maxLevel}`),
      );
      const desc = this.el("div", "shop-desc", def.description);
      const next = this.el(
        "div",
        "shop-next",
        maxed ? "Fully upgraded" : `Next: ${def.note(level + 1)}`,
      );

      const buy = this.el("button", "btn buy");
      if (maxed) {
        buy.textContent = "MAX";
        buy.classList.add("maxed");
        buy.disabled = true;
      } else {
        buy.textContent = `✦ ${cost}`;
        const affordable = d.motes >= cost;
        buy.disabled = !affordable;
        if (!affordable) buy.classList.add("cant-afford");
        buy.addEventListener("click", () => this.purchase(def.id));
      }
      card.append(head, desc, next, buy);
      this.shopGrid.appendChild(card);
    }
  }

  private purchase(id: string): void {
    const d = this.save.data;
    const def = META_LIST.find((m) => m.id === id);
    if (!def) return;
    const level = d.meta[id] ?? 0;
    if (level >= def.maxLevel) return;
    const cost = def.cost(level);
    if (d.motes < cost) return;
    d.motes -= cost;
    d.meta[id] = level + 1;
    this.save.save();
    this.audio.select();
    this.refreshShop();
  }

  private openShop(): void {
    this.hideSubPages();
    this.refreshShop();
    this.menu.classList.add("hidden");
    this.shop.classList.remove("hidden");
    this.setActiveTab("shop");
  }
  private closeShop(): void {
    this.refreshMenuStats(); // balance may have changed
    this.goTab("journey");
  }

  // ---- Wardens (character select) ----------------------------------------

  private wardens!: HTMLDivElement;
  private wardensBalance!: HTMLDivElement;
  private wardensGrid!: HTMLDivElement;

  private buildWardens(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "COMMANDERS");
    this.wardensBalance = this.el("div", "shop-balance");
    this.wardensGrid = this.el("div", "shop-grid");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeWardens());
    o.append(title, this.wardensBalance, this.wardensGrid, back);
    this.root.appendChild(o);
    this.wardens = o;
  }

  private refreshWardens(): void {
    const d = this.save.data;
    this.wardensBalance.textContent = `✦ ${d.motes} Light Motes`;
    this.wardensGrid.replaceChildren();
    for (const def of WARDEN_LIST) {
      const unlocked = d.wardens.includes(def.id);
      const selected = d.selectedWarden === def.id;
      const starter = WEAPON_DEFS[def.starterWeapon]?.name ?? def.starterWeapon;

      const card = this.el("div", "shop-card warden-card");
      card.style.setProperty("--card-accent", `hsl(${def.hue} 80% 65%)`);
      if (selected) card.classList.add("selected");

      const head = this.el("div", "shop-card-head");
      head.append(
        this.el("div", "shop-name", def.name),
        this.el("div", "shop-level", selected ? "★ Selected" : unlocked ? "Owned" : "Locked"),
      );
      const desc = this.el("div", "shop-desc", def.description);
      const perk = this.el("div", "shop-next", def.perk);
      const weap = this.el("div", "warden-weapon", `Starts with: ${starter}`);
      // Signature special power.
      const special = this.el("div", "warden-special");
      special.append(
        this.el("span", "warden-special-name", `${def.special.icon} ${def.special.name}`),
        this.el("span", "warden-special-desc", def.special.description),
      );

      // Mastery: level + XP progress + the cumulative bonus (owned wardens only).
      const prog = d.wardenProgress[def.id] ?? { level: 0, xp: 0 };
      let mastery: HTMLDivElement | null = null;
      if (unlocked) {
        mastery = this.el("div", "warden-mastery");
        const capped = Math.min(prog.level, WARDEN_LEVEL_CAP);
        const need = wardenXpToNext(prog.level);
        const pct = WARDEN_LEVEL_CAP > 0 ? Math.min(100, (prog.xp / need) * 100) : 0;
        const head2 = this.el("div", "mastery-head");
        head2.append(
          this.el("span", "mastery-lv", `Mastery Lv ${prog.level}`),
          this.el("span", "mastery-xp", capped >= WARDEN_LEVEL_CAP ? "MAX" : `${prog.xp}/${need} XP`),
        );
        const bar = this.el("div", "mastery-bar");
        const fill = this.el("div", "mastery-fill");
        fill.style.width = `${capped >= WARDEN_LEVEL_CAP ? 100 : pct}%`;
        bar.appendChild(fill);
        const bonus = this.el(
          "div",
          "mastery-bonus",
          prog.level > 0 ? wardenLevelBonus(prog.level) : "Play to earn mastery bonuses.",
        );
        mastery.append(head2, bar, bonus);
      }

      const btn = this.el("button", "btn buy");
      if (selected) {
        btn.textContent = "SELECTED";
        btn.classList.add("maxed");
        btn.disabled = true;
      } else if (unlocked) {
        btn.textContent = "Select";
        btn.addEventListener("click", () => this.selectWarden(def.id));
      } else {
        btn.textContent = `✦ ${def.unlockCost}`;
        const affordable = d.motes >= def.unlockCost;
        btn.disabled = !affordable;
        if (!affordable) btn.classList.add("cant-afford");
        btn.addEventListener("click", () => this.unlockWarden(def.id));
      }
      card.append(head, desc, perk, weap, special);
      if (mastery) card.append(mastery);
      card.append(btn);
      this.wardensGrid.appendChild(card);
    }
  }

  private selectWarden(id: string): void {
    this.save.data.selectedWarden = id;
    this.save.save();
    this.audio.select();
    this.refreshWardens();
  }

  private unlockWarden(id: string): void {
    const d = this.save.data;
    const def = WARDEN_LIST.find((w) => w.id === id);
    if (!def || d.wardens.includes(id) || d.motes < def.unlockCost) return;
    d.motes -= def.unlockCost;
    d.wardens.push(id);
    d.selectedWarden = id; // auto-select the newly unlocked Warden
    this.save.save();
    this.audio.levelUp();
    this.refreshWardens();
  }

  private openWardens(): void {
    this.hideSubPages();
    this.refreshWardens();
    this.menu.classList.add("hidden");
    this.wardens.classList.remove("hidden");
    this.setActiveTab("wardens");
  }
  private closeWardens(): void {
    this.refreshMenuStats();
    this.goTab("journey");
  }

  // ---- Ships (chassis select) --------------------------------------------

  private chassis!: HTMLDivElement;
  private chassisBalance!: HTMLDivElement;
  private chassisGrid!: HTMLDivElement;

  private buildChassis(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "SHIPS");
    const sub = this.el("div", "subtitle", "Choose your hull — each flies its own way");
    this.chassisBalance = this.el("div", "shop-balance");
    this.chassisGrid = this.el("div", "shop-grid");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.goTab("journey"));
    o.append(title, sub, this.chassisBalance, this.chassisGrid, back);
    this.root.appendChild(o);
    this.chassis = o;
  }

  private refreshChassis(): void {
    const d = this.save.data;
    this.chassisBalance.textContent = `✦ ${d.motes} Light Motes`;
    this.chassisGrid.replaceChildren();
    for (const def of CHASSIS_LIST) {
      const unlocked = d.chassis.includes(def.id);
      const selected = d.selectedChassis === def.id;

      const card = this.el("div", "shop-card warden-card");
      card.style.setProperty("--card-accent", `hsl(${def.hue} 80% 65%)`);
      if (selected) card.classList.add("selected");

      const head = this.el("div", "shop-card-head");
      head.append(
        this.el("div", "shop-name", `${def.icon} ${def.name}`),
        this.el("div", "shop-level", selected ? "★ Piloting" : unlocked ? "Owned" : "Locked"),
      );
      const identity = this.el("div", "shop-next", def.identity);
      const desc = this.el("div", "shop-desc", def.description);
      const special = this.el("div", "warden-special");
      special.append(
        this.el("span", "warden-special-name", "Hull Special"),
        this.el("span", "warden-special-desc", def.passiveNote),
      );

      const btn = this.el("button", "btn buy");
      if (selected) {
        btn.textContent = "PILOTING";
        btn.classList.add("maxed");
        btn.disabled = true;
      } else if (unlocked) {
        btn.textContent = "Pilot";
        btn.addEventListener("click", () => this.selectChassis(def.id));
      } else {
        btn.textContent = `✦ ${def.unlockCost}`;
        const affordable = d.motes >= def.unlockCost;
        btn.disabled = !affordable;
        if (!affordable) btn.classList.add("cant-afford");
        btn.addEventListener("click", () => this.unlockChassis(def.id));
      }
      card.append(head, identity, desc, special, btn);
      this.chassisGrid.appendChild(card);
    }
  }

  private selectChassis(id: string): void {
    this.save.data.selectedChassis = id;
    this.save.save();
    this.audio.select();
    this.refreshChassis();
  }

  private unlockChassis(id: string): void {
    const d = this.save.data;
    const def = CHASSIS_LIST.find((c) => c.id === id);
    if (!def || d.chassis.includes(id) || d.motes < def.unlockCost) return;
    d.motes -= def.unlockCost;
    d.chassis.push(id);
    d.selectedChassis = id; // auto-pilot the newly acquired ship
    this.save.save();
    this.audio.levelUp();
    this.refreshChassis();
  }

  private openChassis(): void {
    this.hideSubPages();
    this.refreshChassis();
    this.menu.classList.add("hidden");
    this.chassis.classList.remove("hidden");
    this.setActiveTab("ships");
  }

  // ---- Hangar (ship modules + merge) -------------------------------------

  private hangar!: HTMLDivElement;
  private hangarEquip!: HTMLDivElement;
  private hangarSets!: HTMLDivElement;
  private hangarSignatures!: HTMLDivElement;
  private hangarBalance!: HTMLDivElement;

  private buildHangar(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "HANGAR");
    const sub = this.el(
      "div",
      "subtitle",
      "Equip one per slot · merge cores for grade · complete a set for its bonus · salvage spare cores into Alloy to reroll affixes.",
    );
    this.hangarBalance = this.el("div", "shop-balance");
    // Equipped loadout summary (4 slots + active set bonuses).
    this.hangarEquip = this.el("div", "equip-panel");
    // Boss-signature relics (one equipped at a time).
    this.hangarSignatures = this.el("div", "set-list");
    // The collected inventory, grouped by set.
    this.hangarSets = this.el("div", "set-list");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeHangar());
    o.append(
      title,
      sub,
      this.hangarBalance,
      this.hangarEquip,
      this.hangarSignatures,
      this.hangarSets,
      back,
    );
    this.root.appendChild(o);
    this.hangar = o;
  }

  private refreshHangar(): void {
    this.hangarBalance.textContent = `⬢ ${this.save.data.alloy} Alloy`;
    this.refreshEquipPanel();
    this.refreshSignatures();
    this.refreshSetList();
  }

  /** Boss-signature relics: one equippable at a time; locked until the boss falls. */
  private refreshSignatures(): void {
    const sig = this.save.data.signatures;
    this.hangarSignatures.replaceChildren();

    const group = this.el("div", "set-group");
    group.style.setProperty("--card-accent", "hsl(45 90% 62%)");
    const head = this.el("div", "set-head");
    head.append(
      this.el("div", "set-name", "Boss Signatures"),
      this.el("div", "set-count", `${sig.owned.length}/${SIGNATURE_LIST.length} claimed`),
    );
    group.append(
      head,
      this.el("div", "set-desc", "Trophies from each boss — equip one. Defeat a boss to claim its relic."),
    );

    const grid = this.el("div", "item-grid");
    for (const def of SIGNATURE_LIST) {
      const owned = sig.owned.includes(def.id);
      const equipped = sig.equipped === def.id;
      const accent = `hsl(${def.hue} 80% 65%)`;

      const card = this.el("div", "item-card");
      card.style.setProperty("--card-accent", accent);
      card.style.setProperty("--rarity", accent);
      if (!owned) card.classList.add("locked");
      if (equipped) card.classList.add("equipped");

      const top = this.el("div", "item-top");
      top.append(
        this.el("span", "item-icon", def.icon),
        this.el("div", "item-name", owned ? def.name : "??? Signature"),
      );
      const sm = this.el("div", "item-grade", owned ? def.title : "Locked");
      const desc = this.el(
        "div",
        "item-stat",
        owned ? def.description : `Defeat the boss ${def.title.replace("from ", "")}.`,
      );

      const actions = this.el("div", "item-actions");
      if (owned) {
        const eq = this.el("button", "btn mini");
        if (equipped) {
          eq.textContent = "Equipped";
          eq.classList.add("maxed");
          eq.disabled = true;
        } else {
          eq.textContent = "Equip";
          eq.addEventListener("click", () => this.equipSignature(def.id));
        }
        actions.appendChild(eq);
        if (equipped) {
          const un = this.el("button", "btn mini");
          un.textContent = "Unequip";
          un.addEventListener("click", () => this.equipSignature(null));
          actions.appendChild(un);
        }
      } else {
        const lock = this.el("button", "btn mini cant-afford");
        lock.textContent = "Locked";
        lock.disabled = true;
        actions.appendChild(lock);
      }

      card.append(top, sm, desc, actions);
      grid.appendChild(card);
    }
    group.append(grid);
    this.hangarSignatures.appendChild(group);
  }

  private equipSignature(id: string | null): void {
    this.save.equipSignature(id);
    this.audio.select();
    this.refreshHangar();
  }

  /** Top panel: the four equipped slots + which set bonuses are active. */
  private refreshEquipPanel(): void {
    const g = this.save.data.gear;
    this.hangarEquip.replaceChildren();

    const slots = this.el("div", "equip-slots");
    for (const slot of SLOTS) {
      const meta = SLOT_META[slot];
      const equippedId = g.equipped[slot];
      const item = equippedId ? GEAR_ITEMS[equippedId] : null;
      const st = equippedId ? g.inventory[equippedId] : null;

      const tile = this.el("div", "equip-slot");
      if (item) tile.style.setProperty("--card-accent", `hsl(${item.hue} 80% 65%)`);
      tile.append(this.el("div", "equip-slot-icon", meta.icon));
      tile.append(this.el("div", "equip-slot-label", meta.label));
      const itemLine = this.el(
        "div",
        "equip-slot-item",
        item && st ? `${item.name} · G${st.grade}` : "— empty —",
      );
      if (item && st) itemLine.style.color = rarityColor(st.rarity ?? 0);
      tile.append(itemLine);
      slots.appendChild(tile);
    }
    this.hangarEquip.appendChild(slots);

    // Active set bonuses across the equipped loadout.
    const counts = setCounts(g.equipped, g.inventory);
    const bonusWrap = this.el("div", "active-bonuses");
    let any = false;
    for (const set of SET_LIST) {
      const n = counts[set.id] ?? 0;
      if (n <= 0) continue;
      const chip = this.el("div", "bonus-chip");
      chip.style.setProperty("--card-accent", `hsl(${set.hue} 80% 65%)`);
      const tiers: string[] = [];
      if (n >= 2) tiers.push(`2pc ${set.bonus2Note}`);
      if (n >= 4) tiers.push(`4pc ${set.bonus4Note}`);
      if (n >= 6) tiers.push(`6pc ${set.bonus6Note}`);
      chip.append(
        this.el("span", "bonus-set", `${set.name} (${n}/${SLOTS.length})`),
        this.el("span", "bonus-text", tiers.length ? tiers.join("  ·  ") : "equip 2+ for a bonus"),
      );
      bonusWrap.appendChild(chip);
      any = true;
    }
    if (!any) {
      bonusWrap.append(
        this.el("div", "bonus-empty", "Equip 2+ items from the same set to activate a set bonus."),
      );
    }
    this.hangarEquip.appendChild(bonusWrap);
  }

  /** Inventory grouped by set: each set shows its 4 slot pieces. */
  private refreshSetList(): void {
    const g = this.save.data.gear;
    this.hangarSets.replaceChildren();

    for (const set of SET_LIST) {
      const accent = `hsl(${set.hue} 80% 65%)`;
      const owned = SLOTS.filter((slot) => (g.inventory[itemId(set.id, slot)]?.grade ?? 0) > 0).length;

      const group = this.el("div", "set-group");
      group.style.setProperty("--card-accent", accent);

      const head = this.el("div", "set-head");
      head.append(
        this.el("div", "set-name", `${set.name}`),
        this.el("div", "set-count", `${owned}/${SLOTS.length} collected`),
      );
      const setDesc = this.el("div", "set-desc", set.description);
      const setBonus = this.el("div", "set-bonus-lines");
      setBonus.append(
        this.el("div", "set-bonus-row", `2-piece — ${set.bonus2Note}`),
        this.el("div", "set-bonus-row", `4-piece — ${set.bonus4Note}`),
        this.el("div", "set-bonus-row big", `6-piece — ${set.bonus6Note}`),
      );

      const grid = this.el("div", "item-grid");
      for (const slot of SLOTS) {
        const def = GEAR_ITEMS[itemId(set.id, slot)];
        const m = g.inventory[def.id] ?? { grade: 0, dupes: 0 };
        const isOwned = m.grade > 0;
        const maxed = m.grade >= def.maxGrade;
        const equipped = g.equipped[slot] === def.id;

        const rarity = m.rarity ?? 0;
        const card = this.el("div", "item-card");
        card.style.setProperty("--card-accent", accent);
        if (isOwned) card.style.setProperty("--rarity", rarityColor(rarity));
        if (!isOwned) card.classList.add("locked");
        if (equipped) card.classList.add("equipped");

        const top = this.el("div", "item-top");
        top.append(
          this.el("span", "item-icon", def.icon),
          this.el("div", "item-name", isOwned ? def.name : `${SLOT_META[slot].label}`),
        );
        const gradeRow = this.el("div", "item-grade");
        if (isOwned) {
          const pill = this.el("span", "rarity-pill", rarityName(rarity));
          pill.style.color = rarityColor(rarity);
          pill.style.borderColor = rarityColor(rarity);
          gradeRow.append(pill, this.el("span", undefined, `G${m.grade}/${def.maxGrade}`));
        } else {
          gradeRow.textContent = "Not found";
        }
        const grade = gradeRow;
        const pips = this.el("div", "grade-pips small");
        for (let i = 1; i <= def.maxGrade; i++) {
          pips.appendChild(this.el("div", `pip${i <= m.grade ? " on" : ""}`));
        }
        const stat = this.el(
          "div",
          "item-stat",
          isOwned ? def.note(m.grade, rarityMult(rarity)) : "Salvage one from a run.",
        );

        // Rolled bonus sub-stats (affixes), one line each.
        const affixWrap = this.el("div", "item-affixes");
        if (isOwned && m.affixes && m.affixes.length > 0) {
          for (const a of m.affixes) {
            affixWrap.appendChild(this.el("div", "affix-line", `◆ ${affixText(a)}`));
          }
        }

        const actions = this.el("div", "item-actions");
        if (isOwned) {
          // Equip / Equipped button.
          const eq = this.el("button", "btn mini");
          if (equipped) {
            eq.textContent = "Equipped";
            eq.classList.add("maxed");
            eq.disabled = true;
          } else {
            eq.textContent = "Equip";
            eq.addEventListener("click", () => this.equipItem(def.id));
          }
          actions.appendChild(eq);

          // Merge button.
          const mg = this.el("button", "btn mini");
          if (maxed) {
            mg.textContent = "MAX";
            mg.classList.add("maxed");
            mg.disabled = true;
          } else {
            const cost = mergeCost(m.grade);
            const canMerge = m.dupes >= cost;
            mg.textContent = `Merge ⬡${m.dupes}/${cost}`;
            mg.disabled = !canMerge;
            if (!canMerge) mg.classList.add("cant-afford");
            mg.addEventListener("click", () => this.mergeItem(def.id));
          }
          actions.appendChild(mg);
        } else {
          const lock = this.el("button", "btn mini cant-afford");
          lock.textContent = "Locked";
          lock.disabled = true;
          actions.appendChild(lock);
        }

        // Second action row: salvage spare cores into Alloy, and reroll affixes.
        const actions2 = this.el("div", "item-actions");
        if (isOwned && m.dupes > 0) {
          const sv = this.el("button", "btn mini");
          sv.textContent = `Salvage ⬡${m.dupes}`;
          sv.title = "Dismantle banked cores into Alloy";
          sv.addEventListener("click", () => this.salvageDupes(def.id));
          actions2.appendChild(sv);
        }
        if (isOwned && rarity >= 1) {
          const cost = rerollCost(rarity);
          const rr = this.el("button", "btn mini");
          const canAfford = this.save.data.alloy >= cost;
          rr.textContent = `Reroll ⬢${cost}`;
          rr.title = "Reroll this item's affixes";
          rr.disabled = !canAfford;
          if (!canAfford) rr.classList.add("cant-afford");
          rr.addEventListener("click", () => this.rerollAffixes(def.id));
          actions2.appendChild(rr);
        }

        card.append(top, grade, pips, stat, affixWrap, actions);
        if (actions2.childElementCount > 0) card.append(actions2);
        grid.appendChild(card);
      }

      group.append(head, setDesc, setBonus, grid);
      this.hangarSets.appendChild(group);
    }
  }

  private equipItem(id: string): void {
    if (!this.save.equipItem(id)) return;
    this.audio.select();
    this.refreshHangar();
  }

  private salvageDupes(id: string): void {
    const gained = this.save.dismantleDupes(id);
    if (gained === null) return;
    this.audio.select();
    this.refreshHangar();
  }

  private rerollAffixes(id: string): void {
    if (this.save.rerollAffixes(id) === null) return;
    this.audio.levelUp();
    this.refreshHangar();
  }

  private mergeItem(id: string): void {
    const newGrade = this.save.mergeItem(id);
    if (newGrade === null) return;
    this.audio.levelUp();
    const def = GEAR_ITEMS[id];
    if (def && newGrade >= def.maxGrade) {
      const r = this.save.data.gear.inventory[id]?.rarity ?? 0;
      this.showToast(
        def.icon,
        `${def.name} — Grade ${newGrade}`,
        `Max grade reached: ${def.note(newGrade, rarityMult(r))}`,
      );
    }
    this.refreshHangar();
    this.cb.onGearChanged(); // may unlock the Master Smith / set achievements
  }

  private openHangar(): void {
    this.hideSubPages();
    this.refreshHangar();
    this.menu.classList.add("hidden");
    this.hangar.classList.remove("hidden");
    this.setActiveTab("hangar");
  }
  private closeHangar(): void {
    this.goTab("journey");
  }

  // ---- Records (lifetime stats + achievements) ---------------------------

  private records!: HTMLDivElement;
  private recordsStats!: HTMLDivElement;
  private recordsStages!: HTMLDivElement;
  private recordsGrid!: HTMLDivElement;

  private buildRecords(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "RECORDS");
    this.recordsStats = this.el("div", "records-stats");
    this.recordsStages = this.el("div", "records-stages");
    const achHead = this.el("div", "records-ach-head", "Achievements");
    this.recordsGrid = this.el("div", "ach-grid");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeRecords());
    o.append(title, this.recordsStats, this.recordsStages, achHead, this.recordsGrid, back);
    this.root.appendChild(o);
    this.records = o;
  }

  private refreshRecords(): void {
    const d = this.save.data;
    const stat = (label: string, value: string) => {
      const s = this.el("div", "stat");
      s.append(this.el("b", undefined, value), this.el("span", undefined, label));
      return s;
    };
    const hrs = Math.floor(d.lifetime.time / 3600);
    const mins = Math.floor((d.lifetime.time % 3600) / 60);
    this.recordsStats.replaceChildren(
      stat("Best Time", formatTime(d.bestTime)),
      stat("Most Felled", `${d.bestKills}`),
      stat("Boss Rush", d.bossRushBest > 0 ? `${d.bossRushBest} bosses` : "—"),
      stat("Endless", d.endlessBest > 0 ? `Asc ${d.endlessBest}` : "—"),
      stat("Gauntlet", d.gauntletBest > 0 ? `${d.gauntletBest}/3 stages` : "—"),
      stat("Runs", `${d.runsPlayed}`),
      stat("Bosses Slain", `${d.lifetime.bosses}`),
      stat("Time Played", hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`),
    );

    // Per-stage best times (only stages the player has recorded a run on).
    this.recordsStages.replaceChildren();
    const played = STAGE_LIST.filter((s) => d.stageBest[s.id]);
    if (played.length > 0) {
      this.recordsStages.appendChild(this.el("div", "records-sub-head", "Best by Stage"));
      const list = this.el("div", "stage-best-list");
      for (const s of played) {
        const best = d.stageBest[s.id];
        const row = this.el("div", "stage-best-row");
        row.style.setProperty("--card-accent", `hsl(${s.accentHue} 80% 62%)`);
        row.append(
          this.el("span", "stage-best-name", s.name),
          this.el("span", "stage-best-val", `${formatTime(best.time)} · ${best.kills} felled`),
        );
        list.appendChild(row);
      }
      this.recordsStages.appendChild(list);
    }

    const unlocked = new Set(d.achievements);
    const done = ACHIEVEMENT_DEFS.filter((a) => unlocked.has(a.id)).length;
    this.recordsGrid.replaceChildren();
    for (const a of ACHIEVEMENT_DEFS) {
      const got = unlocked.has(a.id);
      const card = this.el("div", `ach-card${got ? " got" : ""}`);
      const icon = this.el("div", "ach-icon", got ? a.icon : "🔒");
      const body = this.el("div", "ach-body");
      body.append(
        this.el("div", "ach-name", a.name),
        this.el("div", "ach-desc", a.description),
      );
      card.append(icon, body);
      this.recordsGrid.appendChild(card);
    }
    const head = this.records.querySelector(".records-ach-head");
    if (head) head.textContent = `Achievements — ${done}/${ACHIEVEMENT_DEFS.length}`;
  }

  private openRecords(): void {
    this.hideSubPages();
    this.refreshRecords();
    this.menu.classList.add("hidden");
    this.records.classList.remove("hidden");
    this.setActiveTab("more"); // Records lives under the More tab
  }
  private closeRecords(): void {
    this.goTab("more");
  }

  // ---- Campaign map (Galaxies → Sectors) ---------------------------------

  private buildCampaign(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "CAMPAIGN");
    this.campaignBody = this.el("div", "campaign-body");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeCampaign());
    o.append(title, this.campaignBody, back);
    this.root.appendChild(o);
    this.campaign = o;
  }

  /** The furthest global level the player has reached (next to clear). */
  private campaignProgress(): number {
    return this.save.data.campaignProgress;
  }

  private refreshCampaign(): void {
    const progress = this.campaignProgress();
    // Furthest galaxy with any unlocked sector, clamped to the Galaxy 100 finale.
    const maxGalaxy = Math.min(galaxyOf(progress), GALAXY_COUNT - 1);
    this.viewedGalaxy = Math.max(0, Math.min(this.viewedGalaxy, maxGalaxy));
    const g = getGalaxy(this.viewedGalaxy);
    const accent = `hsl(${g.palette.fogHue} 70% 62%)`;

    this.campaignBody.replaceChildren();

    // Galaxy header with prev/next warp arrows.
    const header = this.el("div", "galaxy-head");
    header.style.setProperty("--card-accent", accent);
    const prev = this.el("button", "galaxy-nav", "‹");
    prev.disabled = this.viewedGalaxy <= 0;
    prev.addEventListener("click", () => {
      this.viewedGalaxy--;
      this.refreshCampaign();
    });
    const next = this.el("button", "galaxy-nav", "›");
    next.disabled = this.viewedGalaxy >= maxGalaxy;
    next.addEventListener("click", () => {
      this.viewedGalaxy++;
      this.refreshCampaign();
    });
    const titleWrap = this.el("div", "galaxy-title");
    titleWrap.append(
      this.el("div", "galaxy-name", `Galaxy ${this.viewedGalaxy + 1} — ${g.name}`),
      this.el("div", "galaxy-sub", g.title),
    );
    header.append(prev, titleWrap, next);
    this.campaignBody.appendChild(header);

    // Sector node grid.
    const grid = this.el("div", "sector-grid");
    for (let s = 0; s < SECTORS_PER_GALAXY; s++) {
      const level = this.viewedGalaxy * SECTORS_PER_GALAXY + s;
      const cleared = level < progress;
      const current = level === progress;
      const locked = level > progress;
      const boss = isBossSector(level);

      const node = this.el("button", "sector-node");
      node.style.setProperty("--card-accent", accent);
      if (cleared) node.classList.add("cleared");
      if (current) node.classList.add("current");
      if (locked) node.classList.add("locked");
      if (boss) node.classList.add("boss");

      node.append(
        this.el("div", "sector-num", boss ? "☠" : `${s + 1}`),
        this.el("div", "sector-tag", cleared ? "✓" : current ? "▶" : locked ? "🔒" : ""),
      );
      node.title = `${levelLabel(level)} · ×${levelDifficulty(level).toFixed(2)} threat`;
      if (!locked) {
        node.addEventListener("click", () => {
          this.audio.select();
          this.cb.onStartCampaign(level);
        });
      } else {
        node.disabled = true;
      }
      grid.appendChild(node);
    }
    this.campaignBody.appendChild(grid);

    // Big "continue" launch button for the current sector (if in this galaxy).
    if (galaxyOf(progress) === this.viewedGalaxy) {
      const launch = this.el("button", "btn", `Launch — ${levelLabel(progress)}`);
      launch.addEventListener("click", () => {
        this.audio.select();
        this.cb.onStartCampaign(progress);
      });
      this.campaignBody.appendChild(launch);
    }
  }

  private openCampaign(): void {
    this.viewedGalaxy = galaxyOf(this.campaignProgress());
    this.refreshCampaign();
    this.hideSubPages();
    this.menu.classList.add("hidden");
    this.campaign.classList.remove("hidden");
    this.setActiveTab("journey"); // the Sector map belongs to the Journey tab
  }
  private closeCampaign(): void {
    this.goTab("journey");
  }
  /** Hide the campaign/sector overlay without returning to the menu (run start). */
  hideCampaign(): void {
    this.campaign.classList.add("hidden");
  }

  // ---- Sector-cleared screen ---------------------------------------------

  private buildLevelCleared(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "SECTOR CLEARED");
    title.id = "lc-title";
    const stats = this.el("div", "menu-stats");
    stats.id = "lc-stats";
    const next = this.el("button", "btn", "Next Sector ›");
    next.id = "lc-next";
    next.addEventListener("click", () => this.cb.onNextLevel());
    const map = this.el("button", "btn secondary", "Campaign Map");
    map.addEventListener("click", () => {
      this.hideLevelCleared();
      this.openCampaign();
    });
    const menu = this.el("button", "btn secondary", "Menu");
    menu.addEventListener("click", () => this.cb.onToMenu());
    o.append(title, stats, next, map, menu);
    this.root.appendChild(o);
    this.levelCleared = o;
  }

  showLevelCleared(level: number, motes: number, firstClear: boolean, hasNext: boolean): void {
    const title = this.levelCleared.querySelector("#lc-title");
    if (title) title.textContent = firstClear ? "SECTOR CLEARED!" : "SECTOR CLEARED";
    const stats = this.levelCleared.querySelector("#lc-stats");
    if (stats) {
      const stat = (label: string, value: string) => {
        const s = this.el("div", "stat");
        s.append(this.el("b", undefined, value), this.el("span", undefined, label));
        return s;
      };
      stats.replaceChildren(
        stat("Cleared", levelLabel(level)),
        stat("Reward", `✦ ${motes}`),
        stat("Total Motes", `${this.save.data.motes}`),
      );
    }
    const next = this.levelCleared.querySelector("#lc-next") as HTMLButtonElement | null;
    if (next) next.style.display = hasNext ? "" : "none";
    this.levelCleared.classList.remove("hidden");
  }
  hideLevelCleared(): void {
    this.levelCleared.classList.add("hidden");
  }

  private refreshMenuStats(): void {
    const d = this.save.data;
    const container = this.menu.querySelector("#menu-stats");
    if (!container) return;
    const stat = (label: string, value: string) => {
      const s = this.el("div", "stat");
      const b = this.el("b", undefined, value);
      const l = this.el("span", undefined, label);
      s.append(b, l);
      return s;
    };
    container.replaceChildren(
      stat("Best Time", formatTime(d.bestTime)),
      stat("Most Felled", `${d.bestKills}`),
      stat("Runs", `${d.runsPlayed}`),
      stat("Light Motes", `${d.motes}`),
    );

    this.refreshStageChooser();

    // Boss Rush unlocks after the first boss kill.
    const rushUnlocked = d.lifetime.bosses >= 1;
    this.bossRushBtn.classList.toggle("locked", !rushUnlocked);
    this.bossRushBtn.textContent = rushUnlocked ? "Boss Rush" : "Boss Rush 🔒";

    const dailyLine = this.menu.querySelector("#daily-line");
    if (dailyLine) {
      const today = this.todayString();
      if (d.daily.date === today && (d.daily.bestTime > 0 || d.daily.bestKills > 0)) {
        dailyLine.textContent =
          `Today's Daily — best ${formatTime(d.daily.bestTime)} · ${d.daily.bestKills} felled`;
      } else {
        dailyLine.textContent = "Daily Run — a fair, fixed challenge. Not played today.";
      }
    }
  }

  showMenu(): void {
    this.refreshMenu();
    this.menu.classList.remove("hidden");
    this.tabBar.classList.remove("hidden"); // persistent shell returns with the menu
  }
  hideMenu(): void {
    this.menu.classList.add("hidden");
  }

  /** Refresh menu stats, land on an inline page, and sync the tab highlight. */
  refreshMenu(): void {
    this.refreshMenuStats();
    this.continueBtn.style.display = this.save.hasRunSnapshot() ? "" : "none";
    // Returning to the menu always lands on an inline page (Journey/Play/More);
    // if an overlay tab was last active, fall back to Journey.
    const inline =
      this.activeMenuTab === "play" || this.activeMenuTab === "more"
        ? this.activeMenuTab
        : "journey";
    this.hideSubPages();
    this.selectMenuPanel(inline);
    this.setActiveTab(inline);
  }

  // ---- Level-up draft ----------------------------------------------------

  private buildDraft(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("div", "draft-title", "Channel the Light");
    const cards = this.el("div", "draft-cards");
    cards.id = "draft-cards";
    o.append(title, cards);
    this.root.appendChild(o);
    this.draft = o;
  }

  showDraft(options: DraftOption[]): void {
    const container = this.draft.querySelector("#draft-cards");
    if (!container) return;
    container.replaceChildren();
    for (const opt of options) {
      const card = this.el("div", "card");
      card.style.setProperty("--card-accent", `hsl(${opt.hue} 80% 65%)`);
      // Evolutions get a distinct golden, glowing treatment.
      if (opt.kind === "weapon-evolve") card.classList.add("evolve");

      const icon = this.el("div", "card-icon", opt.name.slice(0, 2).toUpperCase());
      let kindLabel: string;
      switch (opt.kind) {
        case "weapon-new":
          kindLabel = "New Weapon";
          break;
        case "weapon-up":
          kindLabel = `Weapon · Lv ${opt.level}`;
          break;
        case "passive-new":
          kindLabel = "New Relic";
          break;
        case "passive-up":
          kindLabel = `Relic · Lv ${opt.level}`;
          break;
        case "weapon-evolve":
          kindLabel = "★ Evolution ★";
          break;
      }
      const kind = this.el("div", "card-kind", kindLabel);
      const name = this.el("div", "card-name", opt.name);
      const note = this.el("div", "card-note", opt.note);
      const desc = this.el("div", "card-desc", opt.description);
      card.append(icon, kind, name, note, desc);
      card.addEventListener("click", () => {
        this.audio.select();
        this.cb.onPickDraft(opt);
      });
      container.appendChild(card);
    }
    this.draft.classList.remove("hidden");
  }
  hideDraft(): void {
    this.draft.classList.add("hidden");
  }

  // ---- Pause -------------------------------------------------------------

  private buildPause(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "PAUSED");
    const resume = this.el("button", "btn", "Resume");
    resume.addEventListener("click", () => this.cb.onResume());
    const settingsBtn = this.el("button", "btn secondary", "Settings");
    settingsBtn.addEventListener("click", () => this.openSettings());
    const restart = this.el("button", "btn secondary", "Restart Vigil");
    restart.addEventListener("click", () => this.cb.onRestart());
    const menu = this.el("button", "btn secondary", "Abandon to Menu");
    menu.addEventListener("click", () => this.cb.onToMenu());
    o.append(title, resume, settingsBtn, restart, menu);
    this.root.appendChild(o);
    this.pause = o;
  }
  showPause(): void {
    this.pause.classList.remove("hidden");
  }
  hidePause(): void {
    this.pause.classList.add("hidden");
  }

  // ---- Game over ---------------------------------------------------------

  private buildGameOver(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "THE LIGHT FADES");
    title.id = "go-title";
    const stats = this.el("div", "menu-stats");
    stats.id = "go-stats";
    const again = this.el("button", "btn", "Again");
    again.addEventListener("click", () => this.cb.onRestart());
    const menu = this.el("button", "btn secondary", "Return to Menu");
    menu.addEventListener("click", () => this.cb.onToMenu());
    o.append(title, stats, again, menu);
    this.root.appendChild(o);
    this.gameover = o;
  }

  showGameOver(
    stats: RunStats,
    motesEarned: number,
    records: {
      newBestTime: boolean;
      newBestKills: boolean;
      newBestEndless?: boolean;
      newBestGauntlet?: boolean;
    },
    daily = false,
    bossRush = false,
    endless = false,
    gauntlet = false,
  ): void {
    const title = this.gameover.querySelector("#go-title");
    if (title) {
      title.textContent = gauntlet
        ? stats.stagesCleared >= 3
          ? "GAUNTLET CLEARED!"
          : "GAUNTLET — THE LIGHT FADES"
        : endless
          ? "ENDLESS — THE LIGHT FADES"
          : bossRush
            ? "BOSS RUSH — THE LIGHT FADES"
            : daily
              ? "DAILY RUN — THE LIGHT FADES"
              : "THE LIGHT FADES";
    }
    const container = this.gameover.querySelector("#go-stats");
    if (container) {
      const stat = (label: string, value: string, highlight = false) => {
        const s = this.el("div", "stat");
        const b = this.el("b", undefined, value);
        if (highlight) b.style.color = "var(--ui-warn)";
        const l = this.el("span", undefined, label);
        s.append(b, l);
        return s;
      };
      const dmg =
        stats.damageDealt >= 100000
          ? `${(stats.damageDealt / 1000).toFixed(0)}k`
          : `${Math.round(stats.damageDealt)}`;
      const tiles = [
        stat("Survived", formatTime(stats.elapsed), records.newBestTime),
      ];
      // Each alt-mode headlines its own metric.
      if (endless) tiles.push(stat("Ascension", `${stats.ascension}`, records.newBestEndless));
      else if (gauntlet)
        tiles.push(stat("Stages", `${stats.stagesCleared}/3`, records.newBestGauntlet));
      else if (bossRush) tiles.push(stat("Bosses", `${stats.bossKills}`, stats.bossKills > 0));
      tiles.push(
        stat("Felled", `${stats.kills}`, records.newBestKills),
        stat("Elites", `${stats.eliteKills}`),
        stat("Level", `${stats.level}`),
        stat("Damage", dmg),
        stat("Motes", `+${motesEarned}`),
      );
      container.replaceChildren(...tiles);
    }
    this.gameover.classList.remove("hidden");
  }
  hideGameOver(): void {
    this.gameover.classList.add("hidden");
  }

  // ---- Settings ----------------------------------------------------------

  private buildSettings(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "SETTINGS");
    const panel = this.el("div", "settings");

    const sliderRow = (
      label: string,
      get: () => number,
      set: (v: number) => void,
    ) => {
      const row = this.el("div", "setting-row");
      const l = this.el("label", undefined, label);
      const input = this.el("input");
      input.type = "range";
      input.min = "0";
      input.max = "100";
      input.value = `${Math.round(get() * 100)}`;
      input.addEventListener("input", () => {
        set(parseInt(input.value, 10) / 100);
        this.audio.applySettings();
      });
      row.append(l, input);
      return row;
    };

    const toggleRow = (label: string, get: () => boolean, set: (v: boolean) => void) => {
      const row = this.el("div", "setting-row");
      const l = this.el("label", undefined, label);
      const tog = this.el("button", "toggle");
      const sync = () => tog.classList.toggle("on", get());
      sync();
      tog.addEventListener("click", () => {
        set(!get());
        sync();
        this.audio.applySettings();
        this.save.save();
      });
      row.append(l, tog);
      return row;
    };

    const a = this.audio.settings;
    const acc = this.save.data.accessibility;
    panel.append(
      sliderRow("Master Volume", () => a.master, (v) => (a.master = v)),
      sliderRow("Effects", () => a.sfx, (v) => (a.sfx = v)),
      sliderRow("Ambience", () => a.music, (v) => (a.music = v)),
      toggleRow("Mute", () => a.muted, (v) => (a.muted = v)),
      toggleRow("Screen Shake", () => acc.screenShake, (v) => (acc.screenShake = v)),
      toggleRow("Bloom & Grading", () => acc.bloom, (v) => {
        acc.bloom = v;
        this.cb.onGraphicsChanged?.();
      }),
      toggleRow("Reduce Motion", () => acc.reduceMotion, (v) => (acc.reduceMotion = v)),
      toggleRow("Damage Numbers", () => acc.damageNumbers, (v) => (acc.damageNumbers = v)),
      toggleRow("Show Performance", () => this.showPerf, (v) => this.setPerfVisible(v)),
    );

    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => {
      this.save.save();
      this.closeSettings();
    });
    o.append(title, panel, back);
    this.root.appendChild(o);
    this.settings = o;
  }

  private settingsReturn: "menu" | "pause" = "menu";
  private openSettings(): void {
    this.settingsReturn = this.pause.classList.contains("hidden") ? "menu" : "pause";
    this.menu.classList.add("hidden");
    this.pause.classList.add("hidden");
    this.settings.classList.remove("hidden");
    // From the menu, Settings sits under More; from pause it's an in-run overlay
    // (tab bar stays hidden).
    if (this.settingsReturn === "menu") this.setActiveTab("more");
  }
  private closeSettings(): void {
    this.settings.classList.add("hidden");
    if (this.settingsReturn === "menu") this.goTab("more");
    else this.pause.classList.remove("hidden");
  }

  /** Callbacks for accessibility settings that the Game needs to observe. */
  getAccessibility() {
    return this.save.data.accessibility;
  }
}
