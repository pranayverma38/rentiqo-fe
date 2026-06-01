import Image from "next/image";
import Link from "next/link";

import {
  formatInr,
  formatOrderCardSummaryLine,
  getAccountOrderStatusClass,
  getOrderTotalAmountDeposited,
  type AccountOrder,
} from "@/components/account/account-orders/accountOrdersData";

type AccountOrderCardProps = {
  order: AccountOrder;
};

export default function AccountOrderCard({ order }: AccountOrderCardProps) {
  const statusClass = getAccountOrderStatusClass(order.status);
  const orderDetailHref = `/account-orders/${order.id}`;

  return (
    <article className="account-orders__card">
      <Link
        href={orderDetailHref}
        className="account-orders__card-link"
        aria-label={`View order ${order.orderNumber}`}
      >
        <header className="account-orders__card-header">
          <div className="account-orders__card-header-top">
            <span
              className={`account-orders__status fw-medium ${statusClass}`}
            >
              {order.statusLabel}
            </span>
            <span
              className="account-orders__manage-placeholder"
              aria-hidden
            />
          </div>
        </header>

        <p className="account-orders__summary cl-text-2 mb-0">
          <span>
            {formatOrderCardSummaryLine(
              order.itemCount,
              order.billingCycle,
              order.rentPerMonthRounded,
            )}
          </span>
        </p>

        <p className="account-orders__deposit cl-text-2 mb-0">
          Amount deposited (total):{" "}
          <span className="fw-semibold">
            {formatInr(getOrderTotalAmountDeposited(order))}
          </span>
        </p>

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

      <Link
        href="/account-manage-subscription"
        className="tf-btn animate-btn small account-orders__manage-btn"
        onClick={(e) => e.stopPropagation()}
      >
        Manage subscription
      </Link>
    </article>
  );
}
