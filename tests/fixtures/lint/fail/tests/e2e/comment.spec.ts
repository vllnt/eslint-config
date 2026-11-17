import { expect, test } from "@playwright/test";

// The page only loads once.
test("loads", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toContain("vllnt");
});
