import type { CartProduct } from "@/context/store";
import { getDepositAmount } from "@/utils/formatPrice";

export function getCartLineUnitDeposit(item: CartProduct): number {
  return item.depositAmount ?? getDepositAmount(item.price);
}

export function getCartLineDeposit(item: CartProduct): number {
  return getCartLineUnitDeposit(item) * item.quantity;
}

export function getCartTotalDeposit(items: CartProduct[]): number {
  return items.reduce((sum, item) => sum + getCartLineDeposit(item), 0);
}
