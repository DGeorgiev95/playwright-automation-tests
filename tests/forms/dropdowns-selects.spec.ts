import {test, expect} from "@playwright/test";
import { blockUnwantedRedirects } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto('https://playwrightlab.github.io/index.html', {
    waitUntil: 'domcontentloaded',
  });
});
test('TC-005 - Select Country From Dropdown', async ({page}) => {
    let customDropdown = page.locator('div[data-testid= "custom-dropdown-card"]')
    await customDropdown.click()
    await expect(page.locator('#customDropdownMenu')).toBeVisible()

    await page.locator("li[data-testid='custom-opt-low']").click()
    await expect(page.locator("li[data-testid='custom-opt-low']")).toHaveClass('selected')
    await expect(page.locator('#customDropdownResult')).toContainText('low')

    await customDropdown.click()
    await page.locator("li[data-testid='custom-opt-medium']").click()
    await expect(page.locator("li[data-testid='custom-opt-medium']")).toHaveClass('selected')
    await expect(page.locator('#customDropdownResult')).toContainText('medium')

    await customDropdown.click()
    await page.locator("li[data-testid='custom-opt-high']").click()
    await expect(page.locator("li[data-testid='custom-opt-high']")).toHaveClass('selected')
    await expect(page.locator('#customDropdownResult')).toContainText('high')

    await customDropdown.click()
    await page.locator("li[data-testid='custom-opt-critical']").click()
    await expect(page.locator("li[data-testid='custom-opt-critical']")).toHaveClass('selected')
    await expect(page.locator('#customDropdownResult')).toContainText('critical')
})

test('TC-006 - Select City Dropdown', async ({page}) => {
    page.locator('#searchableDropdownInput').fill('to')
    await expect(page.locator('li[data-testid="city-tokyo"]')).not.toHaveClass('hidden')
    await expect(page.locator('li[data-testid="city-toronto"]')).not.toHaveClass('hidden')
    await expect(page.locator('li[data-testid="city-berlin"]')).toHaveClass('hidden')

})

test('TC-007 - Cascading dropdown dependencies', async ({page}) => {
    let cascadingDropdownSection = page.locator('div[data-testid="cascading-dropdown-card"]')
    await expect(cascadingDropdownSection.locator("#cascadeCountry")).toBeDisabled()
    await expect(cascadingDropdownSection.locator("#cascadeCity")).toBeDisabled()

    await cascadingDropdownSection.locator('#cascadeContinent').selectOption('europe')
    await expect(cascadingDropdownSection.locator("#cascadeCountry")).not.toBeDisabled()
    await expect(cascadingDropdownSection.locator("#cascadeCity")).toBeDisabled()  

    await cascadingDropdownSection.locator('#cascadeCountry').selectOption('france')
    await expect(cascadingDropdownSection.locator("#cascadeCity")).not.toBeDisabled()

    await cascadingDropdownSection.locator("#cascadeCity").selectOption('Nice')
    await expect(cascadingDropdownSection.locator('#cascadeResult')).toContainText('Selected: Europe → France → Nice')


})

test('TC-008 - Multiple checkboxes selected', async ({page}) => {
    let multiCheckbox = page.locator('div[data-testid="checkbox-dropdown-card"]')
    await expect(multiCheckbox.locator('label[data-testid="topping-cheese"]')).not.toBeVisible()
    await multiCheckbox.click()
    await expect(multiCheckbox.locator('label[data-testid="topping-cheese"]')).toBeVisible()
    await multiCheckbox.locator('input[value="pepperoni"]').check()
    await multiCheckbox.locator('input[value="mushrooms"]').check()
    await multiCheckbox.locator('input[value="cheese"]').check()

    await expect(multiCheckbox.locator('input[value="pepperoni"]')).toBeChecked()
    await expect(multiCheckbox.locator('input[value="mushrooms"]')).toBeChecked()
    await expect(multiCheckbox.locator('input[value="cheese"]')).toBeChecked()

    await expect(multiCheckbox.locator('input[value="olives"]')).not.toBeChecked()
    await expect(multiCheckbox.locator('input[value="onions"]')).not.toBeChecked()
    await expect(multiCheckbox.locator('input[value="peppers"]')).not.toBeChecked()

    await expect(multiCheckbox.locator('#checkboxDropdownResult')).toContainText('Selected: cheese, pepperoni, mushrooms')
})

test('TC-009 - Disabled Plan options', async ({page}) => {
    let disabledPlanOptions = page.locator('div[data-testid="disabled-options-card"]')
    await expect(disabledPlanOptions.locator('#disabledOptSelect').locator('option[data-testid="plan-pro"]')).toBeDisabled()
    await expect(disabledPlanOptions.locator('#disabledOptSelect').locator('option[data-testid="plan-custom"]')).toBeDisabled()

    await disabledPlanOptions.locator("select").selectOption('Free')
    await expect(disabledPlanOptions.locator('#disabledOptResult')).toContainText('Free')

    await disabledPlanOptions.locator("select").selectOption('Starter — $9/mo')
    await expect(disabledPlanOptions.locator('#disabledOptResult')).toContainText('Starter — $9/mo')

    await disabledPlanOptions.locator("select").selectOption('Enterprise — $99/mo')
    await expect(disabledPlanOptions.locator('#disabledOptResult')).toContainText('Enterprise — $99/mo')
})