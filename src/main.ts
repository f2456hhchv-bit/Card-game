import "./ui/fonts.css";
import "./ui/ui.css";
import { Game } from "./game/Game";

/**
 * Resolve the top safe-area inset (camera cutout / status bar) into the
 * `--safe-top` CSS variable that the menu overlays pad against.
 *
 * We measure `env(safe-area-inset-top)` via a probe element rather than trusting
 * CSS alone, because iOS home-screen web apps sometimes resolve `env()` to 0
 * (a long-standing standalone-mode quirk). When that happens on an iOS
 * standalone app we fall back to the device's known status-bar height by screen
 * class — Dynamic Island phones need ~59px, notched phones ~47px, older ~20px.
 */
function applySafeTop(): void {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;left:0;width:0;height:0;visibility:hidden;" +
    "top:env(safe-area-inset-top,0px)";
  document.documentElement.appendChild(probe);
  let top = probe.offsetTop;
  probe.remove();

  const standalone =
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  if (top === 0 && standalone) {
    // env() came back empty in fullscreen app mode — use the device class.
    const h = Math.max(screen.height, screen.width);
    top = h >= 852 ? 59 : h >= 812 ? 47 : 20;
  }
  document.documentElement.style.setProperty("--safe-top", `${top}px`);
}

/**
 * Entry point. Boots the game, hides the splash, and surfaces any fatal error
 * to the player rather than failing silently to a black screen.
 */
function boot(): void {
  applySafeTop();
  window.addEventListener("resize", applySafeTop);
  window.addEventListener("orientationchange", applySafeTop);
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
