import type { BrowserContext } from '@playwright/test';

const BLOCKED_AD_HOSTS = [
  'highrevenueformat.com',
  'aqml.org',
];

export async function blockUnwantedRedirects(context: BrowserContext) {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());

    const shouldBlock = BLOCKED_AD_HOSTS.some(host =>
      url.hostname === host ||
      url.hostname.endsWith(`.${host}`)
    );

    if (shouldBlock) {
      console.log('🚫 BLOCKED AD:', url.href);
      await route.abort();
      return;
    }

    await route.continue();
  });
}

export function parsePrice(priceText: string): number {
    return Number(priceText.replace(/[₹,\s]/g, ""));
}