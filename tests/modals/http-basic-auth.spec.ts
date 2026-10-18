import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects, parsePrice } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});




test('TC-033 - Access basic auth protected page', async({page, context}) => {
    
    await context.setHTTPCredentials({
        username: 'admin',
        password: 'password123'
    });

    const popupPromise = page.waitForEvent('popup');

    await page.locator('#basicAuthBtn').click();

    const popup = await popupPromise;

    await expect(popup).toHaveURL(/httpbin\.org\/basic-auth\/admin\/password123/);
    await expect(popup.locator('body')).toContainText('"authenticated": true');

})