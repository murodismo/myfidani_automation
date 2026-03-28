const { expect } = require('@playwright/test');

class BagPage {
    constructor(page) {
        this.page = page;
        this.body = page.locator('body');
    }

    async verifyProductInBag(productName) {
        await expect(this.body).toContainText(productName, { timeout: 20000 });
    }
}

module.exports = { BagPage };
