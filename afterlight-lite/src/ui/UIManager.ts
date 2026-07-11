import type { AttachmentSlot, ShipDef, UpgradeDef } from "../game/types";
import { ATTACHMENT_DEFS } from "../game/data/attachmentDefs";
import { nextTier } from "../game/systems/ShopSystem";
import type { SaveData } from "../game/save/SaveManager";
import { drawPlaceholderShape } from "../game/render/PlaceholderArt";

export interface HudState {
  hp: number;
  maxHp: number;
  xp: number;
  xpToNext: number;
  level: number;
  wave: number;
  motes: number;
  shieldCharges: number;
  shieldMax: number;
}

export interface GameOverStats {
  wave: number;
  level: number;
  motesCollected: number;
  motesRetained: number;
}

function iconCanvas(shape: UpgradeDef["icon"] | ShipDef["shape"], size = 40): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(size / 2, size / 2);
  drawPlaceholderShape(ctx, { ...shape, radius: size * 0.36 }, 1);
  return canvas;
}

export class UIManager {
  private root: HTMLElement;
  private shipSelectEl: HTMLElement;
  private hudEl: HTMLElement;
  private hudHpFill: HTMLElement;
  private hudXpFill: HTMLElement;
  private hudWaveLabel: HTMLElement;
  private hudLevelLabel: HTMLElement;
  private hudMotesLabel: HTMLElement;
  private hudShieldLabel: HTMLElement;
  private waveBannerEl: HTMLElement;
  private waveBannerTimeout: number | undefined;
  private levelUpEl: HTMLElement;
  private gameOverEl: HTMLElement;
  private shopEl: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;

    this.shipSelectEl = this.createScreen("al-ship-select");
    this.hudEl = this.buildHud();
    this.levelUpEl = this.createScreen("al-level-up");
    this.gameOverEl = this.createScreen("al-game-over");
    this.shopEl = this.createScreen("al-shop");

    const hudTop = this.hudEl.querySelector(".al-hud-top")!;
    this.hudHpFill = hudTop.querySelector(".al-hp") as HTMLElement;
    this.hudXpFill = hudTop.querySelector(".al-xp") as HTMLElement;
    this.hudWaveLabel = hudTop.querySelector(".al-hud-wave") as HTMLElement;
    this.hudLevelLabel = hudTop.querySelector(".al-hud-level") as HTMLElement;
    this.hudShieldLabel = hudTop.querySelector(".al-hud-shield") as HTMLElement;
    this.hudMotesLabel = this.hudEl.querySelector(".al-hud-motes") as HTMLElement;
    this.waveBannerEl = this.hudEl.querySelector(".al-wave-banner") as HTMLElement;

    this.hideAll();
  }

  private createScreen(id: string): HTMLElement {
    const el = document.createElement("div");
    el.id = id;
    el.className = "al-screen al-hidden";
    this.root.appendChild(el);
    return el;
  }

  private buildHud(): HTMLElement {
    const el = document.createElement("div");
    el.id = "al-hud";
    el.className = "al-hidden";
    el.innerHTML = `
      <div class="al-hud-top">
        <div class="al-bar-track"><div class="al-bar-fill al-hp" style="width:100%"></div></div>
        <div class="al-hud-row">
          <span class="al-hud-wave">Wave 1</span>
          <span class="al-hud-shield"></span>
          <span class="al-hud-level">Lv 1</span>
        </div>
        <div class="al-bar-track" style="height:8px"><div class="al-bar-fill al-xp" style="width:0%"></div></div>
      </div>
      <div class="al-hud-motes">✦ 0</div>
      <div class="al-wave-banner"></div>
    `;
    this.root.appendChild(el);
    return el;
  }

  hideAll(): void {
    for (const el of [this.shipSelectEl, this.hudEl, this.levelUpEl, this.gameOverEl, this.shopEl]) {
      el.classList.add("al-hidden");
    }
  }

  // ------------------------------------------------------------ ship select

  showShipSelect(ships: ShipDef[], defaultShipId: string, onSelect: (shipId: string) => void): void {
    this.shipSelectEl.innerHTML = "";
    this.shipSelectEl.classList.remove("al-hidden");

    const title = document.createElement("div");
    title.className = "al-title";
    title.textContent = "Afterlight Lite";
    const subtitle = document.createElement("div");
    subtitle.className = "al-subtitle";
    subtitle.textContent = "Choose your ship. Endless waves await beyond the light.";

    const grid = document.createElement("div");
    grid.className = "al-grid al-ship-grid";

    for (const ship of ships) {
      const card = document.createElement("button");
      card.className = "al-card";
      if (ship.id === defaultShipId) card.classList.add("al-selected");
      card.appendChild(iconCanvas(ship.shape, 48));
      const name = document.createElement("div");
      name.className = "al-card-name";
      name.textContent = ship.name;
      const tagline = document.createElement("div");
      tagline.className = "al-card-desc";
      tagline.textContent = ship.tagline;
      card.append(name, tagline);
      card.addEventListener("click", () => onSelect(ship.id));
      grid.appendChild(card);
    }

    this.shipSelectEl.append(title, subtitle, grid);
  }

  hideShipSelect(): void {
    this.shipSelectEl.classList.add("al-hidden");
  }

  // -------------------------------------------------------------------- hud

  showHud(): void {
    this.hudEl.classList.remove("al-hidden");
  }

  hideHud(): void {
    this.hudEl.classList.add("al-hidden");
  }

  updateHud(state: HudState): void {
    this.hudHpFill.style.width = `${Math.max(0, (state.hp / state.maxHp) * 100)}%`;
    this.hudXpFill.style.width = `${Math.max(0, (state.xp / state.xpToNext) * 100)}%`;
    this.hudWaveLabel.textContent = `Wave ${state.wave}`;
    this.hudLevelLabel.textContent = `Lv ${state.level}`;
    this.hudShieldLabel.textContent = state.shieldMax > 0 ? `Shield ${state.shieldCharges}/${state.shieldMax}` : "";
    this.hudMotesLabel.textContent = `✦ ${Math.floor(state.motes)}`;
  }

  showWaveBanner(text: string): void {
    this.waveBannerEl.textContent = text;
    this.waveBannerEl.classList.add("al-show");
    if (this.waveBannerTimeout) window.clearTimeout(this.waveBannerTimeout);
    this.waveBannerTimeout = window.setTimeout(() => this.waveBannerEl.classList.remove("al-show"), 2200);
  }

  // ---------------------------------------------------------------- level up

  showLevelUp(choices: { def: UpgradeDef; stackAfter: number }[], onPick: (id: string) => void): void {
    this.levelUpEl.innerHTML = "";
    this.levelUpEl.classList.remove("al-hidden");

    const title = document.createElement("div");
    title.className = "al-title";
    title.textContent = "Level Up";
    const subtitle = document.createElement("div");
    subtitle.className = "al-subtitle";
    subtitle.textContent = "Choose an upgrade. 5 picks of the same upgrade evolves it.";

    const grid = document.createElement("div");
    grid.className = "al-grid";

    for (const { def, stackAfter } of choices) {
      const card = document.createElement("button");
      card.className = "al-card";
      card.appendChild(iconCanvas(def.icon, 44));
      const name = document.createElement("div");
      name.className = "al-card-name";
      name.textContent = stackAfter >= 5 ? def.superName : def.name;
      const desc = document.createElement("div");
      desc.className = "al-card-desc";
      desc.textContent = stackAfter >= 5 ? def.superDescription : def.description;
      const tag = document.createElement("div");
      tag.className = "al-card-tag";
      tag.textContent = stackAfter >= 5 ? "★ Super Evolution" : `${def.category} · stack ${stackAfter}/5`;
      card.append(name, desc, tag);
      card.addEventListener("click", () => onPick(def.id));
      grid.appendChild(card);
    }

    this.levelUpEl.append(title, subtitle, grid);
  }

  hideLevelUp(): void {
    this.levelUpEl.classList.add("al-hidden");
  }

  // --------------------------------------------------------------- game over

  showGameOver(stats: GameOverStats, onContinue: () => void): void {
    this.gameOverEl.innerHTML = "";
    this.gameOverEl.classList.remove("al-hidden");

    const title = document.createElement("div");
    title.className = "al-title";
    title.textContent = "Run Ended";
    const subtitle = document.createElement("div");
    subtitle.className = "al-subtitle";
    subtitle.innerHTML = `Reached <b>Wave ${stats.wave}</b> at <b>Level ${stats.level}</b><br/>Collected ${stats.motesCollected} light motes — <span style="color:#ffe08a">${stats.motesRetained} retained</span> for the workshop.`;

    const btn = document.createElement("button");
    btn.className = "al-btn";
    btn.textContent = "Continue to Ship Workshop";
    btn.addEventListener("click", onContinue);

    this.gameOverEl.append(title, subtitle, btn);
  }

  hideGameOver(): void {
    this.gameOverEl.classList.add("al-hidden");
  }

  // -------------------------------------------------------------------- shop

  showShop(save: SaveData, onPurchase: (slot: AttachmentSlot) => void, onStart: () => void): void {
    this.shopEl.innerHTML = "";
    this.shopEl.classList.remove("al-hidden");

    const title = document.createElement("div");
    title.className = "al-title";
    title.textContent = "Ship Workshop";
    const subtitle = document.createElement("div");
    subtitle.className = "al-subtitle";
    subtitle.textContent = `✦ ${save.motes} light motes available. Upgrades carry into every future run.`;

    const list = document.createElement("div");
    list.className = "al-grid";
    list.style.maxWidth = "34rem";

    for (const attachment of ATTACHMENT_DEFS) {
      const owned = save.attachmentLevels[attachment.slot] ?? 0;
      const tier = nextTier(save, attachment.slot);
      const row = document.createElement("div");
      row.className = "al-shop-slot";

      const info = document.createElement("div");
      info.className = "al-shop-slot-info";
      const name = document.createElement("div");
      name.className = "al-shop-slot-name";
      name.textContent = attachment.name;
      const desc = document.createElement("div");
      desc.className = "al-shop-slot-desc";
      desc.textContent = tier ? tier.description : "Fully upgraded";
      const level = document.createElement("div");
      level.className = "al-shop-slot-level";
      level.textContent = `Level ${owned}/${attachment.tiers.length}`;
      info.append(name, desc, level);

      const btn = document.createElement("button");
      btn.className = "al-btn al-secondary";
      if (!tier) {
        btn.textContent = "Maxed";
        btn.disabled = true;
      } else {
        btn.textContent = `✦ ${tier.cost}`;
        btn.disabled = save.motes < tier.cost;
        btn.addEventListener("click", () => onPurchase(attachment.slot));
      }

      row.append(info, btn);
      list.appendChild(row);
    }

    const startBtn = document.createElement("button");
    startBtn.className = "al-btn";
    startBtn.textContent = "Launch Next Run";
    startBtn.addEventListener("click", onStart);

    this.shopEl.append(title, subtitle, list, startBtn);
  }

  hideShop(): void {
    this.shopEl.classList.add("al-hidden");
  }
}
