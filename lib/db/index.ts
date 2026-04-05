// Run npm run db:push to create tables in Supabase
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

export function getDb() {
  if (!db) {
    const client = postgres(process.env.DATABASE_URL!, {
      max: 1,       // required for serverless
      ssl: 'require',
    });
    db = drizzle(client, { schema });
  }
  return db;
}

export { db };
