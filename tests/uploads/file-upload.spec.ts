import {test, expect} from "@playwright/test";
import { blockUnwantedRedirects } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto('https://playwrightlab.github.io/index.html', {
    waitUntil: 'domcontentloaded',
  });
});
test('TC-012 - Upload single file', async ({page}) => {

    let uploadSection = page.locator('div[data-testid="upload-card"]')

    await page.locator('#fileInput').setInputFiles('./tests/uploads/testimage1.jpg')
    await expect((uploadSection)).toContainText('testimage1')
    await expect((uploadSection)).not.toContainText('testimage2')

    await page.locator('#fileInput').setInputFiles('./tests/uploads/testimage2.jpg')
    await expect((uploadSection)).toContainText('testimage1')
    await expect((uploadSection)).toContainText('testimage2')

    await uploadSection.locator('div[data-testid="file-list"] button').first().click()
    await expect((uploadSection)).not.toContainText('testimage1')
    await expect((uploadSection)).toContainText('testimage2')

    await uploadSection.locator('div[data-testid="file-list"] button').first().click()
    await expect((uploadSection)).not.toContainText('testimage1')
    await expect((uploadSection)).not.toContainText('testimage2')
})

test('TC-013 - Multiple file upload', async ({page}) => {
    let uploadSection = page.locator('div[data-testid="upload-card"]')

    await page.locator('#fileInput').setInputFiles(['./tests/uploads/testimage1.jpg', './tests/uploads/testimage2.jpg'])
    await expect((uploadSection)).toContainText('testimage1')
    await expect((uploadSection)).toContainText('testimage2')

    await uploadSection.locator('div[data-testid="file-list"] button').first().click()
    await expect((uploadSection)).not.toContainText('testimage1')
    await expect((uploadSection)).toContainText('testimage2')

    await uploadSection.locator('div[data-testid="file-list"] button').first().click()
    await expect((uploadSection)).not.toContainText('testimage1')
    await expect((uploadSection)).not.toContainText('testimage2')
})