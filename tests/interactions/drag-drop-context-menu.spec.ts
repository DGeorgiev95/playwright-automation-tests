import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});

test("TC-019 - Reorder list items via drag and drop", async ({ page }) => {

    let draggableList = page.locator('#dndList')
    let listItems = await draggableList.locator('li').all()
    let listArray = [];
    for (let item of listItems){
        listArray.push(await item.innerText())
    }
    await page.locator('li[data-testid="dnd-item-5"]').dragTo(page.locator('li[data-testid="dnd-item-1"]'))    
    listItems = await draggableList.locator('li').all()
    let editedListArray = []
    for (let item of listItems){
        editedListArray.push(await item.innerText())
    }
    await page.waitForLoadState()
    let expectedList = [...listArray]
    expectedList.pop()
    expectedList.unshift(" Deploy")

    expect(editedListArray).toEqual(expectedList)

});

test('TC-020 - Drag item to "remove" zone', async({page}) => {

    await page.locator('li[data-testid="dnd-item-4"]').dragTo(page.locator('#dropZoneText'))
    let listItems = page.locator('#dndList').locator('li')
    let listArray = await listItems.allInnerTexts()
    expect(listArray).not.toContain(' Run tests')
})
