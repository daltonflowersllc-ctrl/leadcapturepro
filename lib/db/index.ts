// Run npm run db:push to create tables in Supabase
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, {
  max: 1,
  ssl: 'require',
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema });
