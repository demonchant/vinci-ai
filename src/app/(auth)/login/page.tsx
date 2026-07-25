"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "@/components/ui/icons";
import { signInWithGoogle, signInWithEmail, signInAsGuest } from "@/services/authClient";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { TextField } from "@/components/auth/TextField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") ?? "/dashboard";
  const callbackError = searchParams.get("error");

  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setFormError(null);
    const { error } = await signInWithEmail(data.email, data.password);
    if (error) {
      setFormError(error.message);
      return;
    }
    router.push(redirectedFrom);
  }

  async function handleGoogle() {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle(redirectedFrom);
    if (error) {
      setFormError(error.message);
      setIsGoogleLoading(false);
    }
    // On success, Supabase redirects the browser away — no further action needed.
  }

  async function handleGuest() {
    setIsGuestLoading(true);
    const { error } = await signInAsGuest();
    setIsGuestLoading(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    router.push(redirectedFrom);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-gray-500">Sign in to your Vinci AI account.</p>
      </div>

      {callbackError && (
        <p className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-400">
          {/* ✅ FIX: Replaced raw apostrophe with &apos; */}
          That sign-in link didn&apos;t work. Please try again.
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        disabled={isGoogleLoading}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div className="h-px flex-1 bg-white/10" />
        OR
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <TextField
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <PasswordInput
            placeholder="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="mt-1.5 flex justify-end">
            <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-300">
              Forgot password?
            </Link>
          </div>
        </div>

        {formError && <p className="text-sm text-red-400">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <button
        onClick={handleGuest}
        disabled={isGuestLoading}
        className="w-full text-sm text-gray-400 hover:text-white disabled:opacity-50"
      >
        {isGuestLoading ? "Setting up guest session..." : "Continue as guest"}
      </button>

      <p className="text-center text-sm text-gray-500">
        No account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}