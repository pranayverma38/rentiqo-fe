import Image from "next/image";
import Link from "next/link";

import {
  formatOrderMetaLine,
  formatRentPerMonthDisplay,
  getAccountOrderStatusClass,
  type AccountOrder,
} from "@/components/account/account-orders/accountOrdersData";

type AccountOrderCardProps = {
  order: AccountOrder;
};

export default function AccountOrderCard({ order }: AccountOrderCardProps) {
  const statusClass = getAccountOrderStatusClass(order.status);

  return (
    <article className="account-orders__card">
      <Link
        href={`/account-orders/${order.id}`}
        className="account-orders__card-link"
      >
        <header className="account-orders__card-header">
          <span
            className={`account-orders__status fw-medium ${statusClass}`}
          >
            {order.statusLabel}
          </span>
          <p className="account-orders__meta cl-text-2 mb-0">
            {formatOrderMetaLine(order.itemCount, order.billingCycle)}
          </p>
          <p className="account-orders__rent mb-0">
            <span className="account-orders__rent-label cl-text-2">
              Rent per month:{" "}
            </span>
            <span className="account-orders__rent-value fw-semibold">
              {formatRentPerMonthDisplay(
                order.rentPerMonth,
                order.rentPerMonthRounded,
              )}
            </span>
          </p>
        </header>

        <div className="account-orders__items-box" aria-label="Order items">
          {order.items.map((item) => (
            <div key={item.id} className="account-orders__item-thumb">
              <Image
                src={item.image}
                alt=""
                width={72}
                height={72}
                className="account-orders__item-image"
              />
              <span className="account-orders__item-qty fw-medium">
                {item.quantity}x
              </span>
            </div>
          ))}
        </div>
      </Link>

      <footer className="account-orders__card-footer">
        <Link
          href="/account-manage-subscription"
          className="tf-btn animate-btn small account-orders__manage-btn"
        >
          Manage subscription
        </Link>
      </footer>
    </article>
  );
}
