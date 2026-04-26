import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";
import { QueryParams } from "@/lib/api/types";

export class ProductsApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  /**
   * Foundation call for product listing.
   * Add precise response typing once backend fields are finalized.
   */
  async list(params?: QueryParams): Promise<unknown> {
    return this.httpClient.get(medusaStoreEndpoints.products, { params });
  }

  /**
   * Foundation call for product details by id.
   */
  async retrieve(productId: string, params?: QueryParams): Promise<unknown> {
    return this.httpClient.get(`${medusaStoreEndpoints.products}/${productId}`, {
      params,
    });
  }
}

