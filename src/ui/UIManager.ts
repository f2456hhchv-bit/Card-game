import type { World, RunStats } from "../game/World";
import type { Loadout } from "../game/Loadout";
import type { DraftOption } from "../game/Loadout";
import type { SaveManager } from "../game/save/SaveManager";
import type { AudioManager } from "../game/audio/AudioManager";
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
  onResume(): void;
  onRestart(): void;
  onToMenu(): void;
  onPickDraft(option: DraftOption): void;
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

  private menu!: HTMLDivElement;
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

    this.hpFill = this.el("div", "hp-fill");
    const hpBar = this.el("div", "hp-bar");
    hpBar.appendChild(this.hpFill);
    this.hpText = this.el("div", "hp-text", "100 / 100");
    const hpWrap = this.el("div", "hp-wrap");
    hpWrap.append(hpBar, this.hpText);

    this.loadoutBar = this.el("div", "loadout-bar");
    this.perf = this.el("div", "perf hidden");
    this.flash = this.el("div", "fade-flash");

    hud.append(top, hpWrap, this.loadoutBar, this.perf, this.flash);
    this.root.appendChild(hud);
    this.hud = hud;
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

    const play = this.el("button", "btn", "Begin Vigil");
    play.addEventListener("click", () => this.cb.onStart());

    const settingsBtn = this.el("button", "btn secondary", "Settings");
    settingsBtn.addEventListener("click", () => this.openSettings());

    const btnRow = this.el("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "12px";
    btnRow.style.flexWrap = "wrap";
    btnRow.style.justifyContent = "center";
    btnRow.append(play, settingsBtn);

    o.append(title, sub, stats, btnRow);
    this.root.appendChild(o);
    this.menu = o;
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

      const icon = this.el("div", "card-icon", opt.name.slice(0, 2).toUpperCase());
      const kindLabel =
        opt.kind === "weapon-new"
          ? "New Weapon"
          : opt.kind === "weapon-up"
            ? `Weapon · Lv ${opt.level}`
            : opt.kind === "passive-new"
              ? "New Relic"
              : `Relic · Lv ${opt.level}`;
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
  ): void {
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
      container.replaceChildren(
        stat("Survived", formatTime(stats.elapsed), records.newBestTime),
        stat("Felled", `${stats.kills}`, records.newBestKills),
        stat("Level", `${stats.level}`),
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
