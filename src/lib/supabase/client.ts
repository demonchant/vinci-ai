import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in Client Components.
 * Uses the public anon key — safe to expose to the browser.
 * Row Level Security policies (prisma/sql/02_row_level_security.sql)
 * are what actually protect data, not key secrecy.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
