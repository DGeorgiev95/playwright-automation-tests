// import { test } from '@playwright/test';

// import { blockUnwantedRedirects } from "../utils/helpers";



// test.beforeEach(async ({ page, context }) => {
//   await blockUnwantedRedirects(context);
//   await page.goto('https://playwrightlab.github.io/index.html', {
//     waitUntil: 'domcontentloaded',
//   });
// });

// test('find redirect culprit', async ({ page }) => {
//   page.on('request', request => {
//     const type = request.resourceType();

//     if (type !== 'script' && type !== 'document') {
//       return;
//     }

//     let frameUrl = 'unknown';

//     try {
//       frameUrl = request.frame().url();
//     } catch {
//     }

//     console.log(`
// TYPE:    ${type}
// URL:     ${request.url()}
// FRAME:   ${frameUrl}
// `);
//   });

//   await page.goto('https://playwrightlab.github.io/');

//   await page.waitForTimeout(10000);

//   console.log('\nFINAL URL:', page.url());
// });