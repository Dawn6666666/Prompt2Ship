import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4399",
    viewport: { width: 1440, height: 1000 },
    launchOptions: { channel: "chrome" },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 4399 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:4399",
    reuseExistingServer: false,
    stderr: "ignore",
  },
});
