import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — createClient is NOT called at module load time, so
// Next.js build-time static analysis won't fail on missing env vars.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _client;
}

// Proxy forwards every property access to the real client, which is only
// created on the first actual request — never during the build phase.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    return getClient()[prop as keyof SupabaseClient];
  },
});
