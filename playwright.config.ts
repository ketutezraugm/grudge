import { defineConfig } from "@playwright/test";

const PORT = 3100;

/**
 * One happy-path test, run against a dev server with the worker off. Every API call in the test is
 * answered from a recorded fixture, so it never reads or writes the production database.
 * First run on a new machine: `pnpm exec playwright install chromium`.
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 120_000,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
    env: { GRUDGE_WORKER: "off" },
  },
});
