import type { MedusaOrder } from "@/lib/api/types/medusa";
import { formatPrice } from "@/utils/formatPrice";

export type UiOrderStatus = "pending" | "delivery" | "completed" | "canceled";

export type UiOrderLineItem = {
  img: string;
  name: string;
  variant: string;
  qty: number;
  price: string;
};

export type UiOrderRow = {
  id: string;
  orderNumber: string;
  status: UiOrderStatus;
  statusLabel: string;
  statusClass: string;
  showCancelOrder: boolean;
  items: UiOrderLineItem[];
};

const PLACEHOLDER_IMG = "/assets/images/product/square/product-1.jpg";

function mapStatus(status?: string | null): {
  status: UiOrderStatus;
  label: string;
  className: string;
} {
  const normalized = (status ?? "pending").toLowerCase();
  if (normalized.includes("cancel")) {
    return { status: "canceled", label: "Canceled", className: "stt-canceled" };
  }
  if (normalized === "completed" || normalized === "archived") {
    return { status: "completed", label: "Completed", className: "stt-completed" };
  }
  if (
    normalized.includes("fulfill") ||
    normalized.includes("ship") ||
    normalized.includes("delivery")
  ) {
    return { status: "delivery", label: "Delivery", className: "stt-delivery" };
  }
  return { status: "pending", label: "Pending", className: "stt-pending" };
}

export function mapMedusaOrderToUi(order: MedusaOrder): UiOrderRow {
  const mappedStatus = mapStatus(order.status);
  const orderNumber =
    order.display_id != null ? String(order.display_id) : order.id.slice(-8);

  const items: UiOrderLineItem[] = (order.items ?? []).map((item) => ({
    img: item.thumbnail ?? PLACEHOLDER_IMG,
    name: item.title ?? "Product",
    variant: item.variant_title ?? "",
    qty: item.quantity ?? 1,
    price: formatPrice(item.unit_price ?? 0),
  }));

  return {
    id: order.id,
    orderNumber,
    status: mappedStatus.status,
    statusLabel: mappedStatus.label,
    statusClass: mappedStatus.className,
    showCancelOrder: mappedStatus.status === "pending",
    items: items.length > 0 ? items : [
      {
        img: PLACEHOLDER_IMG,
        name: "Order items",
        variant: "",
        qty: 1,
        price: formatPrice(order.total ?? 0),
      },
    ],
  };
}
