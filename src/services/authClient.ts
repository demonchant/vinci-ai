"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function authClient() {
  return createSupabaseBrowserClient();
}

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = authClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback${
        redirectTo ? `?redirectedFrom=${encodeURIComponent(redirectTo)}` : ""
      }`,
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = authClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  const supabase = authClient();
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: displayName } },
  });
}

/**
 * Guest mode: creates an anonymous Supabase session (no email/password).
 * Requires "Allow anonymous sign-ins" enabled in Supabase Auth settings.
 * Guest accounts can be upgraded later via supabase.auth.updateUser().
 */
export async function signInAsGuest() {
  const supabase = authClient();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (!error && data.user) {
    // Mark as guest in metadata so the sync trigger sets isGuest=true
    await supabase.auth.updateUser({ data: { is_guest: true } });
  }
  return { data, error };
}

export async function signOut() {
  const supabase = authClient();
  return supabase.auth.signOut();
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = authClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function updatePassword(newPassword: string) {
  const supabase = authClient();
  return supabase.auth.updateUser({ password: newPassword });
}

export async function resendConfirmationEmail(email: string) {
  const supabase = authClient();
  return supabase.auth.resend({ type: "signup", email });
}
