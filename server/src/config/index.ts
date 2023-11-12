import dotenv from 'dotenv';

// Load the appropriate .env file based on the NODE_ENV environment variable
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config(); // Load the default .env file for development
}

export const PG_USER = process.env.PG_USER as string,
  PG_HOST = process.env.PG_HOST as string,
  PG_DBNAME = process.env.PG_DBNAME as string,
  PG_PASSWORD = process.env.PG_PASSWORD as string,
  PG_PORT = process.env.PG_PORT ?? 5432;
