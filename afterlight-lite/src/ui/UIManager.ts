import type { AttachmentSlot, PlaceholderShape, ShipDef, UpgradeDef } from "../game/types";
import { ATTACHMENT_DEFS } from "../game/data/attachmentDefs";
import { nextTier } from "../game/systems/ShopSystem";
import type { SaveData } from "../game/save/SaveManager";
import { drawEntitySprite, drawPlaceholderShape } from "../game/render/PlaceholderArt";

export interface AbilityBadge {
  id: string;
  icon: PlaceholderShape;
  stackCount: number;
  isSuper: boolean;
}

export interface MinimapBlip {
  dx: number;
  dy: number;
  kind: "grunt" | "elite" | "miniboss" | "boss";
}

export interface HudState {
  hp: number;
  maxHp: number;
  xp: number;
  xpToNext: number;
  level: number;
  wave: number;
  kills: number;
  motes: number;
  shieldCharges: number;
  shieldMax: number;
  shipArtId: string;
  shipShape: PlaceholderShape;
  abilities: AbilityBadge[];
  minimapBlips: MinimapBlip[];
}

const MINIMAP_RANGE = 900;
const MINIMAP_RADIUS_PX = 34;

const BLIP_STYLE: Record<MinimapBlip["kind"], { color: string; r: number }> = {
  grunt: { color: "#ff8a8a", r: 2 },
  elite: { color: "#ff9f3c", r: 2.6 },
  miniboss: { color: "#ff9f3c", r: 3.4 },
  boss: { color: "#ff4d4d", r: 4 },
};

export interface GameOverStats {
  wave: number;
  level: number;
  motesCollected: number;
  motesRetained: number;
}

function iconCanvas(shape: UpgradeDef["icon"], size = 40): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(size / 2, size / 2);
  drawPlaceholderShape(ctx, { ...shape, radius: size * 0.36 }, 1);
  return canvas;
}

/** Ship icons prefer real manifested art (same lookup the in-game renderer
 * uses) and fall back to the placeholder shape, so ship-select always
 * matches what the ship looks like in-run. */
function shipIconCanvas(ship: ShipDef, size = 48): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  drawEntitySprite(ctx, `ship.${ship.id}`, { ...ship.shape, radius: size * 0.4 }, size / 2, size / 2, 0);
  return canvas;
}

export class UIManager {
  private root: HTMLElement;
  private shipSelectEl: HTMLElement;
  private hudEl: HTMLElement;
  private hudHpFill: HTMLElement;
  private hudShieldRow: HTMLElement;
  private hudShieldFill: HTMLElement;
  private hudWaveLabel: HTMLElement;
  private hudKillsLabel: HTMLElement;
  private hudMotesLabel: HTMLElement;
  private hudAbilitiesEl: HTMLElement;
  private hudLevelNum: HTMLElement;
  private minimapCanvas: HTMLCanvasElement;
  private levelRingCanvas: HTMLCanvasElement;
  private pauseBtn: HTMLButtonElement;
  private waveBannerEl: HTMLElement;
  private waveBannerTimeout: number | undefined;
  private levelUpEl: HTMLElement;
  private gameOverEl: HTMLElement;
  private shopEl: HTMLElement;
  private pauseEl: HTMLElement;
  private lastAbilitySignature = "";

  constructor(root: HTMLElement) {
    this.root = root;

    this.shipSelectEl = this.createScreen("al-ship-select");
    this.hudEl = this.buildHud();
    this.levelUpEl = this.createScreen("al-level-up");
    this.gameOverEl = this.createScreen("al-game-over");
    this.shopEl = this.createScreen("al-shop");
    this.pauseEl = this.createScreen("al-pause");

    this.hudHpFill = this.hudEl.querySelector(".al-hp") as HTMLElement;
    this.hudShieldRow = this.hudEl.querySelector(".al-shield-row") as HTMLElement;
    this.hudShieldFill = this.hudEl.querySelector(".al-shield") as HTMLElement;
    this.hudWaveLabel = this.hudEl.querySelector(".al-hud-wave") as HTMLElement;
    this.hudKillsLabel = this.hudEl.querySelector(".al-kills-num") as HTMLElement;
    this.hudMotesLabel = this.hudEl.querySelector(".al-hud-motes") as HTMLElement;
    this.hudAbilitiesEl = this.hudEl.querySelector(".al-hud-abilities") as HTMLElement;
    this.hudLevelNum = this.hudEl.querySelector(".al-level-num") as HTMLElement;
    this.minimapCanvas = this.hudEl.querySelector(".al-minimap-canvas") as HTMLCanvasElement;
    this.levelRingCanvas = this.hudEl.querySelector(".al-level-ring-canvas") as HTMLCanvasElement;
    this.pauseBtn = this.hudEl.querySelector(".al-pause-btn") as HTMLButtonElement;
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
      <div class="al-hud-topleft">
        <div class="al-minimap-frame"><canvas class="al-minimap-canvas" width="76" height="76"></canvas></div>
        <div class="al-wave-panel al-glow-panel">
          <div class="al-hud-wave">Wave 1</div>
          <div class="al-hud-kills">☠ <span class="al-kills-num">0</span></div>
        </div>
      </div>
      <div class="al-hud-topright">
        <div class="al-resource-pill al-glow-panel"><span class="al-resource-icon">✦</span><span class="al-hud-motes">0</span></div>
        <button class="al-pause-btn" aria-label="Pause">⏸</button>
      </div>
      <div class="al-hud-stats">
        <div class="al-stat-row">
          <span class="al-stat-icon al-icon-hp">♥</span>
          <div class="al-bar-track"><div class="al-bar-fill al-hp" style="width:100%"></div></div>
        </div>
        <div class="al-stat-row al-shield-row al-stat-hidden">
          <span class="al-stat-icon al-icon-shield">⛨</span>
          <div class="al-bar-track"><div class="al-bar-fill al-shield" style="width:0%"></div></div>
        </div>
      </div>
      <div class="al-hud-abilities"></div>
      <div class="al-level-ring-wrap">
        <canvas class="al-level-ring-canvas" width="74" height="74"></canvas>
        <div class="al-level-num">Lv 1</div>
      </div>
      <div class="al-wave-banner"></div>
    `;
    this.root.appendChild(el);
    return el;
  }

  hideAll(): void {
    for (const el of [this.shipSelectEl, this.hudEl, this.levelUpEl, this.gameOverEl, this.shopEl, this.pauseEl]) {
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
      card.appendChild(shipIconCanvas(ship, 48));
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

showHud(onPause: () => void): void {
    this.hudEl.classList.remove("al-hidden");
    this.pauseBtn.onclick = onPause;
  }

  hideHud(): void {
    this.hudEl.classList.add("al-hidden");
  }

  updateHud(state: HudState): void {
    this.hudHpFill.style.width = `${Math.max(0, (state.hp / state.maxHp) * 100)}%`;
    this.hudWaveLabel.textContent = `Wave ${state.wave}`;
    this.hudKillsLabel.textContent = `${state.kills}`;
    this.hudMotesLabel.textContent = `${Math.floor(state.motes)}`;
    this.hudLevelNum.textContent = `Lv ${state.level}`;

    if (state.shieldMax > 0) {
      this.hudShieldRow.classList.remove("al-stat-hidden");
      this.hudShieldFill.style.width = `${Math.max(0, (state.shieldCharges / state.shieldMax) * 100)}%`;
    } else {
      this.hudShieldRow.classList.add("al-stat-hidden");
    }

    this.drawMinimap(state.minimapBlips);
    this.drawLevelRing(state.xp / state.xpToNext, state.shipArtId, state.shipShape);
    this.updateAbilities(state.abilities);
  }

  private drawMinimap(blips: MinimapBlip[]): void {
    const ctx = this.minimapCanvas.getContext("2d");
    if (!ctx) return;
    const cx = this.minimapCanvas.width / 2;
    const cy = this.minimapCanvas.height / 2;
    ctx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

    for (const blip of blips) {
      const px = cx + (blip.dx / MINIMAP_RANGE) * MINIMAP_RADIUS_PX;
      const py = cy + (blip.dy / MINIMAP_RANGE) * MINIMAP_RADIUS_PX;
      const clampedDist = Math.hypot(px - cx, py - cy);
      const finalX = clampedDist > MINIMAP_RADIUS_PX ? cx + ((px - cx) / clampedDist) * MINIMAP_RADIUS_PX : px;
      const finalY = clampedDist > MINIMAP_RADIUS_PX ? cy + ((py - cy) / clampedDist) * MINIMAP_RADIUS_PX : py;
      const style = BLIP_STYLE[blip.kind];
      ctx.fillStyle = style.color;
      ctx.shadowColor = style.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(finalX, finalY, style.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player marker, always centred.
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#8fe3ff";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.lineTo(cx - 4, cy + 4);
    ctx.closePath();
    ctx.fill();
  }

  private drawLevelRing(frac: number, shipArtId: string, shipShape: PlaceholderShape): void {
    const ctx = this.levelRingCanvas.getContext("2d");
    if (!ctx) return;
    const size = this.levelRingCanvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 5;
    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(111, 215, 255, 0.18)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#8fe3ff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.shadowColor = "#8fe3ff";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, frac)));
    ctx.stroke();
    ctx.shadowBlur = 0;

    drawEntitySprite(ctx, shipArtId, { ...shipShape, radius: size * 0.28 }, cx, cy, 0);
  }

  private updateAbilities(abilities: AbilityBadge[]): void {
    const signature = abilities.map((a) => `${a.id}:${a.stackCount}:${a.isSuper ? 1 : 0}`).join(",");
    if (signature === this.lastAbilitySignature) return;
    this.lastAbilitySignature = signature;

    this.hudAbilitiesEl.innerHTML = "";
    for (const ability of abilities) {
      const hex = document.createElement("div");
      hex.className = ability.isSuper ? "al-hex al-hex-super" : "al-hex";
      hex.appendChild(iconCanvas(ability.icon, 26));
      const pip = document.createElement("div");
      pip.className = "al-hex-pip";
      pip.textContent = ability.isSuper ? "★" : `${ability.stackCount}`;
      hex.appendChild(pip);
      this.hudAbilitiesEl.appendChild(hex);
    }
  }

  showWaveBanner(text: string): void {
    this.waveBannerEl.textContent = text;
    this.waveBannerEl.classList.add("al-show");
    if (this.waveBannerTimeout) window.clearTimeout(this.waveBannerTimeout);
    this.waveBannerTimeout = window.setTimeout(() => this.waveBannerEl.classList.remove("al-show"), 2200);
  }

  // ----------------------------------------------------------------- pause

  showPause(onResume: () => void, onQuit: () => void): void {
    this.pauseEl.innerHTML = "";
    this.pauseEl.classList.remove("al-hidden");

    const title = document.createElement("div");
    title.className = "al-title";
    title.textContent = "Paused";

    const resumeBtn = document.createElement("button");
    resumeBtn.className = "al-btn";
    resumeBtn.textContent = "Resume";
    resumeBtn.addEventListener("click", onResume);

    const quitBtn = document.createElement("button");
    quitBtn.className = "al-btn al-secondary";
    quitBtn.textContent = "Quit Run";
    quitBtn.addEventListener("click", onQuit);

    this.pauseEl.append(title, resumeBtn, quitBtn);
  }

  hidePause(): void {
    this.pauseEl.classList.add("al-hidden");
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
