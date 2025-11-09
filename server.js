import express from 'express';
import bodyParser from 'body-parser';
import { scrapeLinkedInProfile } from './linkedinscraper.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing LinkedIn URL' });
  }

  try {
    const data = await scrapeLinkedInProfile(url);
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Scraping error:', err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
