// tests/selenium/addTask.test.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriverPath = require('chromedriver').path;

jest.setTimeout(120000);

const BASE = process.env.FRONTEND_URL || 'http://localhost:3000';

async function login(driver, email, password) {
  await driver.get(BASE);
  await driver.wait(until.elementLocated(By.css('[data-testid="nav-login"]')), 15000);
  await driver.findElement(By.css('[data-testid="nav-login"]')).click();

  await driver.wait(until.elementLocated(By.css('[data-testid="login-email"]')), 15000);
  await driver.findElement(By.css('[data-testid="login-email"]')).sendKeys(email);
  await driver.findElement(By.css('[data-testid="login-password"]')).sendKeys(password);
  await driver.findElement(By.css('[data-testid="login-submit"]')).click();

  await driver.wait(async () => (await driver.getCurrentUrl()).includes('/'), 20000);
}

describe('Tasks: add and display', () => {
  let driver;
  const email = `eco+${Date.now()}@river.lk`;
  const password = 'Strong#123';
  const name = 'Thushan';

  beforeAll(async () => {
    const service = new chrome.ServiceBuilder(chromedriverPath);
    const options = new chrome.Options().addArguments('--headless=new','--no-sandbox','--disable-gpu');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

    // Sign up
    await driver.get(BASE);
    await driver.wait(until.elementLocated(By.css('[data-testid="nav-signup"]')), 15000);
    await driver.findElement(By.css('[data-testid="nav-signup"]')).click();

    await driver.wait(until.elementLocated(By.css('[data-testid="signup-email"]')), 15000);
    await driver.findElement(By.css('[data-testid="signup-name"]')).sendKeys(name);
    await driver.findElement(By.css('[data-testid="signup-email"]')).sendKeys(email);
    await driver.findElement(By.css('[data-testid="signup-password"]')).sendKeys(password);
    await driver.findElement(By.css('[data-testid="signup-submit"]')).click();
  });

  afterAll(async () => driver && driver.quit());

  test('add a task and see it in the list', async () => {
    await login(driver, email, password);

    await driver.wait(until.elementLocated(By.css('[data-testid="task-input"]')), 15000);
    const taskText = 'Buy rope for waterfall shoot';
    await driver.findElement(By.css('[data-testid="task-input"]')).sendKeys(taskText);
    await driver.findElement(By.css('[data-testid="add-task"]')).click();

    await driver.wait(until.elementLocated(By.css('[data-testid="task-item"]')), 15000);
    const items = await driver.findElements(By.css('[data-testid="task-item"]'));
    const texts = await Promise.all(items.map(el => el.getText()));
    expect(texts.some(t => t.includes(taskText))).toBe(true);
  });
});
