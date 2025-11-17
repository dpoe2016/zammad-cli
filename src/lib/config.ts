import dotenv from 'dotenv';
import { ZammadConfig } from '../types';

// Load environment variables from .env file
dotenv.config();

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
