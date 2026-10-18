import { test, expect } from "@playwright/test";
import { blockUnwantedRedirects, parsePrice } from "../../utils/helpers";

test.beforeEach(async ({ page, context }) => {
  await blockUnwantedRedirects(context);
  await page.goto("https://playwrightlab.github.io/index.html", {
    waitUntil: "domcontentloaded",
  });
});

test('TC-022 - Add product to cart and verify totals update', async ({page}) => {

    let cartItems = page.locator('#shopCartItems')
    await expect(cartItems).toContainText('Your cart is empty')

    let productCards = await page.locator('#shopProducts .shop-card').all()

    for(let card of productCards){
        let productName = await card.locator('.shop-card-title').innerText()
        let price = await card.locator('.shop-card-price').innerText()
        await card.locator('button', {hasText: 'Add to Cart'}).click()
        await expect(page.locator('#shopSubtotal')).toContainText(price)
        await expect(page.locator('#shopTotal')).toContainText(price)
        await expect(page.locator('.shop-cart-item-name')).toContainText(productName)
        await expect(page.locator('.shop-cart-item-name', {hasText: (productName)})).toHaveCount(1)
        await page.locator('.shop-cart-item-remove').click()
    }
})


test('TC-023 - Apply valid coupon, verify discount', async ({page}) => {

    let cartItems = page.locator('#shopCartItems')
    await expect(cartItems).toContainText('Your cart is empty')

    let productCards = await page.locator('#shopProducts .shop-card').all()

    for(let card of productCards){
        let itemPrice:number = parsePrice(await card.locator('.shop-card-price').innerText())
        await card.locator('button', {hasText: 'Add to Cart'}).click()

        expect(parsePrice(await page.locator('#shopSubtotal').innerText())).toEqual(itemPrice)
        expect(parsePrice(await page.locator('#shopTotal').innerText())).toEqual(itemPrice)

        await page.locator('#shopCouponInput').fill('FLAT10')
        await page.locator('#shopApplyCoupon').click()

        if(itemPrice>=50000){
        let discount = parsePrice(await page.locator('#shopDiscount').innerText())
        let totalPrice = parsePrice(await page.locator('#shopTotal').innerText())
        expect(discount).toEqual(-(itemPrice/10))
        expect(totalPrice).toEqual(itemPrice + discount)
        expect(totalPrice).toEqual(itemPrice*0.9)
        await expect(page.locator('#shopCouponMsg')).toContainText('Coupon "FLAT10" applied! 10% off')
        await expect(page.locator('#shopCouponMsg')).not.toContainText('Minimum order of ₹50,000 required')
        }

        if(itemPrice<50000){
        let totalPrice = parsePrice(await page.locator('#shopTotal').innerText())
        await expect(page.locator('#shopDiscount')).not.toBeVisible()
        await expect(page.locator('#shopCouponMsg')).not.toContainText('Coupon "FLAT10" applied! 10% off')
        await expect(page.locator('#shopCouponMsg')).toContainText('Minimum order of ₹50,000 required')
        expect(itemPrice).toEqual(totalPrice)
        }

        await page.locator('.shop-cart-item-remove').click()

    }

})


test('TC-024 - Apply an invalid code', async ({page}) => {
    await page.locator('button[data-testid="add-cart-lamborghini"]').click()
    let originalPrice = await page.locator('div[data-testid="product-lamborghini"]').locator('.shop-card-price').innerText()
    await page.locator('#shopCouponInput').fill('INVALIDCODE99')
    await page.locator('#shopApplyCoupon').click()
    let totalPrice = await page.locator('#shopTotal').innerText()
    await expect(page.locator('#shopCouponMsg')).toBeVisible()
    await expect(page.locator('#shopCouponMsg')).toContainText('Invalid coupon code')
    expect(parsePrice(originalPrice)).toEqual(parsePrice(totalPrice))
})


test('TC-025 - Complete cash checkout end to end', async ({page}) => {
    await page.locator('button[data-testid="add-cart-lamborghini"]').click()
    await page.locator('#shopCheckoutBtn').click()
    await expect(page.locator('div[data-testid="shop-checkout-modal"]')).toBeVisible()
    await page.locator('#shopFullName').fill('Tester Full Name')
    await page.locator('#shopAddress').fill('Test Address 123')
    await page.locator('#shopCity').fill('Test City')
    await page.locator('#shopPincode').fill('Test Pincode')
    await page.locator('#shopPhone').fill('+389 99 999 999')
    await page.locator('#shopToPayment').click()

    await page.locator('input[value="cod"]').click()
    await page.locator('#shopPlaceOrder').click()

    await expect(page.locator('div[data-testid="shop-checkout-modal"]')).toContainText('Order Placed Successfully!')

})