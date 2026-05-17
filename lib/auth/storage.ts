const AUTH_TOKEN_KEY = "rentiqo_auth_token";
const CART_ID_KEY = "rentiqo_cart_id";

export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredAuthToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CART_ID_KEY);
}

export function setStoredCartId(cartId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_ID_KEY, cartId);
}

export function clearStoredCartId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_ID_KEY);
}
