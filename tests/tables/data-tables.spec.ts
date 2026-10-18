import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});

test("TC-015 - Sort users by name", async ({ page }) => {
  let table = page.locator("#dataTable");
  await page.locator('th[data-testid="sort-name"]').click();
  let rows = await table.locator("tbody tr").all();
  let nameColumn = [];
  for (const row of rows) {
    nameColumn.push(await row.locator("td").nth(2).innerText());
  }
  let namesAZ = [...nameColumn].sort((a, b) => a.localeCompare(b));
  expect(nameColumn).toEqual(namesAZ);

  await page.locator('th[data-testid="sort-name"]').click();
  rows = await table.locator("tbody tr").all();
  nameColumn = [];
  for (const row of rows) {
    nameColumn.push(await row.locator("td").nth(2).innerText());
  }
  namesAZ = [...nameColumn].sort((a, b) => b.localeCompare(a));
  expect(nameColumn).toEqual(namesAZ);
});

test("TC-016 - Filter users by role", async ({ page }) => {
  let table = page.locator("#dataTable");
  await page
    .locator('select[data-testid="table-filter"]')
    .selectOption("Admin");
  let resultsInfo = await page.locator("#tableInfo").innerText();
  let expectedResultsNumber = Number(
    resultsInfo.match(/(\d+)\s+entries$/)?.[1],
  );
  let rows = await table.locator("tbody tr").all();
  for (const row of rows) {
    await expect(row.locator("td").nth(4)).toContainText("admin");
  }
  expect(await table.locator("tbody tr").count()).toEqual(
    expectedResultsNumber,
  );

  await page
    .locator('select[data-testid="table-filter"]')
    .selectOption("Editor");
  resultsInfo = await page.locator("#tableInfo").innerText();
  expectedResultsNumber = Number(resultsInfo.match(/(\d+)\s+entries$/)?.[1]);
  rows = await table.locator("tbody tr").all();
  for (const row of rows) {
    await expect(row.locator("td").nth(4)).toContainText("editor");
  }
  expect(await table.locator("tbody tr").count()).toEqual(
    expectedResultsNumber,
  );

  await page
    .locator('select[data-testid="table-filter"]')
    .selectOption("Viewer");
  resultsInfo = await page.locator("#tableInfo").innerText();
  expectedResultsNumber = Number(resultsInfo.match(/(\d+)\s+entries$/)?.[1]);
  rows = await table.locator("tbody tr").all();
  for (const row of rows) {
    await expect(row.locator("td").nth(4)).toContainText("viewer");
  }
  expect(await table.locator("tbody tr").count()).toEqual(
    expectedResultsNumber,
  );
});

test("TC-017 - Page size and pagination navigation", async ({ page }) => {
  let table = page.locator("#dataTable");

  await page.locator('select[data-testid="rows-per-page"]').selectOption("5");
  expect(await table.locator("tbody tr").count()).toEqual(5);
  let firstPageResults: string[] = [];
  let results = await table.locator("tbody tr").all();
  for (let result of results) {
    firstPageResults.push(await result.innerText());
  }

  await page.locator('button[data-testid="page-2"]').click();
  expect(await table.locator("tbody tr").count()).toEqual(5);
  let secondPageResults: string[] = [];
  results = await table.locator("tbody tr").all();
  for (let result of results) {
    secondPageResults.push(await result.innerText());
  }

  await page.locator('button[data-testid="page-3"]').click();
  expect(await table.locator("tbody tr").count()).toEqual(5);
  let thirdPageResults: string[] = [];
  results = await table.locator("tbody tr").all();
  for (let result of results) {
    thirdPageResults.push(await result.innerText());
  }

  let sharedElements = firstPageResults.filter((element) =>
    secondPageResults.includes(element),
  );
  expect(sharedElements).toHaveLength(0);

  sharedElements = firstPageResults.filter((element) =>
    thirdPageResults.includes(element),
  );
  expect(sharedElements).toHaveLength(0);

  sharedElements = secondPageResults.filter((element) =>
    thirdPageResults.includes(element),
  );
  expect(sharedElements).toHaveLength(0);

  let numberOfResults =
    firstPageResults.length +
    secondPageResults.length +
    thirdPageResults.length;
  let resultsInfo = await page.locator("#tableInfo").innerText();
  let expectedResultsNumber = Number(
    resultsInfo.match(/(\d+)\s+entries$/)?.[1],
  );
  expect(numberOfResults).toEqual(expectedResultsNumber);

  await page.locator('select[data-testid="rows-per-page"]').selectOption("10");
  expect(await table.locator("tbody tr").count()).toEqual(10);
  firstPageResults = [];
  results = await table.locator("tbody tr").all();
  for (let result of results) {
    firstPageResults.push(await result.innerText());
  }

  await page.locator('button[data-testid="page-2"]').click();
  expect(await table.locator("tbody tr").count()).toEqual(5);
  secondPageResults = [];
  results = await table.locator("tbody tr").all();
  for (let result of results) {
    secondPageResults.push(await result.innerText());
  }
  sharedElements = firstPageResults.filter((element) =>
    secondPageResults.includes(element),
  );
  expect(sharedElements).toHaveLength(0);

  numberOfResults = firstPageResults.length + secondPageResults.length;
  resultsInfo = await page.locator("#tableInfo").innerText();
  expectedResultsNumber = Number(resultsInfo.match(/(\d+)\s+entries$/)?.[1]);
  expect(numberOfResults).toEqual(expectedResultsNumber);

  await page.locator('select[data-testid="rows-per-page"]').selectOption("15");
  expect(await table.locator("tbody tr").count()).toEqual(15);
});

test("TC-018 - Edited value recalculates total price", async ({ page }) => {
  let table = page.locator('table[data-testid="editable-table"]');

  let price = Number(
    (await table.locator("#grandTotal").innerText())
      .replace("$", "")
      .replace(",", ""),
  );

  let macbookPrice = Number(
    await table.locator('td[data-testid="edit-price-1"]').innerText(),
  );
  let macbookQuantity = Number(
    await table.locator('td[data-testid="edit-qty-1"]').innerText(),
  );
  let macbookTotalPrice = Number(
    (await table.locator('td[data-testid="edit-total-1"]').innerText())
      .replace("$", "")
      .replace(",", ""),
  );
  expect(macbookTotalPrice).toEqual(macbookPrice * macbookQuantity);

  let iphonePrice = Number(
    await table.locator('td[data-testid="edit-price-2"]').innerText(),
  );
  let iphoneQuantity = Number(
    await table.locator('td[data-testid="edit-qty-2"]').innerText(),
  );
  let iphoneTotalPrice = Number(
    (await table.locator('td[data-testid="edit-total-2"]').innerText())
      .replace("$", "")
      .replace(",", ""),
  );
  expect(iphoneTotalPrice).toEqual(iphonePrice * iphoneQuantity);

  let airpodsPrice = Number(
    await table.locator('td[data-testid="edit-price-3"]').innerText(),
  );
  let airpodsQuantity = Number(
    await table.locator('td[data-testid="edit-qty-3"]').innerText(),
  );
  let airpodsTotalPrice = Number(
    (await table.locator('td[data-testid="edit-total-3"]').innerText())
      .replace("$", "")
      .replace(",", ""),
  );
  expect(airpodsTotalPrice).toEqual(airpodsPrice * airpodsQuantity);

  expect(price).toEqual(
    macbookTotalPrice + iphoneTotalPrice + airpodsTotalPrice,
  );

  await table.locator('td[data-testid="edit-price-1"]').fill("1900");
  await table.locator('td[data-testid="edit-qty-1"]').fill("3");

  await table.locator('td[data-testid="edit-price-2"]').fill("999");
  await table.locator('td[data-testid="edit-qty-2"]').fill("3");

  await table.locator('td[data-testid="edit-price-3"]').fill("699");
  await table.locator('td[data-testid="edit-qty-3"]').fill("1");

  macbookPrice = Number(
    await table.locator('td[data-testid="edit-price-1"]').innerText(),
  );
  macbookQuantity = Number(
    await table.locator('td[data-testid="edit-qty-1"]').innerText(),
  );
  macbookTotalPrice = Number(
    (await table.locator('td[data-testid="edit-total-1"]').innerText())
      .replace("$", "")
      .replace(",", ""),
  );

  iphonePrice = Number(
    await table.locator('td[data-testid="edit-price-2"]').innerText(),
  );
  iphoneQuantity = Number(
    await table.locator('td[data-testid="edit-qty-2"]').innerText(),
  );
  iphoneTotalPrice = Number(
    (await table.locator('td[data-testid="edit-total-2"]').innerText())
      .replace("$", "")
      .replace(",", ""),
  );

  airpodsPrice = Number(
    await table.locator('td[data-testid="edit-price-3"]').innerText(),
  );
  airpodsQuantity = Number(
    await table.locator('td[data-testid="edit-qty-3"]').innerText(),
  );
  airpodsTotalPrice = Number(
    (await table.locator('td[data-testid="edit-total-3"]').innerText())
      .replace("$", "")
      .replace(",", ""),
  );

  price = Number(
    (await table.locator("#grandTotal").innerText())
      .replace("$", "")
      .replace(",", ""),
  );

  expect(macbookTotalPrice).toEqual(macbookPrice * macbookQuantity);
  expect(iphoneTotalPrice).toEqual(iphonePrice * iphoneQuantity);
  expect(airpodsTotalPrice).toEqual(airpodsPrice * airpodsQuantity);
  expect(price).toEqual(
    macbookTotalPrice + iphoneTotalPrice + airpodsTotalPrice,
  );
});
