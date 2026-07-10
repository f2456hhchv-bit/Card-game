import type { Game, GameEvent } from "../game/Game";
import type { OfflineResult } from "../game/sim/Offline";
import { formatNumber, formatPercent, formatDuration } from "../core/format";
import { xpToNextLevel, HERO_NAME } from "../game/data/heroDefs";
import { biomeForStage } from "../game/data/stageDefs";
import { UPGRADES } from "../game/data/upgradeDefs";
import {
  GEAR_SLOTS,
  SLOT_LABEL,
  STAT_LABEL,
  RARITY_LABEL,
  RARITY_COLOR,
  gearEffectiveValue,
  type GearSlot,
} from "../game/data/gearDefs";
import { PRESTIGE } from "../game/data/prestigeDefs";
import { LIGHT_MOTE_ICON, AFTERGLOW_ICON } from "./currencyIcons";

type TabId = "battle" | "hero" | "gear" | "shop" | "prestige";
const TABS: { id: TabId; label: string }[] = [
  { id: "battle", label: "Battle" },
  { id: "hero", label: "Hero" },
  { id: "gear", label: "Gear" },
  { id: "shop", label: "Shop" },
  { id: "prestige", label: "Renewal" },
];

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function statPercentOrFlat(stat: string): boolean {
  return stat === "critChance" || stat === "goldFind" || stat === "essenceFind";
}

export class UIManager {
  private root: HTMLElement;
  private game: Game;
  private tabButtons = new Map<TabId, HTMLButtonElement>();
  private panels = new Map<TabId, HTMLElement>();

  private goldEl!: HTMLElement;
  private dustEl!: HTMLElement;
  private afterglowEl!: HTMLElement;
  private stageEl!: HTMLElement;
  private biomeEl!: HTMLElement;
  private heroLevelEl!: HTMLElement;
  private xpFillEl!: HTMLElement;
  private hpFillEl!: HTMLElement;
  private hpTextEl!: HTMLElement;

  private battleStatGrid!: HTMLElement;
  private heroStatGrid!: HTMLElement;

  private upgradeRows = new Map<string, { cost: HTMLElement; level: HTMLElement; btn: HTMLButtonElement }>();
  private gearCards = new Map<
    GearSlot,
    { icon: HTMLElement; name: HTMLElement; stat: HTMLElement; enhanceBtn: HTMLButtonElement; enhanceCost: HTMLElement }
  >();

  private prestigeCurrentEl!: HTMLElement;
  private prestigePreviewEl!: HTMLElement;
  private prestigeBtn!: HTMLButtonElement;
  private prestigeHint!: HTMLElement;

  private toastStack!: HTMLElement;
  private modalBackdrop!: HTMLElement;

  constructor(mount: HTMLElement, game: Game) {
    this.game = game;
    this.root = el("div", "ui-root");
    mount.appendChild(this.root);

    this.buildTopBar();
    this.buildHeroHud();
    this.buildTabs();
    this.buildPanels();
    this.toastStack = el("div", "toast-stack");
    this.root.appendChild(this.toastStack);
    this.modalBackdrop = el("div", "modal-backdrop hidden");
    this.root.appendChild(this.modalBackdrop);

    game.on((event) => this.onGameEvent(event));
    if (game.offlineSummary) this.showOfflineModal(game.offlineSummary);

    this.switchTab("battle");
    this.update();
  }

  // ---- Construction ---------------------------------------------------

  /** Painted currency icon (see tools/vanguardCurrency.py) in a chip's glyph slot. */
  private glyphImg(src: string): HTMLImageElement {
    const img = document.createElement("img");
    img.className = "glyph";
    img.src = src;
    img.alt = "";
    img.draggable = false;
    return img;
  }

  private buildTopBar(): void {
    const bar = el("div", "top-bar");
    const gold = el("div", "stat-chip gold");
    gold.append(this.glyphImg(LIGHT_MOTE_ICON), (this.goldEl = el("span", undefined, "0")));
    const dust = el("div", "stat-chip dust");
    dust.append(el("span", "glyph", "⚙"), (this.dustEl = el("span", undefined, "0")));
    const afterglow = el("div", "stat-chip afterglow");
    afterglow.append(this.glyphImg(AFTERGLOW_ICON), (this.afterglowEl = el("span", undefined, "0")));
    bar.append(gold, dust, afterglow);

    const stageRow = el("div", "stage-row");
    this.stageEl = el("b", undefined, "Stage 1");
    this.biomeEl = el("div", undefined, "");
    stageRow.append(this.stageEl, this.biomeEl);
    bar.appendChild(stageRow);

    this.root.appendChild(bar);
  }

  private buildHeroHud(): void {
    const wrap = el("div", "hero-hud");
    const row1 = el("div", "hero-hud-row");
    this.heroLevelEl = el("span", undefined, `Lv.1 ${HERO_NAME}`);
    row1.append(this.heroLevelEl, el("span", undefined, "Essence"));
    const xpBar = el("div", "bar");
    this.xpFillEl = el("div", "bar-fill xp-fill");
    xpBar.appendChild(this.xpFillEl);

    const row2 = el("div", "hero-hud-row");
    this.hpTextEl = el("span", undefined, "HP");
    row2.append(el("span", undefined, "Vitality"), this.hpTextEl);
    const hpBar = el("div", "bar");
    this.hpFillEl = el("div", "bar-fill hp-fill");
    hpBar.appendChild(this.hpFillEl);

    wrap.append(row1, xpBar, row2, hpBar);
    this.root.appendChild(wrap);
  }

  private buildTabs(): void {
    const nav = el("nav", "tabs");
    for (const tab of TABS) {
      const btn = el("button", "tab-btn", tab.label);
      btn.type = "button";
      btn.addEventListener("click", () => this.switchTab(tab.id));
      this.tabButtons.set(tab.id, btn);
      nav.appendChild(btn);
    }
    this.root.appendChild(nav);
  }

  private buildPanels(): void {
    const container = el("div", "panels");
    this.root.appendChild(container);

    for (const tab of TABS) {
      const panel = el("section", "panel hidden");
      panel.dataset.panel = tab.id;
      this.panels.set(tab.id, panel);
      container.appendChild(panel);
    }

    this.buildBattlePanel();
    this.buildHeroPanel();
    this.buildGearPanel();
    this.buildShopPanel();
    this.buildPrestigePanel();
  }

  private buildBattlePanel(): void {
    const panel = this.panels.get("battle")!;
    const card = el("div", "card");
    card.append(el("div", "card-title", "Combat power"));
    this.battleStatGrid = el("div", "stat-grid");
    card.appendChild(this.battleStatGrid);
    panel.appendChild(card);

    const hint = el("div", "card");
    hint.append(
      el("div", "card-title", "How it works"),
      el(
        "div",
        "card-sub",
        "Your hero fights automatically. Spend Light Motes on Shop upgrades, equip and Enhance Gear with Alloy, and trigger Renewal for permanent power once you're strong enough.",
      ),
    );
    panel.appendChild(hint);
  }

  private buildHeroPanel(): void {
    const panel = this.panels.get("hero")!;
    const card = el("div", "card");
    card.append(el("div", "card-title", "Effective stats"));
    this.heroStatGrid = el("div", "stat-grid");
    card.appendChild(this.heroStatGrid);
    panel.appendChild(card);
  }

  private buildGearPanel(): void {
    const panel = this.panels.get("gear")!;
    const grid = el("div", "gear-grid");
    for (const slot of GEAR_SLOTS) {
      const card = el("div", "gear-card");
      card.appendChild(el("div", "gear-slot-label", SLOT_LABEL[slot]));
      const iconRow = el("div", "gear-icon-row");
      const icon = el("div", "gear-icon empty");
      const info = el("div");
      const name = el("div", "gear-name", "Empty");
      const stat = el("div", "gear-stat", "—");
      info.append(name, stat);
      iconRow.append(icon, info);
      const enhanceBtn = el("button", "enhance-btn", "Enhance") as HTMLButtonElement;
      enhanceBtn.type = "button";
      const enhanceCost = el("span", undefined, "");
      enhanceBtn.appendChild(enhanceCost);
      enhanceBtn.addEventListener("click", () => this.game.enhanceGear(slot));
      card.append(iconRow, enhanceBtn);
      grid.appendChild(card);
      this.gearCards.set(slot, { icon, name, stat, enhanceBtn, enhanceCost });
    }
    panel.appendChild(grid);
  }

  private buildShopPanel(): void {
    const panel = this.panels.get("shop")!;
    for (const def of UPGRADES) {
      const row = el("div", "upgrade-row");
      const info = el("div", "upgrade-info");
      info.append(
        el("div", "upgrade-name", def.name),
        el("div", "upgrade-desc", def.desc),
      );
      const level = el("div", "upgrade-level", "Lv. 0");
      info.appendChild(level);
      const btn = el("button", "buy-btn") as HTMLButtonElement;
      btn.type = "button";
      const cost = el("div", undefined, "0");
      const label = el("div", undefined, "✦");
      btn.append(cost, label);
      btn.addEventListener("click", () => this.game.buyUpgrade(def.id));
      row.append(info, btn);
      panel.appendChild(row);
      this.upgradeRows.set(def.id, { cost, level, btn });
    }
  }

  private buildPrestigePanel(): void {
    const panel = this.panels.get("prestige")!;
    const card = el("div", "card prestige-hero");
    card.append(el("div", "card-sub", "Afterglow (permanent power)"));
    this.prestigeCurrentEl = el("div", "prestige-afterglow", "0");
    card.appendChild(this.prestigeCurrentEl);
    this.prestigeHint = el("div", "card-sub");
    card.appendChild(this.prestigeHint);

    this.prestigeBtn = el("button", "prestige-btn", "Renewal") as HTMLButtonElement;
    this.prestigeBtn.type = "button";
    this.prestigeBtn.addEventListener("click", () => this.game.prestige());
    card.appendChild(this.prestigeBtn);

    this.prestigePreviewEl = el("div", "card-sub");
    card.appendChild(this.prestigePreviewEl);

    panel.appendChild(card);

    const info = el("div", "card");
    info.append(
      el("div", "card-title", "Renewal"),
      el(
        "div",
        "card-sub",
        "Reset your stage, level, gold, gear and shop upgrades in exchange for permanent Afterglow — each point grants +2% to all combat stats, forever, across every future run.",
      ),
    );
    panel.appendChild(info);
  }

  // ---- Tabs -------------------------------------------------------------

  private switchTab(tab: TabId): void {
    for (const [id, btn] of this.tabButtons) btn.classList.toggle("active", id === tab);
    for (const [id, panel] of this.panels) panel.classList.toggle("hidden", id !== tab);
  }

  // ---- Per-frame refresh --------------------------------------------------

  update(): void {
    const state = this.game.state;
    const eff = this.game.effectiveStats();

    this.goldEl.textContent = formatNumber(state.gold);
    this.dustEl.textContent = formatNumber(state.alloy);
    this.afterglowEl.textContent = formatNumber(state.afterglow);
    this.stageEl.textContent = `Stage ${state.stage}`;
    this.biomeEl.textContent = biomeForStage(state.stage).name;

    this.heroLevelEl.textContent = `Lv.${state.heroLevel} ${HERO_NAME}`;
    const xpNeed = xpToNextLevel(state.heroLevel);
    this.xpFillEl.style.width = `${formatPercent(xpNeed > 0 ? state.heroXp / xpNeed : 0)}`;
    const hpFrac = eff.hp > 0 ? state.heroHp / eff.hp : 0;
    this.hpFillEl.style.width = formatPercent(hpFrac);
    this.hpTextEl.textContent = `${formatNumber(Math.max(0, state.heroHp))} / ${formatNumber(eff.hp)}`;

    this.renderStatGrid(this.battleStatGrid, eff);
    this.renderStatGrid(this.heroStatGrid, eff);

    for (const def of UPGRADES) {
      const row = this.upgradeRows.get(def.id);
      if (!row) continue;
      const level = this.game.upgradeLevel(def.id);
      const maxed = def.maxLevel !== undefined && level >= def.maxLevel;
      row.level.textContent = def.maxLevel !== undefined ? `Lv. ${level} / ${def.maxLevel}` : `Lv. ${level}`;
      if (maxed) {
        row.cost.textContent = "MAX";
        row.btn.disabled = true;
      } else {
        const cost = this.game.upgradeCostFor(def.id) ?? 0;
        row.cost.textContent = formatNumber(cost);
        row.btn.disabled = !this.game.canBuyUpgrade(def.id);
      }
    }

    for (const slot of GEAR_SLOTS) {
      const card = this.gearCards.get(slot)!;
      const item = state.gear[slot];
      if (!item) {
        card.icon.className = "gear-icon empty";
        card.icon.style.background = "";
        card.name.textContent = "Empty";
        card.stat.textContent = "—";
        card.enhanceBtn.disabled = true;
        card.enhanceCost.textContent = "";
        continue;
      }
      const color = RARITY_COLOR[item.rarity];
      card.icon.className = "gear-icon";
      card.icon.style.background = `radial-gradient(circle at 35% 30%, #fff2, ${color})`;
      card.name.textContent = `${item.name} ${item.enhanceLevel > 0 ? `+${item.enhanceLevel}` : ""}`.trim();
      card.name.style.color = color;
      const value = gearEffectiveValue(item);
      const display = statPercentOrFlat(item.stat) ? formatPercent(value) : formatNumber(value);
      card.stat.textContent = `${RARITY_LABEL[item.rarity]} · ${STAT_LABEL[item.stat]} +${display}`;
      const cost = this.game.enhanceCostFor(slot) ?? 0;
      card.enhanceCost.textContent = ` (${formatNumber(cost)} ⚙)`;
      card.enhanceBtn.disabled = !this.game.canEnhanceGear(slot);
    }

    this.prestigeCurrentEl.textContent = formatNumber(state.afterglow);
    const preview = this.game.prestigePreview();
    const canPrestige = this.game.canPrestige();
    this.prestigeBtn.disabled = !canPrestige;
    this.prestigeBtn.textContent = canPrestige ? `Renewal for +${formatNumber(preview)} Afterglow` : "Renewal (locked)";
    this.prestigeHint.textContent = canPrestige
      ? "Ready — Renewal resets your run and grants the Afterglow above."
      : `Reach Stage ${PRESTIGE.unlockStage} to unlock Renewal (highest this run: Stage ${state.highestStageReached}).`;
    this.prestigePreviewEl.textContent = `Current power bonus: +${formatPercent(state.afterglow * PRESTIGE.powerPerAfterglow)}`;
  }

  private renderStatGrid(grid: HTMLElement, eff: ReturnType<Game["effectiveStats"]>): void {
    grid.replaceChildren();
    const rows: [string, string][] = [
      ["Attack", formatNumber(eff.atk)],
      ["Defense", formatNumber(eff.def)],
      ["Max HP", formatNumber(eff.hp)],
      ["Crit Chance", formatPercent(eff.critChance)],
      ["Crit Damage", `${eff.critMulti.toFixed(2)}×`],
      ["Attack Speed", `${eff.attacksPerSecond.toFixed(2)}/s`],
      ["Light Motes Find", `+${formatPercent(eff.goldFind)}`],
      ["Essence Find", `+${formatPercent(eff.essenceFind)}`],
    ];
    for (const [k, v] of rows) {
      const k1 = el("div", "k", k);
      const v1 = el("div", "v", v);
      grid.append(k1, v1);
    }
  }

  // ---- Events / toasts / modal -------------------------------------------

  private onGameEvent(event: GameEvent): void {
    if (event.kind === "combat") {
      const e = event.event;
      if (e.type === "levelUp") this.toast(`Level ${e.toLevel}!`, "var(--ui-good)");
      if (e.type === "heroDeath") this.toast("Overwhelmed — retreating!", "var(--ui-bad)");
    } else if (event.kind === "prestiged") {
      this.toast(`Renewal! +${formatNumber(event.afterglow)} Afterglow`, "var(--ui-purple)");
      this.switchTab("battle");
    } else if (event.kind === "offlineSummary") {
      this.showOfflineModal(event.result);
    } else if (event.kind === "upgradePurchased") {
      // Numbers already reflect the purchase next frame; no toast needed.
    }
  }

  private toast(text: string, color: string): void {
    const node = el("div", "toast", text);
    node.style.color = color;
    this.toastStack.appendChild(node);
    setTimeout(() => node.remove(), 2500);
  }

  private showOfflineModal(result: OfflineResult): void {
    this.modalBackdrop.replaceChildren();
    const card = el("div", "modal-card");
    card.append(el("h2", undefined, "Welcome back"));
    card.append(
      el("div", "away-time", `You were away for ${formatDuration(result.wallClockSeconds)}.`),
    );
    const stats = el("div", "modal-stats");
    const rows: [string, string][] = [
      ["Kills", formatNumber(result.kills)],
      ["Motes earned", formatNumber(result.goldGained)],
      ["Essence earned", formatNumber(result.essenceGained)],
      ["Items found", formatNumber(result.itemsFound)],
    ];
    for (const [k, v] of rows) {
      const wrap = el("div");
      wrap.append(el("div", "k", k), el("div", "v", v));
      stats.appendChild(wrap);
    }
    card.appendChild(stats);
    const closeBtn = el("button", "modal-close-btn", "Continue");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", () => {
      this.modalBackdrop.classList.add("hidden");
      this.game.dismissOfflineSummary();
    });
    card.appendChild(closeBtn);
    this.modalBackdrop.appendChild(card);
    this.modalBackdrop.classList.remove("hidden");
  }
}
