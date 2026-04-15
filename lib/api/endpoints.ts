/**
 * Canonical endpoint prefixes for storefront API modules.
 *
 * Keep route pieces centralized so future API versioning
 * or namespace changes happen in one place.
 */
export const medusaStoreEndpoints = {
  products: "/store/products",
  collections: "/store/collections",
  categories: "/store/product-categories",
  regions: "/store/regions",
  carts: "/store/carts",
  customers: "/store/customers",
  orders: "/store/orders",
  custom: "/store/custom",
} as const;

