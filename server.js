const express = require('express');
const { scrapeLinkedInProfile } = require('./linkedinscraper');
const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing LinkedIn URL' });

  try {
    const data = await scrapeLinkedInProfile(url);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(3000, () => console.log('🚀 Scraper API running on http://localhost:3000'));
