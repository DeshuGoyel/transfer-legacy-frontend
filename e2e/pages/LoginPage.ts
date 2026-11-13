import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Selectors
  private emailInput = 'input[type="email"], input[name="email"], #email';
  private passwordInput = 'input[type="password"], input[name="password"], #password';
  private loginButton = 'button[type="submit"], button:has-text("Login"), button:has-text("Sign In")';
  private forgotPasswordLink = 'a:has-text("Forgot"), a:has-text("forgot")';
  private errorMessage = '[role="alert"], .error-message, .toast-error, [data-testid="error"], .text-red-400, .bg-red-500\\/10, div:has-text("User not found"), div:has-text("invalid"), div:has-text("Failed"), div:has-text("Error")';

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async isEmailInputVisible(): Promise<boolean> {
    return this.isElementVisible(this.emailInput);
  }

  async isPasswordInputVisible(): Promise<boolean> {
    return this.isElementVisible(this.passwordInput);
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.isElementVisible(this.loginButton);
  }

  async isForgotPasswordVisible(): Promise<boolean> {
    return this.isElementVisible(this.forgotPasswordLink);
  }

  async enterEmail(email: string) {
    await this.fillInput(this.emailInput, email);
  }

  async enterPassword(password: string) {
    await this.fillInput(this.passwordInput, password);
  }

  async enterCredentials(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
  }

  async clickLogin() {
    await this.clickElement(this.loginButton);
  }

  async clickForgotPassword() {
    await this.clickElement(this.forgotPasswordLink);
  }

  async isErrorVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.errorMessage, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async loginWith(email: string, password: string) {
    await this.enterCredentials(email, password);
    await this.clickLogin();
  }
}
