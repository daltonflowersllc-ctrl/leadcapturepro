// Run npm run db:push to create tables in Supabase
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!
const clientString = connectionString.includes('?')
  ? connectionString + '&pgbouncer=true&connection_limit=1'
  : connectionString + '?pgbouncer=true&connection_limit=1'

const client = postgres(clientString, {
  max: 1,
  ssl: 'require',
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
})

export const db = drizzle(client, { schema });
