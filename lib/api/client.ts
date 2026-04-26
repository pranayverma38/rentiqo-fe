import axios, { AxiosInstance } from "axios";

import { medusaApiConfig } from "@/lib/api/config";
import { ApiError, toApiError } from "@/lib/api/errors";
import { ApiRequestOptions } from "@/lib/api/types";

const HEADER_CONTENT_TYPE = "Content-Type";
const HEADER_ACCEPT = "Accept";
const HEADER_X_PUBLISHABLE_API_KEY = "x-publishable-api-key";
const HEADER_AUTHORIZATION = "Authorization";

export class MedusaHttpClient {
  private readonly client: AxiosInstance;
  private authToken?: string;

  constructor() {
    const versionPath = medusaApiConfig.apiVersion
      ? `/${medusaApiConfig.apiVersion.replace(/^\/+/, "")}`
      : "";

    this.client = axios.create({
      baseURL: `${medusaApiConfig.baseUrl}${versionPath}`,
      timeout: medusaApiConfig.timeoutMs,
      headers: {
        [HEADER_ACCEPT]: "application/json",
        [HEADER_CONTENT_TYPE]: "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      if (medusaApiConfig.publishableApiKey) {
        config.headers.set(
          HEADER_X_PUBLISHABLE_API_KEY,
          medusaApiConfig.publishableApiKey,
        );
      }

      if (this.authToken) {
        config.headers.set(HEADER_AUTHORIZATION, `Bearer ${this.authToken}`);
      }

      return config;
    });
  }

  setAuthToken(token?: string): void {
    this.authToken = token;
  }

  async get<TResponse>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    try {
      const response = await this.client.get<TResponse>(path, options);
      return response.data;
    } catch (error) {
      throw toApiError(error);
    }
  }

  async post<TRequest, TResponse>(
    path: string,
    payload?: TRequest,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    try {
      const response = await this.client.post<TResponse>(path, payload, options);
      return response.data;
    } catch (error) {
      throw toApiError(error);
    }
  }

  async put<TRequest, TResponse>(
    path: string,
    payload?: TRequest,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    try {
      const response = await this.client.put<TResponse>(path, payload, options);
      return response.data;
    } catch (error) {
      throw toApiError(error);
    }
  }

  async delete<TResponse>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    try {
      const response = await this.client.delete<TResponse>(path, options);
      return response.data;
    } catch (error) {
      throw toApiError(error);
    }
  }
}

export function assertMedusaApiConfigured(): void {
  if (!medusaApiConfig.baseUrl) {
    throw new ApiError(
      "Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL. Add it to your environment variables.",
    );
  }
}

