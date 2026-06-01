"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { PasswordField } from "@/components/forms/PasswordField";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { getAccountEntryHref } from "@/components/account/accountEntry";
import { useAuth } from "@/context/AuthProvider";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";

type LoginFormProps = {
  className?: string;
  forgotPasswordHref?: string;
  submitClassName?: string;
  onSuccess?: () => void;
};

export default function LoginForm({
  className = "form-log",
  forgotPasswordHref = "/forget-password",
  submitClassName = "tf-btn animate-btn w-100",
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, error, clearError, isLoading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const redirectParam = searchParams.get("redirect")?.trim();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!hasMedusaApiBaseUrl) {
      setLocalError("Store API is not configured.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setSubmitting(true);
    try {
      await login(email, password);
      onSuccess?.();
      const destination =
        redirectParam && redirectParam !== "/account-page"
          ? redirectParam
          : getAccountEntryHref();
      router.push(destination);
    } catch {
      // Error surfaced via auth context.
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError ?? error;
  const busy = submitting || authLoading;

  return (
    <PreventDefaultForm className={className} onSubmit={handleSubmit}>
      {displayError ? (
        <p className="text-primary mb-12" role="alert">
          {displayError}
        </p>
      ) : null}
      <div className="form-content">
        <fieldset className="tf-field">
          <label htmlFor="login-email" className="tf-lable fw-medium">
            Email address <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            required
          />
        </fieldset>
        <fieldset className="tf-field password-wrapper">
          <label htmlFor="login-password" className="tf-lable fw-medium">
            Password <span className="text-primary">*</span>
          </label>
          <PasswordField
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            required
          />
        </fieldset>
        <fieldset className="field-bottom">
          <div className="checkbox-wrap">
            <input className="tf-check style-2" type="checkbox" id="remember" />
            <label htmlFor="remember"> Remember me </label>
          </div>
          {forgotPasswordHref.startsWith("#") ? (
            <a
              href={forgotPasswordHref}
              data-bs-toggle="modal"
              className="link text-decoration-underline"
            >
              <span className="text-caption-01 fw-semibold">
                Forgot Your Password?
              </span>
            </a>
          ) : (
            <Link
              href={forgotPasswordHref}
              className="link text-decoration-underline"
            >
              <span className="text-caption-01 fw-semibold">
                Forgot Your Password?
              </span>
            </Link>
          )}
        </fieldset>
      </div>
      <button type="submit" className={submitClassName} disabled={busy}>
        {busy ? "Signing in…" : "Login"}
      </button>
    </PreventDefaultForm>
  );
}
