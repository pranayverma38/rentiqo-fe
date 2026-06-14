import type { CartProduct } from "@/context/store";
import { useStore } from "@/context/store";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import type { LocationSlug } from "@/lib/catalog/catalogRoutes";
import {
  buildMedusaProductDetailVariants,
  durationOptionValuesFromMedusa,
  fetchRentiqoStoreProductByIdOrHandle,
  findMedusaVariantByOptions,
} from "@/lib/catalog/rentiqoStoreCatalog";
import { changeMedusaCartTenureForMonths } from "@/lib/cart/medusaCartSync";
import { getDepositAmount } from "@/utils/formatPrice";

export const CART_TENURE_MONTHS = [3, 6, 12] as const;
export type CartTenureMonths = (typeof CART_TENURE_MONTHS)[number];

export const CART_TENURE_OFFCANVAS_ID = "cartTenureSelector";

function durationSortKey(value: string): number {
  const match = value.match(/(\d+)/);
  return match != null ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

export function parseDurationMonths(
  raw: string | null | undefined,
): CartTenureMonths | null {
  if (!raw) {
    return null;
  }
  const months = durationSortKey(raw.replace(/\s+/g, "").toLowerCase());
  if (months === 3 || months === 6 || months === 12) {
    return months;
  }
  return null;
}

export function tenureLabelForMonths(months: CartTenureMonths): string {
  return `${months} Months`;
}

function resolveDurationApiValue(
  product: NonNullable<
    Awaited<ReturnType<typeof fetchRentiqoStoreProductByIdOrHandle>>
  >,
  months: CartTenureMonths,
): string | null {
  const values = durationOptionValuesFromMedusa(product);
  return values.find((value) => durationSortKey(value) === months) ?? null;
}

export async function resolveCartLineForTenure(
  item: CartProduct,
  months: CartTenureMonths,
  location: LocationSlug,
): Promise<CartProduct | null> {
  const lookupId = String(item.medusaProductId ?? item.id);
  const product = await fetchRentiqoStoreProductByIdOrHandle(lookupId, location);
  if (product == null) {
    return null;
  }

  const durationValue = resolveDurationApiValue(product, months);
  if (durationValue == null) {
    return null;
  }

  const variants = buildMedusaProductDetailVariants(product);
  const currentVariant = variants.find(
    (variant) => variant.id === String(item.medusaVariantId ?? item.id),
  );
  const selection = {
    duration: durationValue,
    ...(currentVariant?.optionValues.color
      ? { color: currentVariant.optionValues.color }
      : item.selectedColor
        ? { color: item.selectedColor }
        : {}),
    ...(currentVariant?.optionValues.size
      ? { size: currentVariant.optionValues.size }
      : {}),
  };

  const nextVariant = findMedusaVariantByOptions(variants, selection);
  if (
    nextVariant == null ||
    nextVariant.id === String(item.medusaVariantId ?? item.id)
  ) {
    return null;
  }

  return {
    ...item,
    id: nextVariant.id,
    medusaVariantId: nextVariant.id,
    price: nextVariant.price,
    priceOld: nextVariant.priceOld,
    depositAmount: getDepositAmount(nextVariant.price),
    selectedSize: durationValue,
    selectedColor: nextVariant.optionValues.color ?? item.selectedColor,
  };
}

export async function changeCartTenure(months: CartTenureMonths): Promise<void> {
  const { cartProducts, selectedLocation } = useStore.getState();
  if (cartProducts.length === 0) {
    return;
  }

  if (hasMedusaApiBaseUrl) {
    await changeMedusaCartTenureForMonths(months, selectedLocation);
    return;
  }

  const updated = await Promise.all(
    cartProducts.map(async (item) => {
      const next = await resolveCartLineForTenure(item, months, selectedLocation);
      return next ?? item;
    }),
  );
  useStore.getState().setCartProducts(updated);
}
