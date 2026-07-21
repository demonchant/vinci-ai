"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { VinciUser } from "@/types/user";

export function useUser() {
  const [user, setUser] = useState<VinciUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
          displayName: data.user.user_metadata?.full_name ?? null,
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
          isGuest: Boolean(data.user.user_metadata?.is_guest),
          createdAt: data.user.created_at,
        });
      }
      setIsLoading(false);
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, isLoading };
}
