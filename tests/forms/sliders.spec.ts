import {test, expect} from "@playwright/test";
import { blockUnwantedRedirects } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto('https://playwrightlab.github.io/index.html', {
    waitUntil: 'domcontentloaded',
  });
});


test('TC-010 - Drag volume slider', async ({page}) => {
    let sliderSection = page.locator('div[data-testid="slider-card"]')

    let volumeSlider = sliderSection.locator('#volumeSlider')
    let volumeSLiderResult = sliderSection.locator('#volumeGroup label')

    await volumeSlider.fill('50')
    await expect(volumeSLiderResult).toContainText('50')

    await volumeSlider.fill('0')
    await expect(volumeSLiderResult).toContainText('0')

    await volumeSlider.fill('100')
    await expect(volumeSLiderResult).toContainText('100')
})

test('TC-011 - Price range slider)', async ({page}) => {
    let sliderSection = page.locator('div[data-testid="slider-card"]')

    let priceSlider = sliderSection.locator('#priceRange')
    let priceSLiderResult = sliderSection.locator('#priceGroup label')

    await priceSlider.fill('250')
    await expect(priceSLiderResult).toContainText('250')

    await priceSlider.fill('750')
    await expect(priceSLiderResult).toContainText('750')

    await priceSlider.fill('0')
    await expect(priceSLiderResult).toContainText('0')

    await priceSlider.fill('1000')
    await expect(priceSLiderResult).toContainText('1000')


})