import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";

export class CustomersApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async retrieve(): Promise<unknown> {
    return this.httpClient.get(`${medusaStoreEndpoints.customers}/me`);
  }

  async update(payload: Record<string, unknown>): Promise<unknown> {
    return this.httpClient.post(
      `${medusaStoreEndpoints.customers}/me`,
      payload,
    );
  }
}

