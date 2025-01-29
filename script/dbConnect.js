import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

let pool;

export default function dbConnect() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle database connection', err);
      process.exit(-1); // Exit the process if there's a critical error
    });
  }
  return pool;
};
