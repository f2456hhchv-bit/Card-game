import { defineConfig } from "vite";
import { resolve } from "node:path";
import { viteSingleFile } from "vite-plugin-singlefile";

// A second build mode (`npm run build:single`) bundles everything into one
// self-contained HTML file for offline / no-server use (and for publishing
// as a standalone artifact).
const single = process.env.AFTERLIGHT_LITE_SINGLE === "1";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: single ? [viteSingleFile()] : [],
  build: {
    target: "es2019",
    outDir: single ? "dist-single" : "dist",
    sourcemap: !single,
    assetsInlineLimit: single ? Number.MAX_SAFE_INTEGER : 0,
  },
  server: {
    host: true,
    port: 5174,
  },
});
