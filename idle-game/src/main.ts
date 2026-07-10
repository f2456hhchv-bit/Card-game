import "./ui/ui.css";
import { Game } from "./game/Game";
import { Scene3D } from "./game/render/three/Scene3D";
import { UIManager } from "./ui/UIManager";

function boot(): void {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement | null;
  const uiMount = document.getElementById("ui-mount");
  const bootEl = document.getElementById("boot");
  if (!canvas || !uiMount) throw new Error("Missing #game-canvas or #ui-mount in index.html");

  const game = new Game();
  const scene = new Scene3D(canvas, game);
  const ui = new UIManager(uiMount, game);

  bootEl?.classList.add("hidden");
  setTimeout(() => bootEl?.remove(), 500);

  // Fixed-step-ish live loop: rAF gives us dt, clamped so a stalled/throttled
  // tab can't feed one giant single-frame jump into the sim (a real long
  // absence is instead routed through the offline catch-up path below).
  let lastFrame = performance.now();
  const MAX_LIVE_DT = 0.25;

  function frame(now: number): void {
    const dt = Math.min(MAX_LIVE_DT, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    game.tick(dt);
    scene.render(dt);
    ui.update();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame((t) => {
    lastFrame = t;
    requestAnimationFrame(frame);
  });

  // A backgrounded tab has rAF throttled/suspended by the browser — treat
  // regaining visibility as a potential "welcome back" moment, same as a
  // fresh page load after being closed.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      lastFrame = performance.now();
      game.catchUpFromAbsence();
    }
  });

  window.addEventListener("beforeunload", () => game.save());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") game.save();
  });

  if (import.meta.env.DEV || location.hash.includes("dev")) {
    (window as unknown as { vanguard: unknown }).vanguard = { game, scene, ui };
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
