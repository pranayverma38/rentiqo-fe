"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { AccountSection } from "@/components/account/AccountSection";
import { useAuth } from "@/context/AuthProvider";
import { useCustomerOrders } from "@/lib/hooks/useCustomerOrders";
import { mapMedusaOrderToUi } from "@/lib/orders/mapMedusaOrder";
import TfSwiper from "@/components/ui/TfSwiper";
import { accountStats } from "@/data/account_stats";

export default function AccountDashboard() {
  const { customer } = useAuth();
  const { orders, loading } = useCustomerOrders(5);

  const recentOrders = useMemo(() => orders.slice(0, 3).map(mapMedusaOrderToUi), [orders]);

  const greetingName =
    customer?.first_name?.trim() ||
    customer?.email?.split("@")[0] ||
    "there";

  const stats = useMemo(() => {
    const base = [...accountStats];
    if (base[0]) {
      base[0] = { ...base[0], count: String(orders.length) };
    }
    return base;
  }, [orders.length]);

  return (
    <AccountSection title={`Hello, ${greetingName}`}>
      <div className="acount-order_stats">
        <TfSwiper
          preview={3}
          tablet={3}
          mobileSm={2}
          mobile={1}
          spaceLg={20}
          spaceMd={15}
          space={10}
          paginationLg={3}
          paginationMd={3}
          paginationSm={2}
          pagination={1}
          paginationClassName="sw-dot-default tf-sw-pagination"
        >
          {stats.map((stat, index) => (
            <div key={index} className="order-box">
              <div className="order_info">
                <p className="info__label cl-text-2">{stat.label}</p>
                <h5 className="info__count type-semibold">{stat.count}</h5>
              </div>
              <div className="order_icon">
                <i className={`icon ${stat.iconClass}`} />
              </div>
            </div>
          ))}
        </TfSwiper>
      </div>
      <div className="account-my_recent">
        <h6 className="title-case">Recent Orders</h6>
        {loading ? <p className="cl-text-2 py-3">Loading orders…</p> : null}
        {!loading && recentOrders.length === 0 ? (
          <p className="cl-text-2 py-3">
            No orders yet.{" "}
            <Link href="/delhi" className="text-primary">
              Browse catalog
            </Link>
          </p>
        ) : null}
        {recentOrders.length > 0 ? (
          <div className="overflow-auto">
            <table className="table-my_recent">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Products</th>
                  <th>Pricing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const firstItem = order.items[0];
                  return (
                    <tr key={order.id} className="tb-order-item">
                      <td className="tb-order_code fw-medium">{order.orderNumber}</td>
                      <td>
                        <div className="tb-order_product">
                          <span className="img-prd">
                            <Image
                              loading="lazy"
                              width={48}
                              height={48}
                              src={firstItem?.img ?? "/assets/images/product/square/product-1.jpg"}
                              alt=""
                            />
                          </span>
                          <span className="name fw-medium">
                            {firstItem?.name ?? "Order"}
                          </span>
                        </div>
                      </td>
                      <td className="tb-order_price fw-medium">
                        {firstItem?.price ?? "—"}
                      </td>
                      <td>
                        <div
                          className={`tb-order_status text-label ${order.statusClass}`}
                        >
                          {order.statusLabel}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        <Link href="/account-orders" className="tf-btn btn-stroke small mt-20">
          View all orders
        </Link>
      </div>
    </AccountSection>
  );
}
