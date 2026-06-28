import { defineConfig } from "vite";
import { resolve } from "node:path";

// AFTERLIGHT builds to a fully static, offline-capable bundle.
// `base: "./"` ensures the build runs from a file:// path or any subfolder.
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022",
    outDir: "dist",
    sourcemap: true,
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5173,
  },
});
