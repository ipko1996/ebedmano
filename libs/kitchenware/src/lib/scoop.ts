/**
 * Selenium helper functions
 */

import { Builder, Browser, WebDriver, until, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import 'dotenv/config';

export async function createWebDriver() {
  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .usingServer(process.env.SELENIUM_HUB_URL ?? 'http://localhost:4444/wd/hub')
    .setChromeOptions(
      new Options()
        // .headless()
        .addArguments
        // '--disable-dev-shm-usage',
        // '--no-sandbox'
        // '--disable-gpu',
        // '--headless'
        ()
    )
    .build();
  return driver;
}

export async function getElement(
  driver: WebDriver,
  path: string,
  by = By.xpath
) {
  switch (by) {
    case By.xpath:
      return await driver.wait(until.elementLocated({ xpath: path }), 10000);
    case By.css:
      return await driver.wait(until.elementLocated({ css: path }), 10000);
    default:
      throw new Error('Not implemented');
  }
}
