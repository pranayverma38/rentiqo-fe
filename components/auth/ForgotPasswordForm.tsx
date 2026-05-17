"use client";

import { FormEvent, useState } from "react";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { useAuth } from "@/context/AuthProvider";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";

type ForgotPasswordFormProps = {
  className?: string;
  submitClassName?: string;
  onSuccess?: () => void;
};

export default function ForgotPasswordForm({
  className = "form-log",
  submitClassName = "tf-btn animate-btn",
  onSuccess,
}: ForgotPasswordFormProps) {
  const { resetPassword, error, clearError } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setSuccessMessage(null);

    if (!hasMedusaApiBaseUrl) {
      setLocalError("Store API is not configured.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("email") ?? "").trim();

    setSubmitting(true);
    try {
      await resetPassword(identifier);
      setSuccessMessage(
        "If an account exists for that email, you will receive reset instructions shortly.",
      );
      onSuccess?.();
    } catch {
      // Error surfaced via auth context.
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError ?? error;

  return (
    <PreventDefaultForm className={className} onSubmit={handleSubmit}>
      {displayError ? (
        <p className="text-primary mb-12" role="alert">
          {displayError}
        </p>
      ) : null}
      {successMessage ? (
        <p className="mb-12 cl-text-2" role="status">
          {successMessage}
        </p>
      ) : null}
      <div className="form-content">
        <fieldset className="tf-field">
          <label htmlFor="forgot-email" className="tf-lable fw-medium">
            Email address <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="forgot-email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            required
          />
        </fieldset>
      </div>
      <button type="submit" className={submitClassName} disabled={submitting}>
        {submitting ? "Sending…" : "Get Reset Code"}
      </button>
    </PreventDefaultForm>
  );
}
