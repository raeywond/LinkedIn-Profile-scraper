import { scrapeLinkedInProfile } from '../linkedinscraper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

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
}
