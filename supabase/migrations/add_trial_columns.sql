-- Ensure subscription_status supports 'pending' and 'trialing' in addition to existing values.
-- The column already exists; this is a no-op guard for environments that haven't run db:push yet.
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'pending';

-- Stripe identifiers
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Trial end timestamp (stored as trial_ends_at throughout the codebase)
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

-- Indexes to speed up webhook lookups
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS users_subscription_status_idx ON users(subscription_status);
