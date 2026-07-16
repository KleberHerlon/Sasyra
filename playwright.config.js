import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: "http://localhost:5173/Sasyra",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 10000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone SE"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173/Sasyra/",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
