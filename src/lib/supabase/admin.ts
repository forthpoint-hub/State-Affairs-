import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// SERVER-ONLY. Never import this file from a Client Component.
// Uses the service role key to read/write drafts, publish articles, etc.
// Every route/action that uses this must itself check the caller is a
// logged-in admin (see requireAdmin() in ./require-admin.ts) before calling it.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
