export type Primitive = string | number | boolean | null;

export type QueryValue = Primitive | Primitive[] | undefined;

export type QueryParams = Record<string, QueryValue>;

export interface PaginatedResponse<TItem> {
  limit: number;
  offset: number;
  count: number;
  items: TItem[];
}

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: QueryParams;
  signal?: AbortSignal;
}

export interface MedusaApiListResponse<TRecord> {
  limit: number;
  offset: number;
  count: number;
  // Medusa can return different collection keys depending on endpoint.
  [collectionKey: string]: unknown;
  records?: TRecord[];
}

export interface MedusaApiSingleResponse<TRecord> {
  // Medusa can return different object keys depending on endpoint.
  [recordKey: string]: unknown;
  record?: TRecord;
}

