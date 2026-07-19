import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase instance (Client Components: login forms, cart widgets, etc.)
// Server-side reads/writes should go through lib/supabase-server.ts instead —
// never expose the service role key to the browser.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
