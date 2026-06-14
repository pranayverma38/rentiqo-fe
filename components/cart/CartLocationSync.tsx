"use client";

import { useEffect, useRef } from "react";

import { useStore } from "@/context/store";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import { syncCartRegionForSelectedLocation } from "@/lib/cart/medusaCartSync";

/** Keeps Medusa cart region + line prices aligned with the selected storefront location. */
export default function CartLocationSync() {
  const selectedLocation = useStore((state) => state.selectedLocation);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!hasMedusaApiBaseUrl) {
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    void syncCartRegionForSelectedLocation();
  }, [selectedLocation]);

  return null;
}
