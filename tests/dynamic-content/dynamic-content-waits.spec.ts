import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects, parsePrice } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});


test('TC-026 - Delayed content loads after correct delay', async ({page}) => {
    await page.locator('#delayTime').selectOption('5')
    await expect(page.locator('div[data-testid="delayed-content"]')).not.toContainText('Loading')
    await page.locator('#loadDelayedBtn').click()
    await expect(page.locator('div[data-testid="delayed-content"]')).toContainText('Loading')
    await page.waitForTimeout(2000)
    await expect(page.locator('div[data-testid="delayed-content"]')).toContainText('Loading')
    await page.waitForTimeout(2000)
    await expect(page.locator('div[data-testid="delayed-content"]')).toContainText('Loading')
    await page.waitForTimeout(1500)
    await expect(page.locator('div[data-testid="delayed-content"]')).not.toContainText('Loading')
})


test('TC-027 - Toggle element visibility (show/hide/remove/add)', async({page}) => {
    await page.locator("#showBtn").click()
    await expect(page.locator('#visibleElement')).toBeVisible()
    await page.locator("#hideBtn").click()
    await expect(page.locator('#visibleElement')).not.toBeVisible()
    await page.locator("#addElementBtn").click()
    await expect(page.locator('.dynamic-el')).toHaveCount(1)
    await page.locator("#removeElementBtn").click()
    await expect(page.locator('.dynamic-el')).toHaveCount(0)
})