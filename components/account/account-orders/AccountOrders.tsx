"use client";

import AccountOrderCard from "@/components/account/account-orders/AccountOrderCard";
import { MOCK_ACCOUNT_ORDERS } from "@/components/account/account-orders/accountOrdersData";

export default function AccountOrders() {
  return (
    <div className="account-orders w-full min-w-0">
      <p className="cl-text-2 mb-20">
        View your rental orders, track delivery status, and manage subscriptions
        from one place.
      </p>

      {MOCK_ACCOUNT_ORDERS.length > 0 ? (
        <ul className="account-orders__list">
          {MOCK_ACCOUNT_ORDERS.map((order) => (
            <li key={order.id}>
              <AccountOrderCard order={order} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="cl-text-2 mb-0">No orders yet.</p>
      )}
    </div>
  );
}