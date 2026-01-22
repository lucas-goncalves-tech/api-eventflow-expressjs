import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    fileParallelism: false, // Evita conflito de migrations entre arquivos
    include: ["**/*.{test,spec}.ts"],
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    env: {
      DATABASE_URL: "postgres://test:test@db_test:5432/eventflow_test",
    },
  },
});
