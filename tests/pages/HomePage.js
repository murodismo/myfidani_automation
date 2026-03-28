const { expect } = require('@playwright/test');

class HomePage {
    constructor(page) {
        this.page = page;
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
        this.notificationIcon = page.locator('//button[.//img[contains(@src, "notification") or contains(@src, "Notification") or contains(@src, "bell") or contains(@src, "Bell")]]').first();
        this.bagLink = page.getByRole('link', { name: 'Bag' });
        this.meatIcons = page.locator('img[alt="meat"]');
        this.categories = page.locator('div:has(img[alt="meat"])');
        this.page15Button = page.getByRole('button', { name: '15' });
        this.anyPageSizeButton = page.getByRole('button', { name: /^\d+$/ }).first();
    }

    async clickNotificationIcon() {
        // More robust implementation from previous experiments
        const bellByImg = this.page.locator('img[src*="notification"], img[src*="Notification"], img[src*="bell"], img[src*="Bell"]').first();
        const bellButton = this.page.locator('button').filter({ has: bellByImg }).first();
        
        if (await bellButton.isVisible().catch(() => false)) {
            await bellButton.click();
        } else {
            // fallback
            await this.notificationIcon.waitFor({ state: 'visible', timeout: 10000 });
            await this.notificationIcon.click();
        }
    }

    async setPageSize(size = '15') {
        const btn = this.page.getByRole('button', { name: size });
        if (await btn.isVisible().catch(() => false)) {
            await btn.click();
        } else if (await this.anyPageSizeButton.isVisible().catch(() => false)) {
            await this.anyPageSizeButton.click();
        }
    }

    async selectCategoryByText(text) {
        await this.page.getByText(text, { exact: true }).first().click();
    }

    async getFirstMeatCard() {
        // Using the robust button-parent locator found earlier
        const addButton = this.page.getByRole('button', { name: 'Add' }).filter({ hasText: 'Add' }).first();
        const card = addButton.locator('xpath=..').filter({ hasText: /UZS\/kg/i });
        return { card, addButton };
    }

    async getProductName(card) {
        return await card.locator('p').first().innerText();
    }

    async openBag() {
        await this.bagLink.click();
        await expect(this.page).toHaveURL(/.*bag.*/i, { timeout: 15000 });
    }
}

module.exports = { HomePage };
