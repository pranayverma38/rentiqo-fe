import Image from "next/image";
import Link from "next/link";

import {
  formatDeliveryHeadline,
  formatDeliveryFooterDate,
  formatInr,
  formatOrderItemsDetailLine,
  formatRentPerMonthDisplay,
  getAccountOrderStatusClass,
  getDeliveryFooterLabel,
  type AccountOrder,
} from "@/components/account/account-orders/accountOrdersData";

type AccountOrderDetailProps = {
  order: AccountOrder;
};

export default function AccountOrderDetail({ order }: AccountOrderDetailProps) {
  const statusClass = getAccountOrderStatusClass(order.status);
  const { delivery, payment } = order;

  return (
    <div className="account-order-detail w-full min-w-0">
      <section className="account-order-detail__hero account-my_address">
        <div className="account-order-detail__hero-top">
          <span
            className={`account-orders__status fw-medium ${statusClass}`}
          >
            {order.statusLabel}
          </span>
          <p className="account-order-detail__order-id cl-text-2 mb-0">
            Order ID: <span className="fw-medium">{order.orderNumber}</span>
          </p>
        </div>
        <p className="account-order-detail__delivery-headline fw-medium mb-0">
          {formatDeliveryHeadline(order)}
        </p>
      </section>

      <section className="account-order-detail__section">
        <h6 className="account-order-detail__section-title fw-medium mb-16">
          Items Details:{" "}
          {formatOrderItemsDetailLine(order.itemCount, order.billingCycle)}
        </h6>
        <ul className="account-order-detail__item-list">
          {order.items.map((item) => (
            <li key={item.id}>
              <article className="account-order-detail__item">
                <div className="account-order-detail__item-thumb">
                  <Image
                    src={item.image}
                    alt=""
                    width={80}
                    height={80}
                    className="account-order-detail__item-image"
                  />
                  <span className="account-order-detail__item-qty fw-medium">
                    {item.quantity}x
                  </span>
                </div>
                <div className="account-order-detail__item-body">
                  <p className="account-order-detail__item-name fw-medium mb-0">
                    {item.name}
                  </p>
                  <p className="account-order-detail__item-meta cl-text-2 mb-0">
                    Subscription tenure:{" "}
                    <span className="fw-medium">{item.subscriptionTenure}</span>
                  </p>
                  <p className="account-order-detail__item-meta cl-text-2 mb-0">
                    Per month rent:{" "}
                    <span className="fw-semibold">
                      {formatInr(item.rentPerMonth, { decimals: 2 })}
                    </span>
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="account-order-detail__items-total cl-text-2 mb-0">
          Total rent per month:{" "}
          <span className="fw-semibold">
            {formatRentPerMonthDisplay(
              order.rentPerMonth,
              order.rentPerMonthRounded,
            )}
          </span>
        </p>
      </section>

      <section className="account-order-detail__section account-my_address">
        <h6 className="account-order-detail__section-title fw-medium mb-16">
          Delivery Details
        </h6>
        <dl className="account-order-detail__dl">
          <DetailRow label="Ordered On:" value={delivery.orderedOn} />
          <DetailRow label="Delivery To:" value={delivery.recipientName} />
          <DetailRow label="Address:" value={delivery.address} />
          <DetailRow label="Phone:" value={delivery.phone} />
          <DetailRow
            label={getDeliveryFooterLabel(order)}
            value={formatDeliveryFooterDate(order)}
          />
        </dl>
      </section>

      <section className="account-order-detail__section account-my_address">
        <h6 className="account-order-detail__section-title fw-medium mb-16">
          Payment Details
        </h6>
        <p className="account-order-detail__paid-via cl-text-2 mb-12">
          Paid via{" "}
          <span className="fw-medium">{payment.paymentMethod}</span>
        </p>
        <div className="account-order-detail__paid-row">
          <span className="fw-medium">Total Amount Paid</span>
          <span className="fw-semibold">
            {formatInr(payment.totalAmountPaid)}
          </span>
        </div>
        <Link
          href={payment.invoiceHref}
          className="account-order-detail__invoice-link"
        >
          View invoice
        </Link>

        <details className="account-order-detail__breakdown">
          <summary className="account-order-detail__breakdown-trigger fw-medium">
            View Price Breakdown
            <i className="icon icon-CaretDown" aria-hidden />
          </summary>
          <dl className="account-order-detail__breakdown-list">
            <BreakdownRow
              label="Advance Rent amount"
              value={formatInr(payment.advanceRent)}
            />
            <BreakdownRow
              label="Delivery & Installation cost amount"
              value={formatInr(payment.deliveryInstallation)}
            />
            <BreakdownRow label="GST amount" value={formatInr(payment.gst)} />
          </dl>
        </details>

        <div className="account-order-detail__payable">
          <span className="fw-medium">Total Payable amount</span>
          <span className="fw-semibold">
            {formatInr(payment.totalPayable)}
          </span>
        </div>
      </section>

      <div className="account-order-detail__actions">
        <Link
          href="/account-manage-subscription"
          className="tf-btn animate-btn small account-order-detail__manage-btn"
        >
          Manage subscription
        </Link>
        <Link
          href="/account-orders"
          className="tf-btn btn-stroke small account-order-detail__back-btn d-none d-md-inline-flex"
        >
          Back to orders
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="account-order-detail__row">
      <dt className="account-order-detail__label fw-medium">{label}</dt>
      <dd className="account-order-detail__value cl-text-2 mb-0">{value}</dd>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="account-order-detail__breakdown-row">
      <dt className="cl-text-2 mb-0">{label}</dt>
      <dd className="fw-medium mb-0">{value}</dd>
    </div>
  );
}
