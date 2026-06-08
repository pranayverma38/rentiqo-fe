"use client";

import type { AccountAddress } from "@/components/account/account-addresses/types";

type AccountAddressCardProps = {
  address: AccountAddress;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function AccountAddressCard({
  address,
  onEdit,
  onDelete,
}: AccountAddressCardProps) {
  return (
    <article className="account-address-card">
      <div className="account-address-card__header">
        <h6 className="account-address-card__name fw-semibold mb-0">
          {address.name}
        </h6>
        <div className="account-address-card__actions">
          <button
            type="button"
            className="account-address-card__action"
            aria-label={`Edit address for ${address.name}`}
            onClick={() => onEdit(address.id)}
          >
            <i className="icon icon-NotePencil" aria-hidden />
          </button>
          <button
            type="button"
            className="account-address-card__action account-address-card__action--danger"
            aria-label={`Delete address for ${address.name}`}
            onClick={() => onDelete(address.id)}
          >
            <i className="icon icon-trash" aria-hidden />
          </button>
        </div>
      </div>
      <p className="account-address-card__line cl-text-2 mb-0">{address.address}</p>
      <p className="account-address-card__phone fw-medium mb-0">{address.phone}</p>
    </article>
  );
}