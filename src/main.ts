import "./ui/ui.css";
import { Game } from "./game/Game";

/**
 * Entry point. Boots the game, hides the splash, and surfaces any fatal error
 * to the player rather than failing silently to a black screen.
 */
function boot(): void {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement | null;
  const app = document.getElementById("app");
  const splash = document.getElementById("boot");
  if (!canvas || !app) {
    throw new Error("AFTERLIGHT: required DOM elements are missing.");
  }

  const game = new Game(canvas, app);
  game.start();

  // Optional debug console hook: open with `#dev` to expose `window.afterlight`.
  if (location.hash === "#dev") {
    (window as unknown as { afterlight: unknown }).afterlight = game.getDebugApi();
    // eslint-disable-next-line no-console
    console.info("AFTERLIGHT debug API ready: window.afterlight");
  }

  // Fade out the boot splash now that the first frame is up.
  requestAnimationFrame(() => {
    if (splash) {
      splash.classList.add("hidden");
      setTimeout(() => splash.remove(), 500);
    }
  });
}

function safeBoot(): void {
  try {
    boot();
  } catch (err) {
    console.error(err);
    const splash = document.getElementById("boot");
    if (splash) {
      splash.innerHTML =
        '<h1 style="font-size:1.4rem;letter-spacing:0.1em">Failed to start</h1>' +
        `<p style="max-width:80vw;text-align:center">${String(err)}</p>`;
    }
  }
}

// Wait for the DOM before booting. The single-file build runs as a classic
// (non-deferred) script for file:// compatibility, so it can execute before the
// document body is parsed — guard against that here rather than relying on
// script placement or `defer` (which inline scripts ignore).
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeBoot, { once: true });
} else {
  safeBoot();
}
