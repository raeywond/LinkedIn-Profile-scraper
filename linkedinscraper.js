const { launchBrowser } = require('./scraper');

async function scrapeLinkedInProfile(linkedinUrl) {
  const { browser, page } = await launchBrowser(linkedinUrl);
  if (!browser || !page) {
    console.error('🚫 Failed to initialize browser or page.');
    return null;
  }

  try {
    const profileData = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : null;
      };

      const getSectionText = (headingText) => {
        const heading = Array.from(document.querySelectorAll('section h2'))
          .find(el => el.innerText.trim().toLowerCase().includes(headingText));
        if (heading) {
          const container = heading.closest('section');
          return container ? container.innerText.trim() : null;
        }
        return null;
      };

      return {
        name: getText('h1, .text-heading-xlarge, .top-card-layout__title'),
        headline: getText('.text-body-medium.break-words'),
        location: getText('.text-body-small.inline.t-black--light.break-words'),
        about: getSectionText('about'),
        experience: getSectionText('experience'),
        education: getSectionText('education'),
      };
    });

    console.log('✅ Scrape complete:', profileData);
    return profileData;
  } catch (err) {
    console.error('❌ Scraping failed:', err.message);
    return null;
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeLinkedInProfile };
