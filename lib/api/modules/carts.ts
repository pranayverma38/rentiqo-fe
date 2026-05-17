import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";
import { QueryParams } from "@/lib/api/types";
import {
  MedusaCartMutationResponse,
  MedusaCartResponse,
} from "@/lib/api/types/medusa";
import { unwrapMedusaCartResponse } from "@/lib/cart/mapMedusaCart";

const CART_FIELDS =
  "id,*items,subtotal,total,tax_total,shipping_total,currency_code,customer_id,region_id,email";

export class CartsApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async create(payload: Record<string, unknown>): Promise<MedusaCartResponse> {
    return this.httpClient.post<Record<string, unknown>, MedusaCartResponse>(
      medusaStoreEndpoints.carts,
      payload,
    );
  }

  async retrieve(cartId: string, params?: QueryParams): Promise<MedusaCartResponse> {
    return this.httpClient.get<MedusaCartResponse>(
      `${medusaStoreEndpoints.carts}/${cartId}`,
      {
        params: { fields: CART_FIELDS, ...params },
      },
    );
  }

  async update(
    cartId: string,
    payload: Record<string, unknown>,
  ): Promise<MedusaCartResponse> {
    return this.httpClient.post<Record<string, unknown>, MedusaCartResponse>(
      `${medusaStoreEndpoints.carts}/${cartId}`,
      payload,
    );
  }

  async addLineItem(
    cartId: string,
    payload: { variant_id: string; quantity: number; metadata?: Record<string, unknown> },
  ): Promise<MedusaCartResponse> {
    return this.httpClient.post<
      { variant_id: string; quantity: number; metadata?: Record<string, unknown> },
      MedusaCartResponse
    >(`${medusaStoreEndpoints.carts}/${cartId}/line-items`, payload);
  }

  async updateLineItem(
    cartId: string,
    lineId: string,
    payload: { quantity: number; metadata?: Record<string, unknown> },
  ): Promise<MedusaCartResponse> {
    return this.httpClient.post<
      { quantity: number; metadata?: Record<string, unknown> },
      MedusaCartResponse
    >(
      `${medusaStoreEndpoints.carts}/${cartId}/line-items/${lineId}`,
      payload,
    );
  }

  async removeLineItem(cartId: string, lineId: string): Promise<MedusaCartResponse> {
    const response = await this.httpClient.delete<MedusaCartMutationResponse>(
      `${medusaStoreEndpoints.carts}/${cartId}/line-items/${lineId}`,
    );
    return { cart: unwrapMedusaCartResponse(response) };
  }

  async transferToCustomer(cartId: string): Promise<MedusaCartResponse> {
    return this.httpClient.post<Record<string, never>, MedusaCartResponse>(
      `${medusaStoreEndpoints.carts}/${cartId}/customer`,
      {},
    );
  }
}
