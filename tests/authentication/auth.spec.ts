import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects, parsePrice } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});

const email = process.env.LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD;

if (!email || !password) {
    throw new Error('Login credentials are missing. Check your .env file.');
}



test('TC-031 - Validate user-visible content', async({page}) => {

    let protectedArea = page.locator('div[data-testid="protected-card"]')
    await expect(protectedArea).toContainText('You must be logged in to view this content')

    await page.locator('#navLoginBtn').click()
    await page.locator('#loginEmail').fill(email)
    await page.locator('#loginPassword').fill(password)
    await page.locator('button[data-testid="login-submit"]').click()

    await expect(page.locator('#loginSuccess')).toBeVisible()
    await expect(page.locator('#loginSuccess')).toContainText('Welcome back!')

    await page.locator('#goToDashboard').click()

    await page.waitForLoadState()
    protectedArea = page.locator('div[data-testid="protected-card"]')
    await expect(protectedArea).toContainText(email)
    await expect(protectedArea).toContainText('Access Level: Premium')
})