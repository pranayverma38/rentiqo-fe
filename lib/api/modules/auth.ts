import { MedusaHttpClient } from "@/lib/api/client";
import {
  MedusaAuthSessionResponse,
  MedusaAuthTokenResponse,
} from "@/lib/api/types/medusa";

const CUSTOMER_ACTOR = "customer";
const EMAILPASS_PROVIDER = "emailpass";

export class AuthApi {
  constructor(private readonly httpClient: MedusaHttpClient) {}

  async register(email: string, password: string): Promise<MedusaAuthTokenResponse> {
    return this.httpClient.post<{ email: string; password: string }, MedusaAuthTokenResponse>(
      `/auth/${CUSTOMER_ACTOR}/${EMAILPASS_PROVIDER}/register`,
      { email, password },
    );
  }

  async login(email: string, password: string): Promise<MedusaAuthTokenResponse> {
    return this.httpClient.post<{ email: string; password: string }, MedusaAuthTokenResponse>(
      `/auth/${CUSTOMER_ACTOR}/${EMAILPASS_PROVIDER}`,
      { email, password },
    );
  }

  async resetPassword(identifier: string): Promise<void> {
    await this.httpClient.post<{ identifier: string }, void>(
      `/auth/${CUSTOMER_ACTOR}/${EMAILPASS_PROVIDER}/reset-password`,
      { identifier },
    );
  }

  async createSession(): Promise<MedusaAuthSessionResponse> {
    return this.httpClient.post<undefined, MedusaAuthSessionResponse>(
      "/auth/session",
      undefined,
    );
  }

  async deleteSession(): Promise<{ success: boolean }> {
    return this.httpClient.delete<{ success: boolean }>("/auth/session");
  }

  async refreshToken(): Promise<MedusaAuthTokenResponse> {
    return this.httpClient.post<undefined, MedusaAuthTokenResponse>(
      "/auth/token/refresh",
      undefined,
    );
  }
}
