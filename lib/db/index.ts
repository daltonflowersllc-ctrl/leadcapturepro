// Run npm run db:push to create tables in Supabase
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    const client = postgres(process.env.DATABASE_URL!);
    db = drizzle(client, { schema });
  }
  return db;
}

export { db };
