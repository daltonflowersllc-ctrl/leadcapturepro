import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)
migrate(db, { migrationsFolder: './drizzle' }).then(() => { console.log('Migration complete'); process.exit(0); }).catch(console.error)
