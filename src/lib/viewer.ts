import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/services/demoMode";

export const DEMO_USER_ID = "demo-user";

export interface ResolvedViewer {
  userId: string;
  demo: boolean;
}

/**
 * The single entry point every (app) Server Component page uses. Resolves
 * to a real Supabase user, or — in Judge Demo Mode — a stable pseudo-user
 * id that every demo fixture is keyed to. Redirects to /login only when
 * neither applies, so demo visitors never need an account.
 */
export async function resolveViewer(): Promise<ResolvedViewer> {
  const demo = await isDemoMode();

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (auth.user) {
    return { userId: auth.user.id, demo: false };
  }

  if (demo) {
    return { userId: DEMO_USER_ID, demo: true };
  }

  redirect("/login");
}
