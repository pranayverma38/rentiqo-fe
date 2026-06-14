"use client";

import type { ReactNode } from "react";

import CartLocationSync from "@/components/cart/CartLocationSync";
import { AuthProvider } from "@/context/AuthProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartLocationSync />
      {children}
    </AuthProvider>
  );
}
