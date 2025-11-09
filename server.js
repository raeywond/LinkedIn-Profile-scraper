import express from 'express';
import scrapeHandler from './api/scrape.js';

const app = express();
app.use(express.json());
app.post('/api/scrape', scrapeHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
