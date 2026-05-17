"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { AccountSection } from "@/components/account/AccountSection";
import { useCustomerOrders } from "@/lib/hooks/useCustomerOrders";
import { mapMedusaOrderToUi } from "@/lib/orders/mapMedusaOrder";

const ORDER_TABS = [
  { id: "all-order", label: "All Order" },
  { id: "pending", label: "Pending" },
  { id: "delivery", label: "Delivery" },
  { id: "completed", label: "Completed" },
  { id: "canceled", label: "Canceled" },
] as const;

const DEFAULT_TAB_ID = "all-order";

export default function AccountOrders() {
  const [activeTabId, setActiveTabId] = useState<string>(DEFAULT_TAB_ID);
  const { orders, loading, error } = useCustomerOrders();

  const uiOrders = useMemo(() => orders.map(mapMedusaOrderToUi), [orders]);

  const visibleOrders = useMemo(() => {
    if (activeTabId === "all-order") return uiOrders;
    return uiOrders.filter((o) => o.status === activeTabId);
  }, [activeTabId, uiOrders]);

  return (
    <AccountSection
      title="Your Orders"
      sectionClassName="flat-spacing flat-animate-tab"
    >
      <div className="account-my_order">
        <ul className="tab-btn-wrap-v1 style-2" role="tablist">
          {ORDER_TABS.map((tab) => (
            <li key={tab.id} className="nav-tab-item" role="presentation">
              <a
                href="#"
                role="tab"
                aria-selected={tab.id === activeTabId}
                className={`tf-btn-tab ${tab.id === activeTabId ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTabId(tab.id);
                }}
              >
                <span className="h6 fw-medium">{tab.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane fade active show"
            role="tabpanel"
            id={activeTabId}
          >
            {error ? <p className="text-primary mb-20">{error}</p> : null}
            {loading ? <p className="cl-text-2 mb-20">Loading orders…</p> : null}
            {!loading && visibleOrders.length === 0 ? (
              <p className="cl-text-2 mb-20">No orders yet.</p>
            ) : null}
            <div className="my-order_list d-grid gap-24">
              {visibleOrders.map((order, orderIdx) => (
                <div
                  key={order.id}
                  className="wg-my-order"
                >
                  <div className="order-heading">
                    <div className="order_number fw-medium">
                      Order Number:
                      <span className="number-code fw-semibold">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="order_status fw-medium">
                      Order Status:
                      <div
                        className={`tb-order_status text-label ${order.statusClass}`}
                      >
                        {order.statusLabel}
                      </div>
                    </div>
                  </div>
                  <div className="order-content">
                    {order.items.map((item, i) => (
                      <div
                        key={`${order.orderNumber}-${order.status}-${orderIdx}-${i}`}
                        className="order_prd_item"
                      >
                        <div className="prd__image">
                          <Image
                            loading="lazy"
                            width={100}
                            height={100}
                            src={item.img}
                            alt=""
                          />
                        </div>
                        <div className="prd__info">
                          <p className="name fw-medium">{item.name}</p>
                          <p className="type cl-text-2">{item.variant}</p>
                        </div>
                        <div className="prd__price fw-medium">
                          <span className="quantity">{item.qty}</span>x
                          <span className="price">{item.price}</span>
                        </div>
                      </div>
                    ))}
                    <div className="group-btn">
                      <a
                        href="#orderDetail"
                        data-bs-toggle="modal"
                        className="action-order tf-btn small animate-btn"
                      >
                        Order Details
                      </a>
                      {order.showCancelOrder ? (
                        <a
                          href="#"
                          className="action-order tf-btn btn-stroke small"
                        >
                          Cancel Order
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AccountSection>
  );
}
