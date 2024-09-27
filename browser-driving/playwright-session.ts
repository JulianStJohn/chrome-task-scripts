import {chromium, Browser, Page} from 'playwright'
const { exec } = require('child_process');
import { delay } from '../utils/waits.ts'
import * as dotenv from 'dotenv';
dotenv.config();

export function launchChromeOsxWithRemoteDebugging() : void {
  const chromeCloseAndRelaunch = `
  while :
  do 
    chromeProcesses=$(pgrep "Google Chrome" | wc -l);
    echo $chromeProcesses Chrome processes open;
    if [ "$chromeProcesses" -eq 0 ]; then break; fi
    pkill -f "Google Chrome"; 
    wait;
  done;
  ${process.env.CHROME_APP_LOCATION} --remote-debugging-port=9222 
  `
  exec(chromeCloseAndRelaunch, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    console.log(stdout);
  });
}

export async function joinBrowserSession(retryCount? : number) : Promise<Page | null> {
  retryCount = (retryCount === undefined) ? 0 : retryCount;
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log(browser.isConnected() && 'Connected to Chrome.');
    console.log(`Contexts in CDP session: ${browser.contexts().length}.`);
    const context = browser.contexts()[0];
    return await context.newPage();
  } catch (error) {
    console.log('Cannot connect to Chrome, retrying');
    if(retryCount <= 2){
      await delay(1000);
      return joinBrowserSession(retryCount++); 
    }
    return new Promise<Page | null>((resolve) => { resolve(null)})
  }
}

export async function startBrowserSession(headless = true) : Promise<Page> {
  const browser = await chromium.launch({headless : headless})
 /*   
  { // headless: true,
       //executablePath : process.env.CHROMIUM_LOCATION
});
      */
  
  return await browser.newPage();

}