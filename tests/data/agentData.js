/**
 * Тест-данные для роли "Агент"
 * Содержит: учётные данные, фильтры, поисковые запросы, тексты UI
 */
export const AgentData = {

  // ─── Авторизация ────────────────────────────────────────
  credentials: {
    phone: '340982933',
    password: 'AutomationAgent#1',
    language: 'Русский',
  },

  // ─── Viewport (мобильное разрешение) ────────────────────
  viewport: {
    width: 390,
    height: 844,
  },

  // ─── URL приложения ─────────────────────────────────────
  url: {
    auth: 'https://my.chartakfidani.uz/auth',
  },

  // ─── Главная страница: текстовые паттерны ───────────────
  mainPage: {
    officeDebtLabel:    'Долг перед офисом:',
    limitLabel:         'Лимит:',
    clientDebtLabel:    'Долг клиентов:',
    currencyText:       'UZS',
    productNamePattern: /SLICE|NECK|FLANK|TONGUE|TENDERLOIN|TOPSIDE|CHEEK/i,
    pricePattern:       /UZS/i,
    addButtonLabel:     /Добавить/i,
    noResultsText:      'Ничего не найдено',
  },

  // ─── Фильтры товаров ───────────────────────────────────
  filters: ['Все', 'Говядина', 'Конина', 'Баранина', 'Птица'],

  // ─── Нижняя навигация ──────────────────────────────────
  navItems: ['Главная', 'Корзина', 'Заказы', 'Финансы', 'Профиль'],

  // ─── Поисковые запросы ──────────────────────────────────
  search: {
    validQuery:   '106 FQ ROLL',
    invalidQuery: 'Мясо кролика',
  },

  // ─── Уведомления ───────────────────────────────────────
  notifications: {
    pushTab:  'Push уведомления',
    newsTab:  'Новости',
    timePattern: /.*:[0-9]{2}/,   // Формат времени в новостях
  },
};
