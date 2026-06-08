"use client";

import { useCallback, useState } from "react";

import AccountAddressCard from "@/components/account/account-addresses/AccountAddressCard";
import AccountAddressForm from "@/components/account/account-addresses/AccountAddressForm";
import { MOCK_ACCOUNT_ADDRESSES } from "@/components/account/account-addresses/accountAddressesData";
import type { AccountAddress } from "@/components/account/account-addresses/types";

type AddressView = "list" | "form";

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<AccountAddress[]>(
    () => [...MOCK_ACCOUNT_ADDRESSES],
  );
  const [view, setView] = useState<AddressView>("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const openAddForm = useCallback(() => {
    setEditingId(null);
    setView("form");
  }, []);

  const openEditForm = useCallback((id: string) => {
    setEditingId(id);
    setView("form");
  }, []);

  const closeForm = useCallback(() => {
    setEditingId(null);
    setView("list");
  }, []);

  const handleDelete = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleFormSubmit = useCallback(() => {
    closeForm();
  }, [closeForm]);

  if (view === "form") {
    return (
      <div className="account-addresses">
        <div className="account-my_address">
          <p className="h6 fw-medium mb-20">
            {editingId ? "Edit address" : "Register new address"}
          </p>
          <AccountAddressForm
            submitLabel={editingId ? "Update Address" : "Save Address"}
            onCancel={closeForm}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="account-addresses">
      {addresses.length > 0 ? (
        <ul className="account-address-list">
          {addresses.map((address) => (
            <li key={address.id}>
              <AccountAddressCard
                address={address}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="cl-text-2 mb-20">No saved addresses yet.</p>
      )}

      <button
        type="button"
        className="tf-btn animate-btn account-addresses__add-btn"
        onClick={openAddForm}
      >
        Add new address
      </button>
    </div>
  );
}