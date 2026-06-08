"use client";

import AddressFormChipGroup from "@/components/account/account-addresses/AddressFormChipGroup";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

const ACCOMMODATION_OPTIONS = [
  { value: "apartment", label: "Apartment" },
  { value: "independent-house", label: "Independent house" },
  { value: "pg-hostel", label: "PG/Hostel" },
] as const;

const SERVICE_LIFT_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
] as const;

type AccountAddressFormProps = {
  submitLabel?: string;
  onCancel: () => void;
  onSubmit?: () => void;
};

export default function AccountAddressForm({
  submitLabel = "Save Address",
  onCancel,
  onSubmit,
}: AccountAddressFormProps) {
  return (
    <PreventDefaultForm
      className="form-account-address"
      onSubmit={() => onSubmit?.()}
    >
      <div className="form-content">
        <div className="tf-grid-layout sm-col-2">
          <fieldset className="tf-field">
            <label htmlFor="first-name" className="tf-lable fw-medium">
              First Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="first-name"
              name="firstName"
              placeholder="First Name"
              required
            />
          </fieldset>
          <fieldset className="tf-field">
            <label htmlFor="last-name" className="tf-lable fw-medium">
              Last Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="last-name"
              name="lastName"
              placeholder="Last Name"
              required
            />
          </fieldset>
        </div>
        <div className="tf-grid-layout sm-col-2">
          <fieldset className="tf-field">
            <label htmlFor="company" className="tf-lable fw-medium">
              Company name (optional)
            </label>
            <select name="company" id="company" defaultValue="">
              <option value="">Select company</option>
              <option value="themesflat">Themesflat</option>
            </select>
          </fieldset>
          <fieldset className="tf-field">
            <label htmlFor="country" className="tf-lable fw-medium">
              Country / Region <span className="text-primary">*</span>
            </label>
            <select name="country" id="country" required defaultValue="">
              <option value="">Country / Region</option>
              <option value="in">India</option>
              <option value="vn">Viet Nam</option>
            </select>
          </fieldset>
        </div>
        <div className="tf-grid-layout sm-col-2">
          <fieldset className="tf-field">
            <label htmlFor="street" className="tf-lable fw-medium">
              Street Address <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="street"
              name="street"
              placeholder="Street Address"
              required
            />
          </fieldset>
          <fieldset className="tf-field">
            <label htmlFor="town" className="tf-lable fw-medium">
              Town / City <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="town"
              name="town"
              placeholder="Town / City"
              required
            />
          </fieldset>
        </div>
        <div className="tf-grid-layout sm-col-2">
          <fieldset className="tf-field">
            <label htmlFor="state" className="tf-lable fw-medium">
              State <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              required
            />
          </fieldset>
          <fieldset className="tf-field">
            <label htmlFor="zip" className="tf-lable fw-medium">
              ZIP <span className="text-primary">*</span>
            </label>
            <input type="text" id="zip" name="zip" placeholder="ZIP" required />
          </fieldset>
        </div>
        <div className="tf-grid-layout sm-col-2">
          <fieldset className="tf-field">
            <label htmlFor="phone" className="tf-lable fw-medium">
              Phone <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone"
              required
            />
          </fieldset>
          <fieldset className="tf-field">
            <label htmlFor="email" className="tf-lable fw-medium">
              Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </fieldset>
        </div>

        <AddressFormChipGroup
          name="accommodationType"
          legend="Accommodation Type"
          options={[...ACCOMMODATION_OPTIONS]}
          defaultValue="apartment"
        />

        <AddressFormChipGroup
          name="serviceLift"
          legend="Service Lift"
          options={[...SERVICE_LIFT_OPTIONS]}
          defaultValue="available"
        />

        <fieldset className="tf-field account-address-default-field">
          <label className="account-address-default-check" htmlFor="address-is-default">
            <input type="checkbox" id="address-is-default" name="isDefault" />
            <span className="account-address-default-check__box" aria-hidden="true" />
            <span className="account-address-default-check__label fw-medium">
              Mark as Default
            </span>
          </label>
        </fieldset>
      </div>
      <div className="account-address-form__actions">
        <button type="button" className="tf-btn btn-stroke" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="tf-btn animate-btn">
          {submitLabel}
        </button>
      </div>
    </PreventDefaultForm>
  );
}