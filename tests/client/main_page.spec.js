const { test, expect } = require('@playwright/test');

/**
 * My FiDaNi Automation - Professional Suite
 * Barcha mantiq bitta faylda, clean code qoidalariga amal qilingan.
 */

// --- Helper Functions ---

/**
 * Tizimga kirish (4 tilda ishlash mantiqi bilan)
 */
async function login(page, phone, password, lang = 'English') {
    await page.goto('https://my.chartakfidani.uz/auth');
    await page.getByText(lang, { exact: true }).click();
    
    await page.locator('#phone').fill(phone);
    
    const passwordTooltips = {
        'English': 'Enter password',
        'Русский': 'Введите пароль',
        'O\'zbek tili': 'Parolni kiriting',
        'Ўзбек тили': 'Паролни киритинг'
    };
    
    await page.getByRole('textbox', { name: passwordTooltips[lang] }).fill(password);
    
    const signInLabels = {
        'English': 'Sign in',
        'Русский': 'Войти',
        'O\'zbek tili': 'Kirish',
        'Ўзбек тиli': 'Кириш'
    };
    
    const signInBtn = page.getByRole('button', { name: signInLabels[lang] });
    await expect(signInBtn).toBeEnabled({ timeout: 10000 });
    await signInBtn.click();
    
    await page.waitForURL((url) => !url.toString().includes('/auth'), { timeout: 15000 });
}

/**
 * Xabarnomalar belgisini mustahkam usulda bosish
 */
async function clickNotificationIcon(page) {
    // Xabarnoma belgisini topish: rasm yoki bildirishnoma raqami (raqamli span) bor tugmani qidiramiz
    const bellButton = page.locator('button').filter({ 
        has: page.locator('img[src*="notification"], img[src*="Notification"], img[src*="bell"], img[src*="Bell"]') 
    }).first();
    
    if (await bellButton.isVisible().catch(() => false)) {
        await bellButton.click();
    } else {
        // Fallback: raqamli ko'rsatkichi bor (masalan, "40") bo'lgan birinchi tugmani bosamiz
        const badgeButton = page.locator('button').filter({ hasText: /^\d+$/ }).first();
        await badgeButton.click();
    }
}

// --- Test Suite ---

test.describe('My FiDaNi Client Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        // Har bir testdan oldin login qilish
        await login(page, '50 757 41 12', 'MurodIsmoilov#123', 'English');
        
        // Stabilizatsiya: Sahifa hajmini sozlash
        const sizeBtn = page.getByRole('button', { name: /^(15|\d+)$/ }).first();
        if (await sizeBtn.isVisible().catch(() => false)) {
            await sizeBtn.click();
        }
        
        await page.waitForLoadState('domcontentloaded');
    });

    test('Xabarnomalar mazmunini va tafsilotlarini tekshirish', async ({ page }) => {
        await clickNotificationIcon(page);
        
        const navTitle = page.getByText(/Notifications|Xabarnomalar/i).first();
        await expect(navTitle).toBeVisible({ timeout: 10000 });
        
        await page.getByText('News', { exact: true }).first().click();
        
        // Birinchi darajali xabarnomani ochish
        await page.getByRole('link').filter({ hasText: /Global|Salom/i }).first().click();
        
        // Tafsilotlarni tekshirish
        await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toContainText(/Global|Salom|UDEVS|Sent|Barchaga/i, { timeout: 15000 });
        
        // Orqaga qaytish
        await clickNotificationIcon(page);
        await clickNotificationIcon(page);
    });

    test('Mahsulotni savatchaga qo\'shish jarayonini tekshirish', async ({ page }) => {
        const addButton = page.getByRole('button', { name: 'Add' }).filter({ hasText: 'Add' }).first();
        const productCard = addButton.locator('xpath=..').filter({ hasText: /UZS\/kg/i });
        
        await expect(productCard).toBeVisible({ timeout: 15000 });
        const productName = await productCard.locator('p').first().innerText();
        
        await addButton.click();
        
        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible();
        
        const kgInput = modal.locator('input[type="number"]').first();
        if (await kgInput.isVisible().catch(() => false)) {
            await kgInput.fill('1');
        }
        
        const toBasketBtn = modal.getByRole('button', { name: 'To basket' });
        await expect(toBasketBtn).toBeEnabled();
        await toBasketBtn.click();
        
        await page.getByRole('link', { name: 'Bag' }).click();
        await expect(page).toHaveURL(/.*bag.*/i);
        await expect(page.locator('body')).toContainText(productName, { timeout: 15000 });
    });

    test('Qidiruv ochilishini va filtrlarini tekshirish', async ({ page }) => {
        const search = page.getByRole('textbox', { name: 'Search' });
        await search.waitFor({ state: 'visible' });
        
        // Readonly maydonni faollashtirish
        await search.click();
        const activeSearch = page.locator('input[placeholder="Search"]:not([readonly])');
        await activeSearch.fill('бел');
        
        await page.getByRole('button', { name: 'Add' }).first().click();
        await expect(page.getByRole('dialog')).toBeVisible();
    });
});
