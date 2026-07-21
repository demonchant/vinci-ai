"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail } from "@/components/ui/icons";
import { signInWithGoogle, signUpWithEmail, resendConfirmationEmail } from "@/services/authClient";
import { signupSchema, type SignupInput } from "@/lib/validation/auth";
import { TextField } from "@/components/auth/TextField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

export default function SignupPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupInput) {
    setFormError(null);
    const { data: result, error } = await signUpWithEmail(data.email, data.password, data.displayName);
    if (error) {
      setFormError(error.message);
      return;
    }
    if (result.session) {
      router.push("/dashboard");
    } else {
      setConfirmationEmail(data.email);
    }
  }

  async function handleGoogle() {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle("/dashboard");
    if (error) {
      setFormError(error.message);
      setIsGoogleLoading(false);
    }
  }

  async function handleResend() {
    if (!confirmationEmail) return;
    setResendState("sending");
    await resendConfirmationEmail(confirmationEmail);
    setResendState("sent");
  }

  if (confirmationEmail) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold">Check your inbox</h1>
        <p className="text-sm text-gray-400">
          We sent a confirmation link to <span className="text-gray-200">{confirmationEmail}</span>.
          Click it to activate your account.
        </p>
        <button
          onClick={handleResend}
          disabled={resendState !== "idle"}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          {resendState === "sent" ? "Confirmation email resent" : "Resend confirmation email"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-gray-500">The AI Copilot for Every Collector.</p>
      </div>

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
          placeholder="Name"
          autoComplete="name"
          error={errors.displayName?.message}
          {...register("displayName")}
        />
        <TextField
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          placeholder="Password (min 8 characters)"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {formError && <p className="text-sm text-red-400">{formError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
