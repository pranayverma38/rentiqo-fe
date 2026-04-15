import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";
import { QueryParams } from "@/lib/api/types";

export class CartsApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async create(payload: Record<string, unknown>): Promise<unknown> {
    return this.httpClient.post(medusaStoreEndpoints.carts, payload);
  }

  async retrieve(cartId: string, params?: QueryParams): Promise<unknown> {
    return this.httpClient.get(`${medusaStoreEndpoints.carts}/${cartId}`, {
      params,
    });
  }

  async update(
    cartId: string,
    payload: Record<string, unknown>,
  ): Promise<unknown> {
    return this.httpClient.post(
      `${medusaStoreEndpoints.carts}/${cartId}`,
      payload,
    );
  }
}

