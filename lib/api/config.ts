const DEFAULT_MEDUSA_API_VERSION = "";

/**
 * Runtime config for Medusa API access.
 *
 * Keep only non-sensitive values in NEXT_PUBLIC_ variables.
 */
export const medusaApiConfig = {
  baseUrl: (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "").replace(
    /\/+$/,
    "",
  ),
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
  apiVersion:
    process.env.NEXT_PUBLIC_MEDUSA_API_VERSION ?? DEFAULT_MEDUSA_API_VERSION,
  timeoutMs: Number(process.env.NEXT_PUBLIC_MEDUSA_TIMEOUT_MS ?? 15000),
};

export const hasMedusaApiBaseUrl = medusaApiConfig.baseUrl.length > 0;

