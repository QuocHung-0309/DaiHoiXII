import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon pooler đã bật SSL sẵn trong URL (?sslmode=require)
});

export const db = drizzle(pool);
