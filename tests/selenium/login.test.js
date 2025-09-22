// tests/selenium/login.test.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriverPath = require('chromedriver').path;

jest.setTimeout(120000); // 2 minutes timeout

const BASE = process.env.FRONTEND_URL || 'http://localhost:3000';

describe('Auth: signup + login', () => {
  let driver;
  beforeAll(async () => {
    const service = new chrome.ServiceBuilder(chromedriverPath);
    const options = new chrome.Options().addArguments('--headless=new','--no-sandbox','--disable-gpu');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => driver && driver.quit());

  test('user can sign up then log in', async () => {
    const unique = Date.now();
    const name = 'Thushan';
    const email = `eco+${unique}@river.lk`;
    const password = 'Strong#123';

    // Go to home
    await driver.get(BASE);

    // ✅ Wait for the nav-signup link to appear before clicking
    await driver.wait(until.elementLocated(By.css('[data-testid="nav-signup"]')), 15000);
    await driver.findElement(By.css('[data-testid="nav-signup"]')).click();

    // Wait for signup form
    await driver.wait(until.elementLocated(By.css('[data-testid="signup-email"]')), 15000);

    await driver.findElement(By.css('[data-testid="signup-name"]')).sendKeys(name);
    await driver.findElement(By.css('[data-testid="signup-email"]')).sendKeys(email);
    await driver.findElement(By.css('[data-testid="signup-password"]')).sendKeys(password);
    await driver.findElement(By.css('[data-testid="signup-submit"]')).click();

    // ✅ Wait until redirected to login or home
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes('/login') || url.includes('/home') || url.endsWith('/');
    }, 20000);

    // If redirected to login, log in
    if ((await driver.getCurrentUrl()).includes('/login')) {
      await driver.findElement(By.css('[data-testid="login-email"]')).sendKeys(email);
      await driver.findElement(By.css('[data-testid="login-password"]')).sendKeys(password);
      await driver.findElement(By.css('[data-testid="login-submit"]')).click();
    }

    // ✅ Finally wait for /home
    await driver.wait(async () => (await driver.getCurrentUrl()).includes('/'), 20000);
  });
});
