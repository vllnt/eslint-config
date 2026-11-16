import { expect, test } from "@playwright/test";

const user_id = "1";

test("uses the id", async ({ page }) => {
  await page.goto(`/users/${user_id}`);
  expect(await page.title()).toContain("vllnt");
});
