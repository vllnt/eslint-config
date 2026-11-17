import { expect, test } from "@playwright/test";

const viewports = [
  { height: 844, name: "phone", width: 390 },
  { height: 1194, name: "tablet", width: 834 },
  { height: 900, name: "desktop", width: 1440 },
];

const routes = {
  Browse: "/packages",
  release_notes: "/notes",
  Status: "/status",
};

for (const viewport of viewports) {
  test.describe(`${viewport.name} viewport`, () => {
    test("home page has a title", async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      expect(await page.title()).toContain("vllnt");
    });

    test("packages page has a title", async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/packages");
      expect(await page.title()).toContain("vllnt");
    });

    test("status page has a title", async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/status");
      expect(await page.title()).toContain("vllnt");
    });

    test("every route has a title", async ({ page }) => {
      await page.setViewportSize(viewport);
      for (const path of Object.values(routes)) {
        await page.goto(path);
        expect(await page.title()).toContain("vllnt");
      }
    });
  });
}
