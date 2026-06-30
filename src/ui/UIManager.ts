import type { World, RunStats } from "../game/World";
import type { Loadout } from "../game/Loadout";
import type { DraftOption } from "../game/Loadout";
import type { SaveManager } from "../game/save/SaveManager";
import type { AudioManager } from "../game/audio/AudioManager";
import { META_LIST } from "../game/data/metaDefs";
import { WARDEN_LIST } from "../game/data/wardenDefs";
import { WEAPON_DEFS } from "../game/data/weaponDefs";
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
} from "../game/data/gearDefs";
import { ACHIEVEMENT_DEFS } from "../game/data/achievementDefs";
import { STAGE_LIST, getStage, isStageUnlocked } from "../game/data/stageDefs";
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
  onPause(): void;
  onResume(): void;
  onRestart(): void;
  onToMenu(): void;
  onPickDraft(option: DraftOption): void;
  /** Fired after the player changes gear in the Hangar (merge/equip). */
  onGearChanged(): void;
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
  private perf!: HTMLDivElement;
  private flash!: HTMLDivElement;
  private hint!: HTMLDivElement;
  private bossBar!: HTMLDivElement;
  private bossName!: HTMLDivElement;
  private bossFill!: HTMLDivElement;

  private menu!: HTMLDivElement;
  private bossRushBtn!: HTMLButtonElement;
  private draft!: HTMLDivElement;
  private pause!: HTMLDivElement;
  private gameover!: HTMLDivElement;
  private settings!: HTMLDivElement;

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
    this.buildHangar();
    this.buildRecords();
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

    top.append(xpBar, row);

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

    hud.append(top, this.bossBar, this.hint, hpWrap, this.loadoutBar, pauseBtn, this.perf, this.flash);
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
    const hpFrac = Math.max(0, p.hp / p.stats.maxHp);
    this.hpFill.style.width = `${hpFrac * 100}%`;
    this.hpText.textContent = `${Math.ceil(p.hp)} / ${Math.round(p.stats.maxHp)}`;
    this.updateLoadoutBar(world.loadout);

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
  }
  hideHUD(): void {
    this.hud.classList.add("hidden");
  }

  // ---- Main menu ---------------------------------------------------------

  private buildMenu(): void {
    const o = this.el("div", "overlay");
    const title = this.el("h1", undefined, "AFTERLIGHT");
    const sub = this.el("div", "subtitle", "Hold back the dark");

    const stats = this.el("div", "menu-stats");
    stats.id = "menu-stats";

    // Stage chooser — sits above Begin so the choice is made before launching.
    const stageRow = this.el("div", "stage-row");
    stageRow.id = "stage-row";

    const play = this.el("button", "btn", "Begin Vigil");
    play.addEventListener("click", () => this.cb.onStart());

    const dailyBtn = this.el("button", "btn secondary", "Daily Run");
    dailyBtn.addEventListener("click", () => this.cb.onStartDaily());
    const dailyLine = this.el("div", "daily-line");
    dailyLine.id = "daily-line";

    // Boss Rush — unlocked once the player has felled a boss.
    this.bossRushBtn = this.el("button", "btn secondary", "Boss Rush");
    this.bossRushBtn.addEventListener("click", () => {
      if (this.bossRushBtn.classList.contains("locked")) {
        this.showToast("☠", "Boss Rush locked", "Fell a boss in a normal run to unlock the gauntlet.");
        return;
      }
      this.cb.onStartBossRush();
    });

    const wardensBtn = this.el("button", "btn secondary", "Wardens");
    wardensBtn.addEventListener("click", () => this.openWardens());

    const hangarBtn = this.el("button", "btn secondary", "Hangar");
    hangarBtn.addEventListener("click", () => this.openHangar());

    const recordsBtn = this.el("button", "btn secondary", "Records");
    recordsBtn.addEventListener("click", () => this.openRecords());

    const shopBtn = this.el("button", "btn secondary", "Shop");
    shopBtn.addEventListener("click", () => this.openShop());

    const howBtn = this.el("button", "btn secondary", "How to Play");
    howBtn.addEventListener("click", () => this.openHowTo());

    const settingsBtn = this.el("button", "btn secondary", "Settings");
    settingsBtn.addEventListener("click", () => this.openSettings());

    const btnRow = this.el("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "12px";
    btnRow.style.flexWrap = "wrap";
    btnRow.style.justifyContent = "center";
    btnRow.append(play, dailyBtn, this.bossRushBtn, wardensBtn, hangarBtn, shopBtn, recordsBtn, howBtn, settingsBtn);

    o.append(title, sub, stats, stageRow, btnRow, dailyLine);
    this.root.appendChild(o);
    this.menu = o;
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
      row("☠", "A boss, The Maw, arrives at 3:00. Hold back the dark as long as you can."),
    );

    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeHowTo());
    o.append(title, list, back);
    this.root.appendChild(o);
    this.howto = o;
  }

  private openHowTo(): void {
    this.menu.classList.add("hidden");
    this.howto.classList.remove("hidden");
  }
  private closeHowTo(): void {
    this.howto.classList.add("hidden");
    this.menu.classList.remove("hidden");
  }

  // ---- Light Motes shop --------------------------------------------------

  private shop!: HTMLDivElement;
  private shopBalance!: HTMLDivElement;
  private shopGrid!: HTMLDivElement;

  private buildShop(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "LIGHT MOTES");
    this.shopBalance = this.el("div", "shop-balance");
    this.shopGrid = this.el("div", "shop-grid");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeShop());
    o.append(title, this.shopBalance, this.shopGrid, back);
    this.root.appendChild(o);
    this.shop = o;
  }

  private refreshShop(): void {
    const d = this.save.data;
    this.shopBalance.textContent = `✦ ${d.motes} Light Motes`;
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
    this.refreshShop();
    this.menu.classList.add("hidden");
    this.shop.classList.remove("hidden");
  }
  private closeShop(): void {
    this.shop.classList.add("hidden");
    this.refreshMenuStats(); // balance may have changed
    this.menu.classList.remove("hidden");
  }

  // ---- Wardens (character select) ----------------------------------------

  private wardens!: HTMLDivElement;
  private wardensBalance!: HTMLDivElement;
  private wardensGrid!: HTMLDivElement;

  private buildWardens(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "WARDENS");
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
      card.append(head, desc, perk, weap, btn);
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
    this.refreshWardens();
    this.menu.classList.add("hidden");
    this.wardens.classList.remove("hidden");
  }
  private closeWardens(): void {
    this.wardens.classList.add("hidden");
    this.refreshMenuStats();
    this.menu.classList.remove("hidden");
  }

  // ---- Hangar (ship modules + merge) -------------------------------------

  private hangar!: HTMLDivElement;
  private hangarEquip!: HTMLDivElement;
  private hangarSets!: HTMLDivElement;

  private buildHangar(): void {
    const o = this.el("div", "overlay hidden");
    const title = this.el("h2", undefined, "HANGAR");
    const sub = this.el(
      "div",
      "subtitle",
      "Equip one item per ship slot. Merge duplicate cores to raise an item's grade — and equip a full set of 4 for a powerful set bonus.",
    );
    // Equipped loadout summary (4 slots + active set bonuses).
    this.hangarEquip = this.el("div", "equip-panel");
    // The collected inventory, grouped by set.
    this.hangarSets = this.el("div", "set-list");
    const back = this.el("button", "btn", "Back");
    back.addEventListener("click", () => this.closeHangar());
    o.append(title, sub, this.hangarEquip, this.hangarSets, back);
    this.root.appendChild(o);
    this.hangar = o;
  }

  private refreshHangar(): void {
    this.refreshEquipPanel();
    this.refreshSetList();
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
      chip.append(
        this.el("span", "bonus-set", `${set.name} (${n}/4)`),
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
        this.el("div", "set-count", `${owned}/4 collected`),
      );
      const setDesc = this.el("div", "set-desc", set.description);
      const setBonus = this.el("div", "set-bonus-lines");
      setBonus.append(
        this.el("div", "set-bonus-row", `2-piece — ${set.bonus2Note}`),
        this.el("div", "set-bonus-row big", `4-piece — ${set.bonus4Note}`),
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

        card.append(top, grade, pips, stat, affixWrap, actions);
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
    this.refreshHangar();
    this.menu.classList.add("hidden");
    this.hangar.classList.remove("hidden");
  }
  private closeHangar(): void {
    this.hangar.classList.add("hidden");
    this.menu.classList.remove("hidden");
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
    this.refreshRecords();
    this.menu.classList.add("hidden");
    this.records.classList.remove("hidden");
  }
  private closeRecords(): void {
    this.records.classList.add("hidden");
    this.menu.classList.remove("hidden");
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
    this.refreshMenuStats();
    this.menu.classList.remove("hidden");
  }
  hideMenu(): void {
    this.menu.classList.add("hidden");
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
    records: { newBestTime: boolean; newBestKills: boolean },
    daily = false,
    bossRush = false,
  ): void {
    const title = this.gameover.querySelector("#go-title");
    if (title) {
      title.textContent = bossRush
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
      container.replaceChildren(
        stat("Survived", formatTime(stats.elapsed), records.newBestTime),
        // Boss Rush headlines bosses felled; normal runs headline kills.
        stat("Bosses", `${stats.bossKills}`, bossRush && stats.bossKills > 0),
        stat("Felled", `${stats.kills}`, records.newBestKills),
        stat("Elites", `${stats.eliteKills}`),
        stat("Level", `${stats.level}`),
        stat("Damage", dmg),
        stat("Motes", `+${motesEarned}`),
      );
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
  }
  private closeSettings(): void {
    this.settings.classList.add("hidden");
    if (this.settingsReturn === "menu") this.menu.classList.remove("hidden");
    else this.pause.classList.remove("hidden");
  }

  /** Callbacks for accessibility settings that the Game needs to observe. */
  getAccessibility() {
    return this.save.data.accessibility;
  }
}
