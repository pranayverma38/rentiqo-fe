import { Metadata } from "next";
import { notFound } from "next/navigation";

import AccountOrderDetail from "@/components/account/account-orders/AccountOrderDetail";
import { getAccountOrderById } from "@/components/account/account-orders/accountOrdersData";

type AccountOrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({
  params,
}: AccountOrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const order = getAccountOrderById(orderId);

  return {
    title: order
      ? `Order ${order.orderNumber} | Rentiqo`
      : "Order Details | Rentiqo",
    description: "View rental order details",
  };
}

export default async function AccountOrderDetailPage({
  params,
}: AccountOrderDetailPageProps) {
  const { orderId } = await params;
  const order = getAccountOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <AccountOrderDetail order={order} />;
}
