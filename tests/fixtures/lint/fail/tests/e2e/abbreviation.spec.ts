import { expect, test } from "@playwright/test";

const params = "?q=1";

test("uses the query", async ({ page }) => {
  await page.goto(`/search${params}`);
  expect(await page.title()).toContain("vllnt");
});
