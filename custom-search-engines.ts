import {chromium, Browser, Page, Locator} from 'playwright'
import {browserSession, launchChromeOsxWithRemoteDebugging } from './browser-driving'
import {openSettings} from './site-interaction'

(async () => {
  
  launchChromeOsxWithRemoteDebugging();
  const page : Page | null = await browserSession()
  if(page === null) throw new Error("Could not connect to Google Chrome")
  await openSettings(page);

  await page.getByRole('menuitem', { name: 'Search engine' }).click();
  await page.locator('#enginesSubpageTrigger').click();
  await page.getByText("Additional sites", { exact: true }).last().click()

  // The settings pages have multiple shadow DOMs
  const searchEngineRows : Locator[] = await page.locator("settings-search-engines-list#activeEngines").locator(page.getByRole("row"), { has: page.locator("span#name-column")}).all()


  for(const searchEngine of searchEngineRows){
    console.log(await searchEngine.locator("span#name-column").innerText())
    console.log(await searchEngine.locator("span#shortcut-column").innerText())
    console.log(await searchEngine.locator("span#url-column").innerText())
  }

  await page.pause();


})();
