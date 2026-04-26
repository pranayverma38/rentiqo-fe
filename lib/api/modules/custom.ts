import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";

/**
 * Backend-specific route from `rentiqo`:
 * GET /store/custom
 */
export class CustomApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async healthCheck(): Promise<void> {
    await this.httpClient.get<void>(medusaStoreEndpoints.custom);
  }
}

