const { scrapeLinkedInProfile } = require('./linkedinscraper');

(async () => {
  const url = 'https://www.linkedin.com/in/satyanadella/';
  const data = await scrapeLinkedInProfile(url);
  console.log('Scraped Data:', data);
})();
