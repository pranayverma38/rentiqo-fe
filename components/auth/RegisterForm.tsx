"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { PasswordField } from "@/components/forms/PasswordField";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { getAccountEntryHref } from "@/components/account/accountEntry";
import { useAuth } from "@/context/AuthProvider";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";

type RegisterFormProps = {
  className?: string;
  submitClassName?: string;
  onSuccess?: () => void;
};

export default function RegisterForm({
  className = "form-log",
  submitClassName = "action-create-account tf-btn animate-btn",
  onSuccess,
}: RegisterFormProps) {
  const router = useRouter();
  const { register, error, clearError, isLoading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      onSuccess?.();
      router.push(getAccountEntryHref());
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
          <label htmlFor="register-email" className="tf-lable fw-medium">
            Email address <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="register-email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            required
          />
        </fieldset>
        <div className="tf-grid-layout sm-col-2">
          <fieldset className="tf-field">
            <label htmlFor="register-first-name" className="tf-lable fw-medium">
              First name
            </label>
            <input
              type="text"
              id="register-first-name"
              name="firstName"
              autoComplete="given-name"
              placeholder="First name"
            />
          </fieldset>
          <fieldset className="tf-field">
            <label htmlFor="register-last-name" className="tf-lable fw-medium">
              Last name
            </label>
            <input
              type="text"
              id="register-last-name"
              name="lastName"
              autoComplete="family-name"
              placeholder="Last name"
            />
          </fieldset>
        </div>
        <fieldset className="tf-field password-wrapper">
          <label htmlFor="register-password" className="tf-lable fw-medium">
            Password <span className="text-primary">*</span>
          </label>
          <PasswordField
            id="register-password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            required
          />
        </fieldset>
        <fieldset className="tf-field password-wrapper">
          <label htmlFor="register-confirm-password" className="tf-lable fw-medium">
            Confirm password <span className="text-primary">*</span>
          </label>
          <PasswordField
            id="register-confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm password"
            required
          />
        </fieldset>
      </div>
      <button type="submit" className={submitClassName} disabled={busy}>
        {busy ? "Creating account…" : "Create Account"}
      </button>
    </PreventDefaultForm>
  );
}