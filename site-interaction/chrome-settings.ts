import {chromium, Browser, Page, Locator} from 'playwright'

export async function openSettings(page : Page) : Promise<Page>{
  await page.goto("chrome://settings")
  return page;
}

export async function navigateToCustomSearchEngines(page : Page) : Promise <Page> {
  await page.getByRole('menuitem', { name: 'Search engine' }).click();
  await page.locator('#enginesSubpageTrigger').click();
  await page.getByText("Additional sites", { exact: true }).last().click()
  return page
}

export type CustomSearchEngineLink = {
  shortcut : string;
  url :  string;
}
export type CustomSearchEngineList = {
  [name : string] : CustomSearchEngineLink;
}

export async function summariseCustomSearchEngineEntries(page : Page) : Promise <CustomSearchEngineList> {
  // The settings pages have multiple shadow DOMs
  const searchEngineRows : Locator[] = await page.locator("settings-search-engines-list#activeEngines").locator(page.getByRole("row"), { has: page.locator("span#name-column")}).all()
  const searchEngineData : CustomSearchEngineList = {}
  for(const searchEngine of searchEngineRows){
    searchEngineData[await searchEngine.locator("span#name-column").innerText()] = {
      shortcut : await searchEngine.locator("span#shortcut-column").innerText(),
      url: await searchEngine.locator("span#url-column").innerText()
    }
  }
  return searchEngineData
}