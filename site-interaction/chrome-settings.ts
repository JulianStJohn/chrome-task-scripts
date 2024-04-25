import {chromium, Browser, Page} from 'playwright'

export async function openSettings(page : Page) : Promise<Page>{
  await page.goto("chrome://settings")
  return page;
}