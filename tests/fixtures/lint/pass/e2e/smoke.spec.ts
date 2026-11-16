import { expect, test } from "@playwright/test";

for (const path of ["/", "/about"]) {
  test(`${path} has a title`, async ({ page }) => {
    await page.goto(path);
    expect(await page.title()).toContain("vllnt");
  });
}
