import dotenv from 'dotenv';
import { ZammadConfig } from '../types';
import path from 'path';

// Load environment variables from .env file
// Resolve path relative to the script location, not the current working directory
const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

export function getConfig(): ZammadConfig {
  const url = process.env.ZAMMAD_URL;
  const token = process.env.ZAMMAD_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Missing required environment variables. Please set ZAMMAD_URL and ZAMMAD_TOKEN in your .env file or environment.'
    );
  }

  return { url, token };
}
