import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';
import { AgentData } from '../data/agentData';

test.describe.serial('Набор тестов для web-app Chartak Fidani (Роль: Агент)', () => {
    let page;
    let mainPage;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext({
            viewport: AgentData.viewport,
        });
        page = await context.newPage();
        mainPage = new MainPage(page);

        await test.step('Авторизоваться как Agent', async () => {
            const loginPage = new LoginPage(page);
            const { language, phone, password } = AgentData.credentials;

            await loginPage.goto();
            await loginPage.selectLanguage(language);
            await loginPage.login(phone, password, language);

            await expect(page.getByText('Главная', { exact: true })).toBeVisible({ timeout: 15000 });
        });
    });

    test.afterAll(async () => {
        await page.close();
    });

    // ═════════════════════════════════════════════════════
    //  СЦЕНАРИЙ 1: Начальное состояние главной страницы
    // ═════════════════════════════════════════════════════
    test('Сценарий 1: Проверка начального состояния главной страницы и наличия всех элементов', async () => {
        const mp = AgentData.mainPage;

        await test.step('Проверить верхнюю панель (поиск, уведомления)', async () => {
            await mainPage.expectHeaderVisible();
        });

        await test.step('Проверить секцию "Долг перед офисом" и "Лимит"', async () => {
            await mainPage.expectOfficeDebtVisible(mp.officeDebtLabel, mp.limitLabel, mp.currencyText);
        });

        await test.step('Проверить секцию "Долг клиентов"', async () => {
            await mainPage.expectClientDebtVisible(mp.clientDebtLabel);
        });

        await test.step('Проверить фильтры по типам товаров', async () => {
            await mainPage.expectFiltersVisible(AgentData.filters);
        });

        await test.step('Проверить карточку товара (название, цена, кнопка)', async () => {
            await mainPage.expectProductCardVisible(
                mp.productNamePattern,
                mp.pricePattern,
                mp.addButtonLabel
            );
        });

        await test.step('Проверить нижнюю навигационную панель', async () => {
            await mainPage.expectNavBarVisible(AgentData.navItems);
        });
    });

    // ═════════════════════════════════════════════════════
    //  СЦЕНАРИЙ 2: Фильтрация и поиск товаров
    // ═════════════════════════════════════════════════════
    test('Сценарий 2: Проверка фильтрации товаров по типам мяса и поиска по названию', async () => {
        const mp = AgentData.mainPage;

        await test.step('Фильтр "Говядина" — отображаются товары типа Говядина', async () => {
            await mainPage.clickFilter('Говядина');
            await mainPage.expectPageContainsText('Говядина');
        });

        await test.step('Фильтр "Баранина" — отображаются товары типа Баранина', async () => {
            await mainPage.clickFilter('Баранина');
            await mainPage.expectPageContainsText('Баранина');
        });

        await test.step('Фильтр "Все" — отображаются все товары', async () => {
            await mainPage.clickFilter('Все');
            await mainPage.expectPageContainsText('Говядина');
            await mainPage.expectPageContainsText('Баранина');
        });

        await test.step('Поиск "106 FQ ROLL" — товар найден', async () => {
            await mainPage.search(AgentData.search.validQuery);
            await mainPage.expectSearchResults(AgentData.search.validQuery);
        });

        await test.step('Поиск "Мясо кролика" — ничего не найдено', async () => {
            await mainPage.search(AgentData.search.invalidQuery);
            await mainPage.expectNoResults(mp.noResultsText);
        });

        await test.step('Очистить поиск — возврат к полному каталогу', async () => {
            await mainPage.clearSearch();
            await mainPage.expectMainPageVisible();
        });
    });

    // ═════════════════════════════════════════════════════
    //  СЦЕНАРИЙ 3: Уведомления
    // ═════════════════════════════════════════════════════
    test('Сценарий 3: Проверка открытия окна уведомлений, переключения между вкладками', async () => {
        const notif = AgentData.notifications;
        const mp = AgentData.mainPage;

        await test.step('Нажать на иконку уведомлений — откроется панель', async () => {
            await mainPage.openNotifications();
            await mainPage.expectNotificationTabVisible(notif.pushTab);
            await mainPage.expectNotificationTabVisible(notif.newsTab);
        });

        await test.step('Вкладка "Push уведомления" активна', async () => {
            await mainPage.expectNotificationTabVisible(notif.pushTab);
        });

        await test.step('Переключить на вкладку "Новости"', async () => {
            await mainPage.switchNotificationTab(notif.newsTab);
            await mainPage.expectNewsTimestamp(notif.timePattern);
        });

        await test.step('Вернуться на "Push уведомления" и закрыть панель', async () => {
            await mainPage.switchNotificationTab(notif.pushTab);
            await mainPage.closeNotifications();
            await mainPage.expectMainPageVisible();
        });
    });
});