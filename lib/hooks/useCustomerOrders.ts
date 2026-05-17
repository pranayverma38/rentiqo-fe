"use client";

import { useCallback, useEffect, useState } from "react";

import { medusaApi } from "@/lib/api";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import { MedusaOrder, MedusaOrdersListResponse } from "@/lib/api/types/medusa";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export function useCustomerOrders(limit = 20) {
  const [orders, setOrders] = useState<MedusaOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!hasMedusaApiBaseUrl) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = (await medusaApi.orders.list({
        limit,
        order: "-created_at",
      })) as MedusaOrdersListResponse;
      setOrders(response.orders ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load orders."));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
