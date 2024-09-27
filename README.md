# Chrome Task Scripts

Automate routine tasks with playwright

## Setup

Headless scripts require chromium: 

* OSX : `npx @puppeteer/browsers install chrome@stable`
* Amazon Linux : 




* Run chrome with `--remote-debugging-port=9222` 

### .env 

* `CHROME_APP_LOCATION` Location of chrome executable e.g. `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome`

## Scripts

* `customer-search-engines.ts` manipulate the chrome custom search engines settings
