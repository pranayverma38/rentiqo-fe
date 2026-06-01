"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  ACCOUNT_DESKTOP_ENTRY_HREF,
  ACCOUNT_DESKTOP_MEDIA,
} from "@/components/account/accountEntry";

/** Mobile: shell shows nav only. Desktop: redirect to manage subscription. */
export default function AccountMobileMenuPage() {
  const router = useRouter();

  useEffect(() => {
    const media = window.matchMedia(ACCOUNT_DESKTOP_MEDIA);

    const syncRoute = () => {
      if (media.matches) {
        router.replace(ACCOUNT_DESKTOP_ENTRY_HREF);
      }
    };

    syncRoute();
    media.addEventListener("change", syncRoute);
    return () => media.removeEventListener("change", syncRoute);
  }, [router]);

  return null;
}
