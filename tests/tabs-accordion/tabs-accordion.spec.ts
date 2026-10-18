import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects, parsePrice } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});



test('TC-034 - Switch tabs, verify disabled tab', async ({page}) => {
    let tabsCard = page.locator('div[data-testid="tabs-card"]')
    await tabsCard.getByRole('button', {name: 'Features'}).click()
    await expect(tabsCard.locator('.active h4')).toContainText('Features')
    await expect(tabsCard.locator('.active h4')).not.toContainText('Pricing')

    await tabsCard.getByRole('button', {name: 'Pricing'}).click()
    await expect(tabsCard.locator('.active h4')).toContainText('Pricing')
    await expect(tabsCard.locator('.active h4')).not.toContainText('Features')

    await tabsCard.getByRole('button', {name: 'Disabled'}).click({force: true})
    await expect(tabsCard.locator('.active h4')).toContainText('Pricing')
    await expect(tabsCard.locator('.active h4')).not.toContainText('Features')
})