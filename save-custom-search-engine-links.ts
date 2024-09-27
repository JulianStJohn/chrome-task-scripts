import {chromium, Browser, Page, Locator} from 'playwright'
import {joinBrowserSession, launchChromeOsxWithRemoteDebugging } from './browser-driving/index.ts'
import {writeDataFile} from './utils/file-handling.ts'
import {openSettings, navigateToCustomSearchEngines, summariseCustomSearchEngineEntries} from './site-interaction/index.ts'

(async () => {
  
  launchChromeOsxWithRemoteDebugging();
  const openBrowser : Page | null = await joinBrowserSession()
  if(openBrowser === null) throw new Error("Could not connect to Google Chrome")
  
  const settingsPage : Page = await openSettings(openBrowser);
  const customSearchEngines : Page = await navigateToCustomSearchEngines(settingsPage)

  const searchEngineData = await summariseCustomSearchEngineEntries(customSearchEngines)

  writeDataFile( "search-engines.json", searchEngineData)

  //await page.pause();


})();
