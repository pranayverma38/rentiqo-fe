import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";

export class RegionsApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async list(): Promise<unknown> {
    return this.httpClient.get(medusaStoreEndpoints.regions);
  }
}

