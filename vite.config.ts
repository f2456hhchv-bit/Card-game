import { defineConfig, type Plugin } from "vite";
import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { viteSingleFile } from "vite-plugin-singlefile";

// AFTERLIGHT builds two ways:
//  - default  (`npm run build`)        → static bundle in dist/ (served)
//  - single   (`npm run build:single`) → one self-contained, double-clickable
//                                         HTML file in dist-single/ for true
//                                         offline play with no server.
const single = process.env.AFTERLIGHT_SINGLE === "1";

// Unique id per build — baked into the bundle AND written to dist/version.json
// so the running app can detect that a newer deploy exists and self-update
// (GitHub Pages caches for ~10 minutes and iOS home-screen apps cache harder).
const buildId = `${Date.now()}`;

/** Emit dist/version.json alongside the bundle (served build only). */
function versionFile(): Plugin {
  return {
    name: "afterlight-version-file",
    closeBundle() {
      if (single) return;
      try {
        writeFileSync(resolve(__dirname, "dist/version.json"), JSON.stringify({ id: buildId }));
      } catch {
        // Non-fatal: the app treats a missing version.json as "no update".
      }
    },
  };
}

/**
 * The single-file build must run from a `file://` URL with no web server.
 * Browsers (notably Firefox and Safari) refuse to execute `<script type=
 * "module">` loaded over `file://` due to module CORS rules — which silently
 * leaves the page stuck on the boot splash. We therefore bundle the single
 * build as a classic IIFE and strip the `type="module"` attribute so the
 * inlined script runs everywhere when opened directly.
 */
function classicScriptForFileProtocol(): Plugin {
  return {
    name: "afterlight-classic-script",
    closeBundle() {
      const file = resolve(__dirname, "dist-single/index.html");
      try {
        let html = readFileSync(file, "utf8");
        html = html.replace(/<script type="module"/g, "<script");
        writeFileSync(file, html);
      } catch {
        // Only relevant to the single build; ignore if the file isn't present.
      }
    },
  };
}

export default defineConfig({
  base: "./",
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: single ? [viteSingleFile(), classicScriptForFileProtocol()] : [versionFile()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2019",
    outDir: single ? "dist-single" : "dist",
    // Sourcemaps can't live in a single inlined file; skip them there.
    sourcemap: !single,
    assetsInlineLimit: 0,
    // For the single build, emit one classic IIFE (no ESM syntax left) so the
    // `type="module"` attribute can be safely stripped for file:// use.
    rollupOptions: single
      ? { output: { format: "iife", inlineDynamicImports: true } }
      : {},
  },
  server: {
    host: true,
    port: 5173,
  },
});
