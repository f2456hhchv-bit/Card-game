import { Game } from "./game/Game";

function bootGame(): void {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement | null;
  const uiRoot = document.getElementById("ui-root") as HTMLElement | null;
  const bootScreen = document.getElementById("boot");

  if (!canvas || !uiRoot) {
    throw new Error("Afterlight Lite: required DOM nodes missing.");
  }

  const game = new Game(canvas, uiRoot);
  game.start();

  if (location.hash.includes("dev")) {
    (window as unknown as { __AL_DEBUG__: () => Record<string, unknown> }).__AL_DEBUG__ = () =>
      game.debugSnapshot();
  }

  bootScreen?.classList.add("hidden");
  window.setTimeout(() => bootScreen?.remove(), 500);
}

bootGame();
