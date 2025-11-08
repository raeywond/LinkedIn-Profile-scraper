import { scrapeLinkedInProfile } from '../linkedinscraper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing LinkedIn URL' });

  try {
    const data = await scrapeLinkedInProfile(url);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
