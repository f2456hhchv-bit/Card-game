import { defineConfig } from "vite";

// base "./" keeps asset URLs relative so the same build works on GitHub Pages
// (served from a sub-path) and as a local file preview.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    target: "es2022",
    sourcemap: true,
  },
});
