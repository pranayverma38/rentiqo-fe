import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";
import { QueryParams } from "@/lib/api/types";

export class OrdersApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async list(params?: QueryParams): Promise<unknown> {
    return this.httpClient.get(medusaStoreEndpoints.orders, { params });
  }

  async retrieve(orderId: string, params?: QueryParams): Promise<unknown> {
    return this.httpClient.get(`${medusaStoreEndpoints.orders}/${orderId}`, {
      params,
    });
  }
}

