const { expect } = require('@playwright/test');

class NotificationPage {
    constructor(page) {
        this.page = page;
        this.newsTab = page.getByText('News', { exact: true }).first();
        this.notificationsHeader = page.getByText('Notifications', { exact: true }).first();
        this.body = page.locator('body');
    }

    async openNews() {
        await this.newsTab.click();
        await expect(this.page.locator('#root')).toContainText('News');
    }

    async clickFirstGlobalNotification() {
        await this.page.getByRole('link').filter({ hasText: /Global|Salom/i }).first().click();
    }

    async verifyNotificationDetail() {
        const detailHeading = this.page.getByRole('heading').first();
        await expect(detailHeading).toBeVisible({ timeout: 15000 });
        await expect(this.body).toContainText(/Global|Salom|UDEVS|Sent|Barchaga/i, { timeout: 15000 });
    }
}

module.exports = { NotificationPage };
