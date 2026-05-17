export type MedusaAuthTokenResponse = {
  token: string;
};

export type MedusaAuthContext = {
  actor_id?: string;
  actor_type?: string;
  auth_identity_id?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

export type MedusaAuthSessionResponse = {
  user: MedusaAuthContext;
};

export type MedusaCustomer = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  company_name?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

export type MedusaCustomerResponse = {
  customer: MedusaCustomer;
};

export type MedusaAddress = {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  country_code?: string | null;
  province?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  address_name?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
};

export type MedusaCartLineItem = {
  id: string;
  variant_id?: string | null;
  product_id?: string | null;
  title?: string | null;
  product_title?: string | null;
  thumbnail?: string | null;
  quantity: number;
  unit_price?: number | null;
  subtotal?: number | null;
  metadata?: Record<string, unknown> | null;
};

export type MedusaCart = {
  id: string;
  email?: string | null;
  region_id?: string | null;
  customer_id?: string | null;
  currency_code?: string | null;
  items?: MedusaCartLineItem[] | null;
  subtotal?: number | null;
  total?: number | null;
  tax_total?: number | null;
  shipping_total?: number | null;
  metadata?: Record<string, unknown> | null;
};

export type MedusaCartResponse = {
  cart: MedusaCart;
};

/** Some cart mutations (e.g. delete line item) return the cart as `parent`. */
export type MedusaCartMutationResponse = {
  cart?: MedusaCart;
  parent?: MedusaCart;
};

export type MedusaCustomerAddressesResponse = {
  addresses: MedusaAddress[];
  count?: number;
  limit?: number;
  offset?: number;
};

export type MedusaOrderLineItem = {
  id: string;
  title?: string | null;
  thumbnail?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
  variant_title?: string | null;
};

export type MedusaOrder = {
  id: string;
  display_id?: number | null;
  status?: string | null;
  email?: string | null;
  currency_code?: string | null;
  total?: number | null;
  created_at?: string | null;
  items?: MedusaOrderLineItem[] | null;
};

export type MedusaOrdersListResponse = {
  orders: MedusaOrder[];
  count?: number;
  offset?: number;
  limit?: number;
};

export type MedusaOrderResponse = {
  order: MedusaOrder;
};

export const WISHLIST_METADATA_KEY = "wishlist_product_ids";
export const CART_ID_METADATA_KEY = "active_cart_id";
