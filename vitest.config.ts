import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup/vitest-setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    globals: false,
    restoreMocks: true,
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
