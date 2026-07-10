import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve(__dirname),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    root: resolve(__dirname),
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
  },
});
