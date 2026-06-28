import { defineConfig } from "vite";
import { resolve } from "node:path";
import { viteSingleFile } from "vite-plugin-singlefile";

// AFTERLIGHT builds two ways:
//  - default  (`npm run build`)        → static bundle in dist/ (served)
//  - single   (`npm run build:single`) → one self-contained, double-clickable
//                                         HTML file in dist-single/ for true
//                                         offline play with no server.
const single = process.env.AFTERLIGHT_SINGLE === "1";

export default defineConfig({
  base: "./",
  plugins: single ? [viteSingleFile()] : [],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022",
    outDir: single ? "dist-single" : "dist",
    // Sourcemaps can't live in a single inlined file; skip them there.
    sourcemap: !single,
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5173,
  },
});
