// Handles OAuth flow and serves image cache

import express from 'express';
import dotenv from 'dotenv';
import { IMAGE_CACHE_DIR } from './consts';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || "localhost";

app.use(`/${IMAGE_CACHE_DIR}`, express.static(IMAGE_CACHE_DIR));

app.listen(port, () => {
    console.log(`⚡ Server running on port ${port}`);
})