# API Layer (Medusa Setup)

This directory contains the frontend API foundation for Medusa integration.

## Structure

- `config.ts`: environment-based API config
- `client.ts`: shared HTTP client + auth header handling
- `errors.ts`: normalized API error type
- `endpoints.ts`: endpoint constants
- `modules/*`: domain-oriented API modules
- `index.ts`: single export for app-wide usage

## Backend alignment (`rentiqo`)

- Backend is Medusa `2.13.6` with default store APIs.
- Custom store route detected: `GET /store/custom`.
- No custom versioned API prefix detected, so `NEXT_PUBLIC_MEDUSA_API_VERSION` should stay empty.

## Usage

```ts
import { medusaApi } from "@/lib/api";

const products = await medusaApi.products.list({ limit: 12 });
await medusaApi.custom.healthCheck();
```

## Notes

- This setup intentionally avoids UI integration.
- Replace `unknown` response types in modules with backend-aligned types as you integrate endpoint-by-endpoint.
- Set environment values from `.env.example` before making live requests.

