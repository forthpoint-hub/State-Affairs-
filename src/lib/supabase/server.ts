import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Used in Server Components, Server Actions, and Route Handlers.
// Respects the logged-in admin's session via cookies.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no writable cookie store.
            // Safe to ignore when middleware is refreshing the session.
          }
        },
      },
    }
  );
}
