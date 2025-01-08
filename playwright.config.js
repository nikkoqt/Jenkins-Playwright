
const { defineConfig, devices } = require('@playwright/test');
const capabilites=require("./config/capabilites")


module.exports = defineConfig({
  testDir: './tests',
  
  fullyParallel: true,
 
  forbidOnly: !!process.env.CI,
 
  retries: process.env.CI ? 2 : 0,
  
  workers: process.env.CI ? 1 : undefined,
  
  reporter: 'html',
  
  use: {
    
    trace: 'on-first-retry',
  },

  
  projects: capabilites.map(capability=>({

    name :capability['LT:Options']['name'],
    use:{
      browserName: capability.browserName,
      ...capability['LT:Options'],
    },
  })),
  
});

