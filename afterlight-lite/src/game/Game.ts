import { GameLoop } from "../engine/GameLoop";
import { Renderer } from "../engine/Renderer";
import { Camera } from "../engine/Camera";
import { Input } from "../engine/Input";
import { World, xpForLevel } from "./World";
import { renderWorld } from "./render/GameRenderer";
import { preloadImages } from "./render/ArtManifest";
import { UIManager } from "../ui/UIManager";
import { SHIP_DEFS } from "./data/shipDefs";
import { getUpgradeDef } from "./data/upgradeDefs";
import { rollUpgradeChoices } from "./systems/LevelSystem";
import { purchaseTier } from "./systems/ShopSystem";
import { loadSave, writeSave, type SaveData } from "./save/SaveManager";

type Screen = "shipSelect" | "playing" | "levelUp" | "gameOver" | "shop";

export class Game {
  private renderer: Renderer;
  private camera = new Camera();
  private input: Input;
  private loop: GameLoop;
  private ui: UIManager;
  private save: SaveData;
  private world: World | null = null;
  private screen: Screen = "shipSelect";

  constructor(canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    this.renderer = new Renderer(canvas);
    this.input = new Input(canvas);
    this.ui = new UIManager(uiRoot);
    this.save = loadSave();

    window.addEventListener("resize", () => this.renderer.resize());

    this.loop = new GameLoop({
      update: (dt) => this.update(dt),
      render: () => this.render(),
    });
  }

  /** Snapshot for the dev/test debug hook (see main.ts `#dev`). Not used by gameplay. */
  debugSnapshot(): Record<string, unknown> {
    return {
      screen: this.screen,
      wave: this.world?.spawn.wave ?? null,
      playerHp: this.world?.player.hp ?? null,
      playerMaxHp: this.world?.stats.maxHp ?? null,
      level: this.world?.player.level ?? null,
      xp: this.world?.player.xp ?? null,
      xpToNext: this.world?.player.xpToNext ?? null,
      enemyCount: this.world?.enemies.length ?? 0,
      pickupCount: this.world?.pickups.length ?? 0,
      motes: this.save.motes,
    };
  }

  start(): void {
    this.loop.start();
    this.goToShipSelect();
  }

  private update(dt: number): void {
    this.input.update();
    if (this.screen === "playing" && this.world) {
      this.world.update(dt, this.input.moveX, this.input.moveY);
    }
  }

  private render(): void {
    this.renderer.resize();
    this.camera.setViewport(this.renderer.width, this.renderer.height);

    if (this.world) {
      this.camera.snapTo(this.world.player.x, this.world.player.y);
      renderWorld(this.renderer, this.camera, this.world, this.input);
      if (this.screen === "playing" || this.screen === "levelUp") {
        this.ui.updateHud({
          hp: this.world.player.hp,
          maxHp: this.world.stats.maxHp,
          xp: this.world.player.xp,
          xpToNext: this.world.player.xpToNext,
          level: this.world.player.level,
          wave: this.world.spawn.wave,
          motes: this.save.motes,
          shieldCharges: this.world.player.shieldCharges,
          shieldMax: this.world.stats.shieldMax,
        });
      }
    } else {
      this.renderer.begin("#05060f");
    }
  }

  // ------------------------------------------------------------ ship select

  private goToShipSelect(): void {
    this.screen = "shipSelect";
    this.world = null;
    this.ui.hideAll();
    // Preload ship art first so the select screen never flashes the
    // placeholder shape just because an image request was still in flight.
    void preloadImages(SHIP_DEFS.map((s) => `ship.${s.id}`)).then(() => {
      if (this.screen !== "shipSelect") return;
      this.ui.showShipSelect(SHIP_DEFS, this.save.lastShipId, (shipId) => this.startRun(shipId));
    });
  }

  private startRun(shipId: string): void {
    this.save.lastShipId = shipId;
    writeSave(this.save);

    const world = new World(shipId, { ...this.save.attachmentLevels });
    this.world = world;

    world.events.on("levelUp", () => this.onLevelUp());
    world.events.on("waveStart", ({ label }) => this.ui.showWaveBanner(label));
    world.events.on("gameOver", (stats) => this.onGameOver(stats));

    this.ui.hideAll();
    this.ui.showHud();
    this.screen = "playing";
  }

  private onLevelUp(): void {
    if (!this.world) return;
    this.world.pendingLevelUp = true;
    this.screen = "levelUp";
    const choices = rollUpgradeChoices(this.world).map((def) => {
      const owned =
        def.category === "weapon"
          ? (this.world!.player.weapons.find((w) => w.upgradeId === def.id)?.stackCount ?? 0)
          : (this.world!.player.passiveStacks[def.id] ?? 0);
      return { def, stackAfter: Math.min(5, owned + 1) };
    });
    this.ui.showLevelUp(choices, (id) => this.pickUpgrade(id));
  }

  private pickUpgrade(id: string): void {
    if (!this.world) return;
    this.world.pickUpgrade(id);
    this.world.pendingLevelUp = false;
    this.ui.hideLevelUp();
    this.screen = "playing";
  }

  private onGameOver(stats: { wave: number; level: number; motesCollected: number; motesRetained: number }): void {
    this.save.motes += stats.motesRetained;
    this.save.bestWave = Math.max(this.save.bestWave, stats.wave);
    writeSave(this.save);

    this.screen = "gameOver";
    this.ui.hideHud();
    this.ui.showGameOver(stats, () => this.goToShop());
  }

  private goToShop(): void {
    this.screen = "shop";
    this.world = null;
    this.ui.hideAll();
    this.renderShop();
  }

  private renderShop(): void {
    this.ui.showShop(
      this.save,
      (slot) => {
        if (purchaseTier(this.save, slot)) writeSave(this.save);
        this.renderShop();
      },
      () => this.goToShipSelect(),
    );
  }
}

// Re-exported so upgrade-related UI/debug code has a single import path.
export { getUpgradeDef, xpForLevel };
