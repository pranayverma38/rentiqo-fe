"use client";

import { FormEvent, useEffect, useState } from "react";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { useAuth } from "@/context/AuthProvider";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export default function AccountProfile() {
  const { customer, updateProfile, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!customer) return;
    setFirstName(customer.first_name ?? "");
    setLastName(customer.last_name ?? "");
    setPhone(customer.phone ?? "");
  }, [customer]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      await updateProfile({
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      console.error(getApiErrorMessage(err, "Update failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="account-my_address setting">
      <p className="mb-12 h6 fw-medium">Information</p>
      {error ? (
        <p className="text-primary mb-12" role="alert">
          {error}
        </p>
      ) : null}
      {successMessage ? (
        <p className="mb-12 cl-text-2" role="status">
          {successMessage}
        </p>
      ) : null}
      <PreventDefaultForm className="form-setting" onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="tf-grid-layout sm-col-2">
            <fieldset className="tf-field">
              <label htmlFor="first-name" className="tf-lable fw-medium">
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </fieldset>
            <fieldset className="tf-field">
              <label htmlFor="last-name" className="tf-lable fw-medium">
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </fieldset>
          </div>
          <fieldset className="tf-field">
            <label htmlFor="phone-number" className="tf-lable fw-medium">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone-number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
          </fieldset>
          <fieldset className="tf-field">
            <label htmlFor="email" className="tf-lable fw-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={customer?.email ?? ""}
              readOnly
              disabled
            />
          </fieldset>
        </div>
        <div className="btn-submit">
          <button type="submit" className="tf-btn animate-btn" disabled={submitting}>
            {submitting ? "Saving…" : "Save Change"}
          </button>
        </div>
      </PreventDefaultForm>
    </div>
  );
}