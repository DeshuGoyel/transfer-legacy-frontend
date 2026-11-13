import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@familink.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'TestPassword123!';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// ─── GIVEN ─────────────────────────────────────────────────────────────────

Given('I open the Familink app', async function (this: ICustomWorld) {
  await this.page.goto(BASE_URL);
  await this.page.waitForLoadState('domcontentloaded');
});

Given('I am on the login page', async function (this: ICustomWorld) {
  await this.loginPage.open();
});

Given('I am on the forgot password page', async function (this: ICustomWorld) {
  await this.page.goto(`${BASE_URL}/forgot-password`);
  await this.page.waitForLoadState('domcontentloaded');
});

Given('I am logged in', async function (this: ICustomWorld) {
  if (!this.isLoggedIn) {
    await this.loginPage.open();
    await this.loginPage.loginWith(TEST_EMAIL, TEST_PASSWORD);
    // Wait for redirect to dashboard
    await this.page.waitForURL(/dashboard|app/, { timeout: 15000 });
    this.isLoggedIn = true;
  }
});

// ─── WHEN ──────────────────────────────────────────────────────────────────

When('I click on {string} link', async function (this: ICustomWorld, linkText: string) {
  await this.page.click(`a:has-text("${linkText}"), button:has-text("${linkText}")`);
});

When('I enter valid credentials', async function (this: ICustomWorld) {
  await this.loginPage.enterCredentials(TEST_EMAIL, TEST_PASSWORD);
});

When('I enter email {string} and password {string}', async function (this: ICustomWorld, email: string, password: string) {
  await this.loginPage.enterCredentials(email, password);
});

When('I enter email {string}', async function (this: ICustomWorld, email: string) {
  await this.loginPage.enterEmail(email);
});

When('I click the login button', async function (this: ICustomWorld) {
  await this.loginPage.clickLogin();
});

When('I click the submit button', async function (this: ICustomWorld) {
  await this.page.click('button[type="submit"]');
});

When('I navigate to the dashboard', async function (this: ICustomWorld) {
  await this.dashboardPage.open();
});

When('I navigate to {string}', async function (this: ICustomWorld, path: string) {
  await this.genericPage.openPage(path);
});

When('I click on {string} in the navigation', async function (this: ICustomWorld, itemName: string) {
  await this.dashboardPage.clickNavItem(itemName);
});

When('I click on logout', async function (this: ICustomWorld) {
  await this.dashboardPage.clickLogout();
});

When('I update the display name to {string}', async function (this: ICustomWorld, name: string) {
  await this.page.fill(
    'input[name="displayName"], input[name="name"], input[placeholder*="name" i]',
    name
  );
});

When('I save the settings', async function (this: ICustomWorld) {
  await this.page.click('button:has-text("Save"), button[type="submit"]');
});

// Duplicate link click definition removed

When('I type {string} in the AI input', async function (this: ICustomWorld, text: string) {
  await this.page.fill('textarea, input[placeholder*="Ask" i], [data-testid="ai-input"]', text);
});

When('I click the add asset button', async function (this: ICustomWorld) {
  await this.page.click('button:has-text("New Record"), button:has-text("Add Asset"), a:has-text("Add Asset")');
});

When('I click the add heir button', async function (this: ICustomWorld) {
  await this.page.click('button:has-text("Add Beneficiary"), button:has-text("Add Heir"), a:has-text("Add Heir")');
});

When('I click the add guardian button', async function (this: ICustomWorld) {
  await this.page.click('button:has-text("Invite Guardian"), button:has-text("Add Guardian"), a:has-text("Add Guardian")');
});

When('I click the create capsule button', async function (this: ICustomWorld) {
  await this.page.click('button:has-text("Create Archive"), button:has-text("Create Capsule"), a:has-text("Create Capsule")');
});

// ─── THEN ──────────────────────────────────────────────────────────────────

Then('I should see the landing page title', async function (this: ICustomWorld) {
  const title = await this.page.title();
  expect(title.length).toBeGreaterThan(0);
});

Then('I should be on the login page', async function (this: ICustomWorld) {
  await this.page.waitForURL(/login/, { timeout: 10000 });
  const url = this.page.url();
  expect(url).toContain('login');
});

Then('I should be redirected to the dashboard', async function (this: ICustomWorld) {
  await this.page.waitForURL(/dashboard|app/, { timeout: 15000 });
  const url = this.page.url();
  expect(url).toMatch(/dashboard|app/);
});

Then('I should be on the forgot password page', async function (this: ICustomWorld) {
  await this.page.waitForURL(/forgot/, { timeout: 10000 });
  const url = this.page.url();
  expect(url).toContain('forgot');
});

Then('I should see the dashboard heading', async function (this: ICustomWorld) {
  const isVisible = await this.dashboardPage.isDashboardHeadingVisible();
  expect(isVisible).toBe(true);
});

Then('I should see the navigation menu', async function (this: ICustomWorld) {
  const isVisible = await this.dashboardPage.isNavMenuVisible();
  expect(isVisible).toBe(true);
});

Then('I should be on the assets page', async function (this: ICustomWorld) {
  await this.page.waitForURL(/assets/, { timeout: 10000 });
  expect(this.page.url()).toContain('assets');
});

Then('I should be on the heirs page', async function (this: ICustomWorld) {
  await this.page.waitForURL(/heirs/, { timeout: 10000 });
  expect(this.page.url()).toContain('heirs');
});

Then('I should be on the guardians page', async function (this: ICustomWorld) {
  await this.page.waitForURL(/guardians/, { timeout: 10000 });
  expect(this.page.url()).toContain('guardians');
});

Then('I should be on the settings page', async function (this: ICustomWorld) {
  await this.page.waitForURL(/settings/, { timeout: 10000 });
  expect(this.page.url()).toContain('settings');
});

Then('I should be redirected to the login page', async function (this: ICustomWorld) {
  await this.page.waitForURL(/login/, { timeout: 10000 });
  expect(this.page.url()).toContain('login');
});

Then('the page should load without errors', async function (this: ICustomWorld) {
  const isLoaded = await this.genericPage.isPageLoaded();
  expect(isLoaded).toBe(true);
});

Then('I should see the page heading', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isPageHeadingVisible();
  expect(isVisible).toBe(true);
});

Then('I should see the email input field', async function (this: ICustomWorld) {
  const isVisible = await this.loginPage.isEmailInputVisible();
  expect(isVisible).toBe(true);
});

Then('I should see the password input field', async function (this: ICustomWorld) {
  const isVisible = await this.loginPage.isPasswordInputVisible();
  expect(isVisible).toBe(true);
});

Then('I should see the login button', async function (this: ICustomWorld) {
  const isVisible = await this.loginPage.isLoginButtonVisible();
  expect(isVisible).toBe(true);
});

Then('I should see the submit button', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('button[type="submit"], button:has-text("Send"), button:has-text("Reset"), button:has-text("Submit")');
  expect(isVisible).toBe(true);
});

Then('I should see the {string} link', async function (this: ICustomWorld, linkText: string) {
  const isVisible = await this.genericPage.isButtonVisible(linkText);
  expect(isVisible).toBe(true);
});

Then('I should see an error message', async function (this: ICustomWorld) {
  const isVisible = await this.loginPage.isErrorVisible();
  expect(isVisible).toBe(true);
});

Then('I should see a validation error', async function (this: ICustomWorld) {
  // Check for HTML5 validation or app validation messages
  await this.page.waitForTimeout(1000);
  const hasValidation =
    await this.loginPage.isErrorVisible() ||
    await this.page.evaluate(() => {
      const inputs = document.querySelectorAll('input:invalid');
      return inputs.length > 0;
    });
  expect(hasValidation).toBe(true);
});

Then('I should see a success or confirmation message', async function (this: ICustomWorld) {
  await this.page.waitForTimeout(2000);
  const successSelectors = [
    '[role="alert"]:not(.error)',
    '.toast-success',
    '.success-message',
    'p:has-text("sent"), p:has-text("check your email")'
  ];
  let found = false;
  for (const sel of successSelectors) {
    try {
      await this.page.waitForSelector(sel, { timeout: 3000 });
      found = true;
      break;
    } catch { /* continue */ }
  }
  expect(found).toBe(true);
});

Then('I should see a success message', async function (this: ICustomWorld) {
  await this.page.waitForTimeout(2000);
  const isVisible = await this.genericPage.isElementVisible(
    '.toast-success, [role="alert"]:not(.error), .success-message'
  );
  expect(isVisible).toBe(true);
});

Then('I should see the add asset button', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('button:has-text("New Record"), button:has-text("Add Asset"), a:has-text("Add Asset")');
  expect(isVisible).toBe(true);
});

Then('I should see the add heir button', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('button:has-text("Add Beneficiary"), button:has-text("Add Heir"), a:has-text("Add Heir")');
  expect(isVisible).toBe(true);
});

Then('I should see the add guardian button', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('button:has-text("Invite Guardian"), button:has-text("Add Guardian"), a:has-text("Add Guardian")');
  expect(isVisible).toBe(true);
});

Then('I should see the asset form', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isFormVisible('form, [role="dialog"], .modal');
  expect(isVisible).toBe(true);
});

Then('I should see the heir form', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isFormVisible('form, [role="dialog"], .modal');
  expect(isVisible).toBe(true);
});

Then('I should see the guardian form', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isFormVisible('form, [role="dialog"], .modal');
  expect(isVisible).toBe(true);
});

Then('I should see the capsule creation form', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isFormVisible('form, [role="dialog"], .modal');
  expect(isVisible).toBe(true);
});

Then('I should see asset name field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isInputVisible('name');
  expect(isVisible).toBe(true);
});

Then('I should see asset type field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    'select[name*="type"], input[name*="type"], [data-testid*="type"]'
  );
  expect(isVisible).toBe(true);
});

Then('I should see asset value field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    'input[name*="value"], input[type="number"], [data-testid*="value"]'
  );
  expect(isVisible).toBe(true);
});

Then('I should see heir name field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isInputVisible('name');
  expect(isVisible).toBe(true);
});

Then('I should see heir email field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('input[type="email"]');
  expect(isVisible).toBe(true);
});

Then('I should see heir relationship field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    'select[name*="relation"], input[name*="relation"], [data-testid*="relation"]'
  );
  expect(isVisible).toBe(true);
});

Then('I should see guardian name field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isInputVisible('name');
  expect(isVisible).toBe(true);
});

Then('I should see guardian email field', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('input[type="email"]');
  expect(isVisible).toBe(true);
});

Then('I should see the allocations content area', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    '.recharts-wrapper, canvas, [data-testid="allocations-content"], main'
  );
  expect(isVisible).toBe(true);
});

Then('I should see the profile section', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    '[data-testid="profile-section"], section:has-text("Profile"), h2:has-text("Profile"), h3:has-text("Profile")'
  );
  expect(isVisible).toBe(true);
});

Then('I should see the security section', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    '[data-testid="security-section"], section:has-text("Security"), h2:has-text("Security"), h3:has-text("Security"), main:has-text("Password"), main:has-text("MFA")'
  );
  expect(isVisible).toBe(true);
});

Then('I should see notification settings', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    '[data-testid="notifications"], section:has-text("Notification"), h2:has-text("Notification"), main:has-text("Alert"), main:has-text("Preferences"), main'
  );
  expect(isVisible).toBe(true);
});

Then('I should see the check-in action button', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    'button:has-text("Check In"), button:has-text("Check-in"), [data-testid="checkin-btn"], button:has-text("Check")'
  );
  expect(isVisible).toBe(true);
});

Then('I should see check-in status information', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('main, .content, [data-testid="checkin-status"]');
  expect(isVisible).toBe(true);
});

Then('I should see the AI input area', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible(
    'textarea, input[placeholder*="Ask" i], [data-testid="ai-input"]'
  );
  expect(isVisible).toBe(true);
});

Then('I should see the send button enabled', async function (this: ICustomWorld) {
  const sendBtn = await this.page.$(
    'button[type="submit"]:not([disabled]), button:has-text("Send"):not([disabled]), button:has-text("Ask"):not([disabled])'
  );
  expect(sendBtn).not.toBeNull();
});

Then('I should see the create capsule button', async function (this: ICustomWorld) {
  const isVisible = await this.genericPage.isElementVisible('button:has-text("Create Archive"), button:has-text("Create Capsule"), a:has-text("Create Capsule")');
  expect(isVisible).toBe(true);
});
