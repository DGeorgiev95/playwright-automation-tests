import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects, parsePrice } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});


test('TC-029 - Open and close modal dialog', async({page}) => {

    await page.locator('#openModalBtn').click()
    await expect(page.locator("#modal")).toBeVisible()
    await expect(page.locator("#modal")).toContainText('Sample Modal')
    await expect(page.locator("#modal")).toContainText('This is a sample modal dialog. You can test opening, closing, and interacting with modals.')
    await page.locator("textarea[data-testid='modal-textarea']").fill('Sample Modal Test Text')
    await page.locator('#modalConfirm').click()
    await expect(page.locator('#dialogResult')).toContainText('Sample Modal Test Text')    
    await expect(page.locator("#modal")).not.toBeVisible()
})


test('TC-030 - Open nested modal from parent modal', async ({page}) => {
    await expect(page.locator('#modal')).not.toBeVisible()
    await page.locator('#openNestedBtn').click()
    await expect(page.locator('#modal')).toBeVisible()
    await expect(page.locator('div[data-testid="nested-modal"]')).not.toBeVisible()
    await expect(page.locator('#modal')).toContainText('This is the parent modal')
    await expect(page.locator('#modal')).not.toContainText('This is a nested modal')
    await page.locator('#openNestedInner').click()
    await expect(page.locator('div[data-testid="nested-modal"]')).toBeVisible()
    await expect(page.locator('div[data-testid="nested-modal"]')).not.toContainText('This is the parent modal')
    await expect(page.locator('div[data-testid="nested-modal"]')).toContainText('This is a nested modal')
})


test('TC-031 - Handle native window.confirm() dialog', async ({page}) => {

    let dialogType = ''

    page.on('dialog', async dialog => {
        dialogType = dialog.type()
        await dialog.accept()
    })

    await page.locator('#nativeConfirm').click()

    expect(dialogType).toEqual('confirm')
})

