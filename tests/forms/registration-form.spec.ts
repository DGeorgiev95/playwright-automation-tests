import {test, expect} from "@playwright/test";
import { blockUnwantedRedirects } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto('https://playwrightlab.github.io/index.html', {
    waitUntil: 'domcontentloaded',
  });
});




test('TC-001 - Valid registration in form', async({page}) => {
    let registrationForm = page.locator('#registrationForm')
    await registrationForm.locator('#fullName').fill('Auto Tester')
    await registrationForm.locator('#email').fill('example@test.com')
    await registrationForm.locator('#password').fill('Testpassword1!')
    await registrationForm.locator('#phone').fill('0038970111222!')
    await registrationForm.locator('#dob').fill('1990-05-25')
    await registrationForm.locator('#country').selectOption('Japan')
    await registrationForm.locator('#labelMale').check()
    await registrationForm.locator('#labelJs').check()
    await registrationForm.locator('#bio').fill('TestBio')
    await registrationForm.locator('#terms').check()
    await registrationForm.getByRole('button', {name: "Register"}).click()
    await expect(page.locator('#formSuccess')).toBeVisible()
})

test('TC-002 - Submit with empty fields', async ({page}) => {
    let registrationForm = page.locator('#registrationForm')
    await registrationForm.getByRole('button', {name: "Register"}).click()
    await expect(page.locator('span[data-testid="error-fullname"]')).toBeVisible()
    await expect(page.locator('span[data-testid="error-email"]')).toBeVisible()
    await expect(page.locator('span[data-testid="error-password"]')).toBeVisible()
    await expect(page.locator('span[data-testid="error-terms"]')).toBeVisible()
})

test('TC-003 - Invalid email format', async ({page}) => {
    let registrationForm = page.locator('#registrationForm')
    await registrationForm.locator('#fullName').fill('Auto Tester')
    await registrationForm.locator('#email').fill('example@invalid')
    await registrationForm.locator('#password').fill('Testpassword1!')
    await registrationForm.locator('#terms').check()
    await registrationForm.getByRole('button', {name: "Register"}).click()
    await expect(page.locator('span[data-testid="error-email"]')).toBeVisible()
})

test('TC-004 - Select country in registration form', async ({page}) => {
    page.locator('#country').selectOption('de')
    await expect(page.locator('#country')).toHaveValue('de')
})