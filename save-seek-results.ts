import {chromium, Browser, Page, Locator} from 'playwright'
import {startBrowserSession } from './browser-driving/index.ts'
import {writeDataFile} from './utils/file-handling.ts'
import {openSettings, navigateToCustomSearchEngines, summariseCustomSearchEngineEntries} from './site-interaction/index.ts'
import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
  console.log('start')
  const page : Page = await startBrowserSession(false)
  //if(openBrowser === null) throw new Error("Could not launch chrome headless")
  await page.goto(process.env.SEEK_SEARCH)
  const jobSearchResultsPage : Page = page 


  const jobCards : Locator[] = await jobSearchResultsPage.locator("xpath=//article[@data-automation='normalJob']").all()

  const jobCardDetails = await Promise.all(
    jobCards.map(async (jobCard : Locator) => {
      const getInnerTextOfDataAutomationTag = async (ancestor : Locator, dataAutomationValue : string) => {
        return ancestor.locator(`//*[@data-automation='${dataAutomationValue}']`).first().innerText()
      }
      const jobTitleLink = jobCard.locator("xpath=//a[@data-automation='jobTitle']").first()

      const jobCardDetails = {
        company : await getInnerTextOfDataAutomationTag(jobCard, 'jobCompany'),
        title : await jobTitleLink.innerText(),
        number : (await jobTitleLink.getAttribute('href')).match(/\/job\/(\d+)\?/)[1],
        classification : await getInnerTextOfDataAutomationTag(jobCard, 'jobClassification'),
        subclassification : await getInnerTextOfDataAutomationTag(jobCard, 'jobSubClassification'),
        shortdescription : await getInnerTextOfDataAutomationTag(jobCard, 'jobShortDescription'),
        listingdate : await getInnerTextOfDataAutomationTag(jobCard, 'jobListingDate'),
        location : await getInnerTextOfDataAutomationTag(jobCard, 'jobLocation') 
      }
      const hasDotPoints = await jobCard.locator("//ul").isVisible()
      if(hasDotPoints) jobCardDetails['dotpoints'] = (await Promise.all((await jobCard.locator("//li").all()).map(async ( li : Locator) => {
        return (await li.innerText())
      }))).join(",")
      return jobCardDetails

    })
  ) 

  writeDataFile("jobs.json", jobCardDetails)


  const context = await jobSearchResultsPage.context();
  const browser = await context.browser();
  
  browser.close();
})();