import { cookies } from "next/headers";

export const DEMO_COOKIE = "vinci-demo-mode";

/** Pure check against env vars — usable anywhere, including middleware. */
export function isDemoModeFromEnv(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.NODE_ENV === "development";
}

/**
 * Server-side demo mode check for Server Components, Server Actions, and
 * Route Handlers. True if the env flag is set, or if the person navigated
 * with `?demo=true` at some point this session (middleware persists that
 * as a cookie so it survives subsequent navigations without the query
 * param attached to every link).
 */
export async function isDemoMode(): Promise<boolean> {
  if (isDemoModeFromEnv()) return true;
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_COOKIE)?.value === "true";
}
