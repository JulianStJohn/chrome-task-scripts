import {chromium, Browser, Page, Locator} from 'playwright'
import {browserSession, launchChromeOsxWithRemoteDebugging } from './browser-driving'
import {writeDataFile} from './utils/file-handling.ts'
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
  const searchEngineData = {}
  for(const searchEngine of searchEngineRows){
    const name = await searchEngine.locator("span#name-column").innerText()
    const shortcut = await searchEngine.locator("span#shortcut-column").innerText()
    const url = await searchEngine.locator("span#url-column").innerText()

    searchEngineData[name] = {shortcut: shortcut, url: url}

  }

  writeDataFile( "search-engines.json", searchEngineData)

  //await page.pause();


})();
