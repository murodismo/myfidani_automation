import { expect } from '@playwright/test';

export class Page {
    constructor(page) {
        this.page = page;
        this.root = page.locator('#root');
        this.form = page.locator('form');
        this.phoneInput = page.locator('#phone');
        this.passwordInput = (lang) => {
            const tooltips = {
                'English': 'Enter password',
                'Русский': 'Введите пароль',
                'O\'zbek tili': 'Parolni kiriting',
                'Ўзбек тили': 'Паролни киритинг'
            };
            return this.page.getByRole('textbox', { name: tooltips[lang] });
        };
        this.submitButton = (lang) => {
            const labels = {
                'English': 'Sign in',
                'Русский': 'Войти',
                'O\'zbek tili': 'Kirish',
                'Ўзбек тили': 'Кириш'
            };
            return this.page.getByRole('button', { name: labels[lang] });
        };
        this.registerLink = (lang) => {
            const labels = {
                'English': 'Register',
                'Русский': 'Зарегистрироваться',
                'O\'zbek tili': 'Ro\'yxatdan o\'tish',
                'Ўзбек тили': 'Рўйхатдан ўтиш'
            };
            return this.page.getByRole('link', { name: labels[lang] });
        }
    }

    async goto() {
        await this.page.goto('https://my.chartakfidani.uz/auth');
    }

    async selectLanguage(lang) {
        await this.page.getByText(lang).first().click();
    }

    async login(phone, password, lang) {
        if (phone !== undefined) {
            await this.phoneInput.click();
            await this.phoneInput.fill(phone);
        }
        if (password !== undefined) {
            await this.passwordInput(lang).click();
            await this.passwordInput(lang).fill(password);
        }
        await this.submitButton(lang).first().click();
    }

    async expectLoginContent(lang, content) {
        for (const text of content) {
            await expect(this.root).toContainText(text);
        }
    }

    async expectErrorMessage(message) {
        // If it's an array, it's OR logic (any of them should be present)
        if (Array.isArray(message)) {
            await expect(async () => {
                const text = (await this.form.innerText()).replace(/\s+/g, ' ').trim();
                const found = message.some(m => {
                    if (m instanceof RegExp) return m.test(text);
                    return text.toLowerCase().includes(m.toLowerCase());
                });
                if (!found) throw new Error(`None of the expected messages [${message}] found in form text: ${text}`);
            }).toPass();
        } else if (typeof message === 'string') {
            await expect(this.form).toContainText(message);
        } else {
            await expect(this.page.getByText(message)).toBeVisible();
        }
    }
}
