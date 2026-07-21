"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "@/components/ui/icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { updatePassword } from "@/services/authClient";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<"checking" | "ready" | "invalid">("checking");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // The recovery link establishes a session automatically when the page
    // loads (detectSessionInUrl). We just need to confirm it landed.
    supabase.auth.getSession().then(({ data }) => {
      setSessionState(data.session ? "ready" : "invalid");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setSessionState("ready");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(data: ResetPasswordInput) {
    setFormError(null);
    const { error } = await updatePassword(data.password);
    if (error) {
      setFormError(error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  if (sessionState === "checking") {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      </div>
    );
  }

  if (sessionState === "invalid") {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold">This link has expired</h1>
        <p className="text-sm text-gray-400">
          Password reset links are single-use and time-limited. Request a new one to continue.
        </p>
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold">Password updated</h1>
        <p className="text-sm text-gray-400">Taking you to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="text-sm text-gray-500">Choose a password you haven't used before.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <PasswordInput
          placeholder="New password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          placeholder="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {formError && <p className="text-sm text-red-400">{formError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
        </button>
      </form>
    </div>
  );
}
