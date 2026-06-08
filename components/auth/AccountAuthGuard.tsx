"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthProvider";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";

export default function AccountAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasMedusaApiBaseUrl || isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (!hasMedusaApiBaseUrl) {
    return children;
  }

  if (isLoading) {
    return (
      <section className="flat-spacing">
        <div className="container py-5 text-center cl-text-2">
          Loading your account…
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}