import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { viteSingleFile } from "vite-plugin-singlefile";

// VANGUARD builds two ways, mirroring AFTERLIGHT's setup:
//  - default (`npm run build:idle`)        → static bundle in idle-game/dist/
//  - single  (`npm run build:idle:single`) → one self-contained, double-
//                                             clickable HTML file for true
//                                             offline play with no server.
const single = process.env.VANGUARD_SINGLE === "1";

const buildId = `${Date.now()}`;

/** file:// can't run type="module" scripts in every browser; strip it for the
 * single-file build so the inlined IIFE bundle runs everywhere. */
function classicScriptForFileProtocol() {
  return {
    name: "vanguard-classic-script",
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
  root: __dirname,
  base: "./",
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: single ? [viteSingleFile(), classicScriptForFileProtocol()] : [],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2019",
    outDir: single ? "dist-single" : "dist",
    sourcemap: !single,
    assetsInlineLimit: 0,
    rollupOptions: single
      ? { output: { format: "iife", inlineDynamicImports: true } }
      : {},
  },
  server: {
    host: true,
    port: 5174,
  },
});
