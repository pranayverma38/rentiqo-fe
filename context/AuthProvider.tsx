"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { medusaApi } from "@/lib/api";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import { MedusaCustomer } from "@/lib/api/types/medusa";
import {
  clearStoredAuthToken,
  getStoredCartId,
  getStoredAuthToken,
  setStoredAuthToken,
} from "@/lib/auth/storage";
import {
  clearLocalCart,
  loadCartForCustomer,
  refreshCartFromMedusa,
} from "@/lib/cart/medusaCartSync";
import {
  clearLocalWishlist,
  loadWishlistFromCustomer,
} from "@/lib/wishlist/wishlistSync";
import type { Product } from "@/context/store";
import { useStore, waitForStoreHydration } from "@/context/store";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export type RegisterInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

type AuthContextValue = {
  customer: MedusaCustomer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (identifier: string) => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateProfile: (payload: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function applyAuthToken(token: string): void {
  setStoredAuthToken(token);
  medusaApi.client.setAuthToken(token);
}

function clearAuthToken(): void {
  clearStoredAuthToken();
  medusaApi.client.setAuthToken(undefined);
}

async function fetchCustomer(): Promise<MedusaCustomer> {
  const { customer } = await medusaApi.customers.retrieve();
  return customer;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<MedusaCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshCustomer = useCallback(async () => {
    if (!hasMedusaApiBaseUrl || !getStoredAuthToken()) {
      setCustomer(null);
      return;
    }
    const next = await fetchCustomer();
    setCustomer(next);
    await loadWishlistFromCustomer(next);
    await loadCartForCustomer(next);
  }, []);

  const postAuthSession = useCallback(async () => {
    try {
      await medusaApi.auth.createSession();
    } catch {
      // Cookie session is optional; Bearer token is enough for store APIs.
    }
  }, []);

  const afterAuthSuccess = useCallback(
    async (
      guestWishlist: Product[] = [],
      guestCartId: string | null = null,
    ) => {
      await postAuthSession();
      const next = await fetchCustomer();
      setCustomer(next);
      await loadCartForCustomer(next, { guestCartId });
      await loadWishlistFromCustomer(next, {
        mergeGuestItems: guestWishlist,
      });
    },
    [postAuthSession],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!hasMedusaApiBaseUrl) {
        setIsLoading(false);
        return;
      }

      await waitForStoreHydration();
      if (cancelled) return;

      const token = getStoredAuthToken();
      if (token) {
        medusaApi.client.setAuthToken(token);
        try {
          const next = await fetchCustomer();
          if (!cancelled) {
            setCustomer(next);
            await loadWishlistFromCustomer(next);
            await loadCartForCustomer(next);
          }
        } catch {
          clearAuthToken();
          clearLocalCart();
          if (!cancelled) setCustomer(null);
        }
      } else {
        await refreshCartFromMedusa();
      }
      if (!cancelled) setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const wasLoggedIn = Boolean(getStoredAuthToken());
        const guestWishlist = wasLoggedIn
          ? []
          : [...useStore.getState().wishList];
        const guestCartId = wasLoggedIn ? null : getStoredCartId();
        clearLocalWishlist();
        clearLocalCart();

        const { token } = await medusaApi.auth.login(email.trim(), password);
        if (!token) {
          throw new Error("Login did not return an authentication token.");
        }
        applyAuthToken(token);
        await afterAuthSuccess(guestWishlist, guestCartId);
      } catch (err) {
        const message = getApiErrorMessage(err, "Login failed. Check your email and password.");
        setError(message);
        throw err;
      }
    },
    [afterAuthSuccess],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      setError(null);
      try {
        const wasLoggedIn = Boolean(getStoredAuthToken());
        const guestWishlist = wasLoggedIn
          ? []
          : [...useStore.getState().wishList];
        const guestCartId = wasLoggedIn ? null : getStoredCartId();
        clearLocalWishlist();
        clearLocalCart();

        const email = input.email.trim();
        try {
          const { token } = await medusaApi.auth.register(email, input.password);
          applyAuthToken(token);
        } catch (registerErr) {
          const isExistingIdentity =
            registerErr instanceof ApiError &&
            registerErr.statusCode === 401 &&
            String(registerErr.message).includes("Identity with email already exists");

          if (!isExistingIdentity) {
            throw registerErr;
          }

          const { token } = await medusaApi.auth.login(email, input.password);
          applyAuthToken(token);
        }

        try {
          await medusaApi.customers.create({
            email,
            first_name: input.firstName?.trim() || undefined,
            last_name: input.lastName?.trim() || undefined,
          });
        } catch (createErr) {
          const alreadyCustomer =
            createErr instanceof ApiError &&
            (createErr.statusCode === 409 ||
              String(createErr.message).toLowerCase().includes("already"));
          if (!alreadyCustomer) {
            throw createErr;
          }
        }

        await afterAuthSuccess(guestWishlist, guestCartId);
      } catch (err) {
        const message = getApiErrorMessage(
          err,
          "Could not create account. The email may already be registered.",
        );
        setError(message);
        throw err;
      }
    },
    [afterAuthSuccess],
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await medusaApi.auth.deleteSession();
    } catch {
      // Continue local logout even if session delete fails.
    }
    clearAuthToken();
    clearLocalWishlist();
    clearLocalCart();
    setCustomer(null);
  }, []);

  const resetPassword = useCallback(async (identifier: string) => {
    setError(null);
    try {
      await medusaApi.auth.resetPassword(identifier.trim());
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Could not send reset instructions. Please try again.",
      );
      setError(message);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(
    async (payload: {
      first_name?: string;
      last_name?: string;
      phone?: string;
    }) => {
      setError(null);
      try {
        const { customer: updated } = await medusaApi.customers.update(payload);
        setCustomer(updated);
      } catch (err) {
        const message = getApiErrorMessage(err, "Could not update profile.");
        setError(message);
        throw err;
      }
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      isAuthenticated: Boolean(customer),
      isLoading,
      error,
      clearError,
      login,
      register,
      logout,
      resetPassword,
      refreshCustomer,
      updateProfile,
    }),
    [
      customer,
      isLoading,
      error,
      clearError,
      login,
      register,
      logout,
      resetPassword,
      refreshCustomer,
      updateProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
