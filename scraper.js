const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0'
];

module.exports.launchBrowser = async function launchBrowser(profileUrl) {
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      `--user-agent=${userAgent}`
    ]
  });

  const page = await browser.newPage();

  try {
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });

   const cookies = JSON.parse(Buffer.from(process.env.COOKIE_BASE64, 'base64').toString());
    await page.setCookie(...cookies);
    console.log('🍪 Session cookies loaded');

    console.log(`🔗 Navigating to ${profileUrl}`);
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    const selectors = [
      'h1',
      '.text-heading-xlarge',
      '.top-card-layout__title',
      '.pv-top-card--list > li:first-child'
    ];

    let name = null;
    for (const selector of selectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        name = await page.$eval(selector, el => el.textContent.trim());
        if (name) break;
      } catch {
        // continue trying other selectors
      }
    }

    if (name) {
      console.log(`✅ Profile Name: ${name}`);
    } else {
      console.log('❌ Could not find profile name');
    }

    return { browser, page };

  } catch (err) {
    console.error('❌ Scraping failed:', err);
    try {
      await page.screenshot({ path: 'debug-failure.png', fullPage: true });
      console.log('📸 Screenshot saved at debug-failure.png');
    } catch (screenshotErr) {
      console.warn('⚠️ Failed to take screenshot:', screenshotErr.message);
    }
    return { browser, page: null };
  }
};
