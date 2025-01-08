require("dotenv").config();
const { chromium, webkit } = require("playwright");
const { expect } = require("@playwright/test");

(async () => {
    try {
        const browsers = [
            { name: 'Chrome', browser: chromium },
            { name: 'MicrosoftEdge', browser: chromium }, // Edge uses Chromium in Playwright
        ];

        for (const { name, browser } of browsers) {
            console.log(`Running tests on: ${name}`);

            const capabilities = {
                browserName: name,
                browserVersion: 'latest',
                "LT:Options": {
                    platform: name === 'Safari' ? 'MacOS Ventura' : 'Windows 11',
                    build: 'Log In User',
                    name: `Log In User on ${name}`,
                    user: process.env.LT_USERNAME,
                    accessKey: process.env.LT_ACCESS_KEY,
                    tunnel: true, // Enable the tunnel
                    network: true,
                    video: true,
                    console: true,
                    visual: true
                },
            };

            // Establish connection to LambdaTest
            const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;
            const browserInstance = await browser.connect({ wsEndpoint });

            // Navigate to the URL
            const page = await browserInstance.newPage();
            console.log('Navigating to:','https://hrp-accounts-dev.azurewebsites.net/');
            await page.goto('https://hrp-accounts-dev.azurewebsites.net/');
 
            // Assert Page Title
            const pageTitle = await page.title();
            console.log('Page Title is:', pageTitle);
            await expect(page).toHaveTitle('Login - BizBox Accounts');
           
            // Input Username or Email and Password
            try {
                await page.locator('//input[@id="inputUsernameOrEmail"]').fill('pharmacisthr1@mailinator.com');
                await page.waitForTimeout(5000); // Wait for 5 second 
              } catch (error) {
                console.error('Error filling username field:', error);
                throw new Error('Failed to fill username field');
              }
              
              try {
                await page.locator('//input[@id="inputPassword"]').fill('@Qwerty543!');
                await page.waitForTimeout(5000); // Wait for 5 second 
              } catch (error) {
                console.error('Error filling password field:', error);
                throw new Error('Failed to fill password field');
              }
              
            // Remember me checkbox
            await page.getByLabel('Remember me').check();
            await page.waitForTimeout(5000); // Wait for 5 second 

            // Click on the login button
            await page.getByRole('button', { name: 'Log in' }).click();
  
            // Click on HRPayroll
            await page.getByRole('link', { name: 'HRPayroll', exact: true }).click();
            await page.waitForTimeout(9000); // Wait for 9 second 

            // Click on the "Department" link 
            await page.locator('svg').first().click();
            await page.waitForTimeout(9000); // Wait for 9 second 
            await page.getByRole('link', { name: 'Department' }).click();

            // Close the browser instance after tests
            await browserInstance.close();

        }
    } catch (error) {
        console.error('Error:', error);
    }
})();