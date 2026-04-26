import { MedusaHttpClient } from "@/lib/api/client";
import { medusaApiConfig } from "@/lib/api/config";
import { CartsApi } from "@/lib/api/modules/carts";
import { CustomApi } from "@/lib/api/modules/custom";
import { CustomersApi } from "@/lib/api/modules/customers";
import { OrdersApi } from "@/lib/api/modules/orders";
import { ProductsApi } from "@/lib/api/modules/products";
import { RegionsApi } from "@/lib/api/modules/regions";

export function createMedusaApi() {
  const httpClient = new MedusaHttpClient();
  return {
    config: medusaApiConfig,
    client: httpClient,
    products: new ProductsApi(httpClient),
    carts: new CartsApi(httpClient),
    customers: new CustomersApi(httpClient),
    orders: new OrdersApi(httpClient),
    regions: new RegionsApi(httpClient),
    custom: new CustomApi(httpClient),
  };
}

export const medusaApi = createMedusaApi();

export type MedusaApi = typeof medusaApi;

