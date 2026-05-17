import { MedusaHttpClient } from "@/lib/api/client";
import { medusaStoreEndpoints } from "@/lib/api/endpoints";
import {
  MedusaAddress,
  MedusaCustomerAddressesResponse,
  MedusaCustomerResponse,
} from "@/lib/api/types/medusa";

export type CreateCustomerPayload = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  metadata?: Record<string, unknown>;
};

export type UpdateCustomerPayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  metadata?: Record<string, unknown>;
};

export class CustomersApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async create(payload: CreateCustomerPayload): Promise<MedusaCustomerResponse> {
    return this.httpClient.post<CreateCustomerPayload, MedusaCustomerResponse>(
      medusaStoreEndpoints.customers,
      payload,
    );
  }

  async retrieve(): Promise<MedusaCustomerResponse> {
    return this.httpClient.get<MedusaCustomerResponse>(
      `${medusaStoreEndpoints.customers}/me`,
    );
  }

  async update(payload: UpdateCustomerPayload): Promise<MedusaCustomerResponse> {
    return this.httpClient.post<UpdateCustomerPayload, MedusaCustomerResponse>(
      `${medusaStoreEndpoints.customers}/me`,
      payload,
    );
  }

  async listAddresses(params?: {
    limit?: number;
    offset?: number;
  }): Promise<MedusaCustomerAddressesResponse> {
    return this.httpClient.get<MedusaCustomerAddressesResponse>(
      `${medusaStoreEndpoints.customers}/me/addresses`,
      { params },
    );
  }

  async createAddress(payload: MedusaAddress): Promise<MedusaCustomerResponse> {
    return this.httpClient.post<MedusaAddress, MedusaCustomerResponse>(
      `${medusaStoreEndpoints.customers}/me/addresses`,
      payload,
    );
  }

  async updateAddress(
    addressId: string,
    payload: MedusaAddress,
  ): Promise<MedusaCustomerResponse> {
    return this.httpClient.post<MedusaAddress, MedusaCustomerResponse>(
      `${medusaStoreEndpoints.customers}/me/addresses/${addressId}`,
      payload,
    );
  }

  async deleteAddress(addressId: string): Promise<void> {
    await this.httpClient.delete<void>(
      `${medusaStoreEndpoints.customers}/me/addresses/${addressId}`,
    );
  }
}
