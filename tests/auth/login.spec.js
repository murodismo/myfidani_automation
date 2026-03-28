import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginData } from '../data/loginData';

test.describe('Authentication Tests - Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Full Positive Interaction (English)', async () => {
    const en = LoginData.English;
    await loginPage.selectLanguage(en.label);

    // Assert English display elements
    await loginPage.expectLoginContent(en.label, [
      en.signIn, en.forgotPassword, en.phoneLabel, en.passwordLabel
    ]);

    await loginPage.page.getByText(en.dontHaveAccount).click();
    await expect(loginPage.form).toContainText(en.dontHaveAccount);
    await expect(loginPage.form).toContainText(en.register);

    await loginPage.login('50 757 41 12_', 'MurodIsmoilov', en.label);
  });

  test('Login Negative Scenario (O\'zbek tili)', async () => {
    const uz = LoginData.UzbekLatin;
    await loginPage.selectLanguage(uz.label);

    // Case 1: User not found
    await loginPage.login('50 757 41 11', 'MurodIsmoilov#123', uz.label);
    await loginPage.expectErrorMessage(uz.errors.userNotFound);

    // Case 2: Weak password
    await loginPage.phoneInput.fill('50 757 41 12');
    await loginPage.passwordInput(uz.label).fill('asd');
    await loginPage.submitButton(uz.label).click();
    await loginPage.expectErrorMessage(uz.errors.weakPassword);

    // Case 3: Incorrect password
    await loginPage.passwordInput(uz.label).fill('MurodIsmoilov#12');
    await loginPage.submitButton(uz.label).click();
    await loginPage.expectErrorMessage(uz.errors.incorrectOrNotFound);

    // Case 4: Invalid phone number
    await loginPage.phoneInput.fill('50 757 41');
    await loginPage.submitButton(uz.label).click();
    // Validation usually happens on the UI as it's disabled or length check
  });

  test('Login Localization & Negative Flow (Uzbek Cyrillic)', async () => {
    const cy = LoginData.UzbekCyrillic;
    await loginPage.selectLanguage(cy.label);

    // Validation requirements
    await loginPage.login('50 757 41 11_', 'Murod', cy.label);
    await loginPage.expectErrorMessage(cy.errors.weakPassword);

    // Incorrect password or user not found for valid/invalid user data
    await loginPage.login('50 757 41 12_', 'MurodIsmoilov#12', cy.label);
    await loginPage.expectErrorMessage(cy.errors.incorrectOrNotFound);
  });

  test('Login Localization & Negative Flow (Russian)', async () => {
    const ru = LoginData.Russian;
    await loginPage.selectLanguage(ru.label);

    await loginPage.expectLoginContent(ru.label, [
      ru.signIn, ru.phoneLabel, ru.passwordLabel, ru.forgotPassword
    ]);

    await loginPage.login('50 757 41 1', 'ijasodk', ru.label);
    await loginPage.expectErrorMessage(ru.errors.weakPassword);

    await loginPage.login('50 757 41 10_', 'Murodismoiliv#12', ru.label);
    await loginPage.expectErrorMessage(ru.errors.incorrectOrNotFound);
  });

  test('Login Localization & Negative Flow (English - Error Cases)', async () => {
    const en = LoginData.English;
    await loginPage.selectLanguage(en.label);

    await loginPage.login('50 757 44 444', 'Murod!2k', en.label);
    await loginPage.expectErrorMessage(en.errors.incorrectOrNotFound);

    await loginPage.login('50 757 41 12_', 'asd', en.label);
    await loginPage.expectErrorMessage(en.errors.weakPassword);
  });

});
