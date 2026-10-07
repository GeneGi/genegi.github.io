import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.mjs",
  timeout: 120000,
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:4174", browserName: "chromium" },
  webServer: {
    command:
      "hugo server --bind 127.0.0.1 --port 4174 --disableLiveReload --source ../..",
    url: "http://127.0.0.1:4174/projects/pokemon-champions/",
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});
