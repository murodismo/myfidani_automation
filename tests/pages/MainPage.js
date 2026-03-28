import { expect } from '@playwright/test';

/**
 * Page Object Model — Главная страница агента (MainPage)
 *
 * Хранит все локаторы (CSS / Role / Text) и методы взаимодействия.
 * Тесты вызывают только методы этого класса, не обращаясь к локаторам напрямую.
 */
export class MainPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ─── Корневой контейнер ───────────────────────────────
    this.root = page.locator('#root');

    // ─── Header: поиск и уведомления ─────────────────────
    this.searchInput = page.getByRole('textbox', { name: /Поиск/i });
    this.headerIcon = page.getByRole('img').first();
    this.notificationBadge = page.getByRole('button', { name: /^[0-9]+$/ }).first();

    // ─── Товары ──────────────────────────────────────────
    this.firstProductName = (pattern) => page.getByText(pattern).first();
    this.firstPrice = (pattern) => page.getByText(pattern).first();
    this.firstAddButton = (label) => page.getByRole('button', { name: label }).first();

    // ─── Уведомления ─────────────────────────────────────
    this.backButton = page.getByRole('button').first();
  }

  // ═══════════════════════════════════════════════════════
  //  Навигация
  // ═══════════════════════════════════════════════════════

  /** Получить локатор фильтра по названию (скопирован в контейнер фильтров с иконками мяса) */
  filter(name) {
    // Фильтры находятся рядом с img[alt="meat"], ищем paragraph внутри контейнера фильтров
    return this.page.locator('p').filter({ hasText: new RegExp(`^${name}$`) }).first();
  }

  /** Получить локатор вкладки нижней навигации (это ссылки <a>) */
  navTab(name) {
    return this.page.getByRole('link', { name, exact: true });
  }

  /** Получить локатор вкладки уведомлений */
  notificationTab(name) {
    return this.page.getByText(name, { exact: true });
  }

  // ═══════════════════════════════════════════════════════
  //  Действия (Actions)
  // ═══════════════════════════════════════════════════════

  /** Клик по фильтру товаров */
  async clickFilter(filterName) {
    await this.filter(filterName).click();
  }

  /** Ввод текста в поле поиска */
  async search(query) {
    await this.searchInput.click();
    await this.searchInput.fill(query);
  }

  /** Очистка поля поиска и сброс фокуса */
  async clearSearch() {
    // Во время поиска приложение переходит на /main/search,
    // где нижняя навигация скрыта. Возвращаемся назад.
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }

  /** Открыть панель уведомлений */
  async openNotifications() {
    await this.notificationBadge.click();
  }

  /** Переключить вкладку уведомлений */
  async switchNotificationTab(tabName) {
    await this.notificationTab(tabName).click();
  }

  /** Закрыть панель уведомлений (кнопка "Назад") */
  async closeNotifications() {
    await this.backButton.click();
  }

  // ═══════════════════════════════════════════════════════
  //  Проверки (Assertions)
  // ═══════════════════════════════════════════════════════

  /** Проверить видимость поля поиска и иконок в header */
  async expectHeaderVisible() {
    await expect(this.searchInput).toBeVisible();
    await expect(this.headerIcon).toBeVisible();
    await expect(this.notificationBadge).toBeVisible();
  }

  /**
   * Проверить карточку "Долг перед офисом" и "Лимит"
   * DOM: <p>Долг перед офисом:</p> <p>0</p> <p>UZS</p> — текст в разных элементах,
   * поэтому используем toContainText на корневом контейнере.
   */
  async expectOfficeDebtVisible(debtLabel, limitLabel, currency) {
    await expect(this.root).toContainText(debtLabel);
    await expect(this.root).toContainText(limitLabel);
    await expect(this.root).toContainText(currency);
  }

  /** Проверить карточку "Долг клиентов" */
  async expectClientDebtVisible(clientDebtLabel) {
    await expect(this.root).toContainText(clientDebtLabel);
  }

  /** Проверить наличие всех фильтров */
  async expectFiltersVisible(filterNames) {
    for (const name of filterNames) {
      await expect(this.filter(name)).toBeVisible();
    }
  }

  /** Проверить наличие карточки товара (название, цена, кнопка) */
  async expectProductCardVisible(namePattern, pricePattern, addButtonLabel) {
    await expect(this.firstProductName(namePattern)).toBeVisible();
    await expect(this.firstPrice(pricePattern)).toBeVisible();
    await expect(this.firstAddButton(addButtonLabel)).toBeVisible();
  }

  /** Проверить все вкладки нижней навигации */
  async expectNavBarVisible(navItems) {
    for (const item of navItems) {
      await expect(this.navTab(item)).toBeVisible();
    }
  }

  /** Проверить, что контент страницы содержит текст */
  async expectPageContainsText(text) {
    await expect(this.root).toContainText(text);
  }

  /** Проверить, что результаты поиска отображаются */
  async expectSearchResults(query) {
    await expect(this.root).toContainText(query);
  }

  /** Проверить сообщение "Ничего не найдено" */
  async expectNoResults(noResultsText) {
    await expect(this.page.getByText(noResultsText)).toBeVisible();
  }

  /** Проверить, что вкладка уведомлений видна */
  async expectNotificationTabVisible(tabName) {
    await expect(this.notificationTab(tabName)).toBeVisible();
  }

  /** Проверить наличие временной метки в новостях */
  async expectNewsTimestamp(timePattern) {
    await expect(this.page.getByText(timePattern).first()).toBeVisible();
  }

  /** Проверить возврат на главную страницу */
  async expectMainPageVisible() {
    await expect(this.page.getByText('Долг перед офисом', { exact: false }).first()).toBeVisible();
  }
}
