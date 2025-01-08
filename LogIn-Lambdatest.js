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
           
            // Assert Username or Email
             await expect(page.locator('//input[@id="inputUsernameOrEmail"]')).toBeVisible()
             await expect(page.locator('//input[@id="inputUsernameOrEmail"]')).toBeEnabled()
             await expect(page.locator('//input[@id="inputUsernameOrEmail"]')).toBeEditable()
             await page.locator('//input[@id="inputUsernameOrEmail"]').fill('pharmacisthr1@mailinator.com');
             await page.waitForTimeout(5000); // Wait for 5 second 

            // Assert Password
             await expect(page.locator('//input[@id="inputPassword"]')).toBeVisible()
             await expect(page.locator('//input[@id="inputPassword"]')).toBeEnabled()
             await expect(page.locator('//input[@id="inputUsernameOrEmail"]')).toBeEditable()
             await page.locator('//input[@id="inputPassword"]').fill('@Qwerty543!');
             await page.waitForTimeout(5000); // Wait for 5 second 

            // Remember me checkbox
             await page.locator('//input[@id="PasswordLoginModel_RememberMe"]').check();
             await expect(page.locator('//input[@id="PasswordLoginModel_RememberMe"]')).toBeChecked()
             await expect(page.locator('//input[@id="PasswordLoginModel_RememberMe"]')).toBeTruthy()
             await page.waitForTimeout(5000); // Wait for 5 second 

            // Click on the login button
             await expect(page.locator('//button[normalize-space()="Log in"]')).toBeVisible()
             await expect(page.locator('//button[normalize-space()="Log in"]')).toBeEnabled()
             await page.locator('//button[normalize-space()="Log in"]').click();
             await page.waitForTimeout(5000); // Wait for 5 second 
  
            // Click on HRPayroll           
             await page.locator('//a[normalize-space()="HRPayroll"]').click();
             await page.waitForTimeout(7000); // Wait for 7 second 

            // Click on the "Department" link 
             await page.locator('//div[@class="styles_buttonMin__3_16b"]//*[name()="svg"]').first().click();
             await page.waitForTimeout(7000); // Wait for 7 second 
             await expect(page.locator('//div[normalize-space()="Department"]')).toBeEnabled()
             await expect(page.locator('//div[normalize-space()="Department"]')).toBeVisible()
             await page.locator('//div[normalize-space()="Department"]').click();

             //Click on the "Avatar" to show All Modules 
             await expect(page.locator('//img[@class="avatar-styles_avatar__2tR7H"]')).toBeVisible()
             await page.locator('//img[@class="avatar-styles_avatar__2tR7H"]').click();
             await page.waitForTimeout(7000); // Wait for 7 second

             //Click on Admin_HRPayroll
             await page.locator('//a[normalize-space()="Admin_HRPayroll"]').click();
             await page.waitForTimeout(7000); // Wait for 7 second

             //Click on the "Avatar" to show All Modules 
             await expect(page.locator('//img[@alt="ML"]')).toBeVisible()
             await page.locator('//img[@alt="ML"]').click();
             await page.waitForTimeout(7000); // Wait for 7 second

             //Click on My_HRPayroll
             await page.locator('//a[normalize-space()="My_HRPayroll"]').click();
             await page.waitForTimeout(7000); // Wait for 7 second 

             //Click on Logout
             await page.locator('//div[@class="styles_buttonContent__1EvVd"]').click();
             await page.waitForTimeout(7000); // Wait for 7 second 
             
            // Close the browser instance after tests
             await browserInstance.close();

        }
    } catch (error) {
        console.error('Error:', error);
    }
})();