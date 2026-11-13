import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { GenericPage } from '../pages/GenericPage';

export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  genericPage: GenericPage;
  isLoggedIn: boolean;
  init(): Promise<void>;
  destroy(): Promise<void>;
}

export class CustomWorld extends World implements ICustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  dashboardPage!: DashboardPage;
  genericPage!: GenericPage;
  isLoggedIn: boolean = false;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
      channel: process.env.BROWSER === 'chrome' ? 'chrome' : undefined,
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: process.env.RECORD_VIDEO === 'true'
        ? { dir: 'e2e/reports/videos' }
        : undefined,
    });

    this.page = await this.context.newPage();

    // Initialize Page Objects
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.genericPage = new GenericPage(this.page);
  }

  async destroy() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
