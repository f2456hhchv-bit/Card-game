import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2019",
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    host: true,
    port: 5174,
  },
});
