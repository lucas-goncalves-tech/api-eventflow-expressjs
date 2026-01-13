import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

export default defineConfig({
  test: {
    environment: "node",
    env: dotenv.config({ path: ".env.test" }).parsed,
    globals: true,
    include: ["**/*.{test,spec}.ts"],
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
