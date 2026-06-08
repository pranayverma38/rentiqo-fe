"use client";

import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

import { ProductCardItem } from "@/types/productCard";
import { products } from "@/data/products/products";
import { type LocationSlug } from "@/lib/catalog/catalogRoutes";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import {
  addProductToMedusaCart,
  removeMedusaCartLine,
  updateMedusaCartLineQuantity,
} from "@/lib/cart/medusaCartSync";
import { syncWishlistIfAuthenticated } from "@/lib/wishlist/wishlistSync";

export type Product = ProductCardItem;
export type CartProduct = Product & {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  medusaLineItemId?: string;
};
export type ProductId = number | string;

interface StoreState {
  cartProducts: CartProduct[];
  wishList: Product[];
  quickViewItem: Product;
  quickAddItem: ProductId;
  totalPrice: number;
  activeCartProduct: CartProduct | null;
  selectedLocation: LocationSlug;
  setCartProducts: (
    value: CartProduct[] | ((prev: CartProduct[]) => CartProduct[]),
  ) => void;
  setWishList: (value: Product[] | ((prev: Product[]) => Product[])) => void;
  setQuickViewItem: (item: Product) => void;
  setQuickAddItem: (id: ProductId) => void;
  setActiveCartProduct: (item: CartProduct | null) => void;
  setSelectedLocation: (location: LocationSlug) => void;
  isAddedToCartProducts: (id: ProductId) => boolean;
  addProductToCart: (item: Product, qty?: number) => void;
  updateQuantity: (id: ProductId, qty: number) => void;
  removeProductFromCart: (id: ProductId) => void;
  quantityInCart: (id: ProductId) => number;
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: ProductId) => void;
  isAddedtoWishlist: (id: ProductId) => boolean;
}

const getTotalPrice = (cart: CartProduct[]) =>
  cart.reduce((acc, product) => acc + product.quantity * product.price, 0);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartProducts: [],
      wishList: [],
      quickViewItem: products[0],
      quickAddItem: 1,
      totalPrice: 0,
      activeCartProduct: null,
      selectedLocation: "delhi",

      setCartProducts: (value) =>
        set((state) => {
          const next =
            typeof value === "function" ? value(state.cartProducts) : value;
          return { cartProducts: next, totalPrice: getTotalPrice(next) };
        }),

      setWishList: (value) =>
        set((state) => ({
          wishList: typeof value === "function" ? value(state.wishList) : value,
        })),

      setQuickViewItem: (item) => set({ quickViewItem: item }),
      setQuickAddItem: (id) => set({ quickAddItem: id }),
      setActiveCartProduct: (item) => set({ activeCartProduct: item }),
      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),

      isAddedToCartProducts: (id) => {
        const cart = get().cartProducts;
        const key = String(id);
        return cart.some(
          (elm) =>
            String(elm.id) === key ||
            (elm.medusaVariantId != null && String(elm.medusaVariantId) === key) ||
            (elm.medusaProductId != null && String(elm.medusaProductId) === key),
        );
      },

      addProductToCart: (item, qty = 1) => {
        const { cartProducts, isAddedToCartProducts, selectedLocation } = get();

        const runMedusa = async () => {
          if (!hasMedusaApiBaseUrl) return;
          try {
            const key = String(
              item.medusaVariantId ?? item.medusaProductId ?? item.id,
            );
            if (isAddedToCartProducts(key)) {
              const existing = cartProducts.find(
                (p) =>
                  String(p.id) === key ||
                  (p.medusaVariantId != null && String(p.medusaVariantId) === key),
              );
              if (existing) {
                await updateMedusaCartLineQuantity(existing, qty, selectedLocation);
              }
              return;
            }
            await addProductToMedusaCart(item, qty, selectedLocation);
          } catch (error) {
            console.error("Medusa add to cart failed:", error);
          }
        };

        if (hasMedusaApiBaseUrl) {
          if (!item.medusaVariantId && !item.medusaProductId) {
            console.error(
              "Cannot add to Medusa cart: missing Medusa product id for",
              item.id,
            );
            return;
          }
          void runMedusa();
          return;
        }

        if (isAddedToCartProducts(item.id)) return;
        const cartItem: CartProduct = { ...item, quantity: qty };
        const next = [...cartProducts, cartItem];
        set({ cartProducts: next, totalPrice: getTotalPrice(next) });
      },

      updateQuantity: (id, qty) => {
        const { cartProducts, isAddedToCartProducts, selectedLocation } = get();
        if (!isAddedToCartProducts(id) || qty < 1) return;

        const key = String(id);
        const existing = cartProducts.find(
          (p) =>
            String(p.id) === key ||
            (p.medusaVariantId != null && String(p.medusaVariantId) === key),
        );
        if (hasMedusaApiBaseUrl && existing?.medusaLineItemId) {
          void updateMedusaCartLineQuantity(existing, qty, selectedLocation).catch(
            (error) => console.error("Medusa cart update failed:", error),
          );
          return;
        }

        const items = cartProducts.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item,
        );
        set({ cartProducts: items, totalPrice: getTotalPrice(items) });
      },

      removeProductFromCart: (id) => {
        const { cartProducts, selectedLocation } = get();
        const key = String(id);
        const existing = cartProducts.find(
          (p) =>
            String(p.id) === key ||
            (p.medusaVariantId != null && String(p.medusaVariantId) === key),
        );

        if (hasMedusaApiBaseUrl && existing?.medusaLineItemId) {
          void removeMedusaCartLine(existing, selectedLocation).catch((error) =>
            console.error("Medusa cart remove failed:", error),
          );
          return;
        }

        const next = cartProducts.filter((p) => p.id !== id);
        set({ cartProducts: next, totalPrice: getTotalPrice(next) });
      },

      quantityInCart: (id) => {
        const item = get().cartProducts.find((elm) => elm.id === id);
        return item ? item.quantity : 0;
      },

      addToWishlist: (item) => {
        const { wishList } = get();
        const isAlreadyAdded = wishList.some((elm) => elm.id === item.id);
        if (isAlreadyAdded) {
          set({ wishList: wishList.filter((elm) => elm.id !== item.id) });
        } else {
          set({ wishList: [...wishList, item] });
        }
        void syncWishlistIfAuthenticated().catch((error) =>
          console.error("Wishlist sync failed:", error),
        );
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          wishList: state.wishList.filter((elm) => elm.id !== id),
        }));
        void syncWishlistIfAuthenticated().catch((error) =>
          console.error("Wishlist sync failed:", error),
        );
      },

      isAddedtoWishlist: (id) => get().wishList.some((elm) => elm.id === id),
    }),
    {
      name: "amerce-store",
      partialize: (state) => ({
        ...(hasMedusaApiBaseUrl
          ? {}
          : {
              cartProducts: state.cartProducts,
              totalPrice: state.totalPrice,
            }),
        wishList: state.wishList,
        selectedLocation: state.selectedLocation,
      }),
      storage: {
        getItem: (
          name,
        ): StorageValue<{
          cartProducts: CartProduct[];
          wishList: Product[];
          totalPrice: number;
          selectedLocation: LocationSlug;
        }> | null => {
          if (typeof window === "undefined") return null;
          const str = window.localStorage.getItem(name);
          if (str) {
            try {
              const parsed = JSON.parse(str) as StorageValue<{
                cartProducts: CartProduct[];
                wishList: Product[];
                totalPrice: number;
                selectedLocation: LocationSlug;
              }>;
              parsed.state.wishList = normalizeStoredProductList(
                parsed?.state?.wishList,
              );
              if (parsed?.state?.selectedLocation == null) {
                parsed.state.selectedLocation = "delhi";
              }
              if (hasMedusaApiBaseUrl) {
                parsed.state.cartProducts = [];
                parsed.state.totalPrice = 0;
              } else if (
                parsed?.state?.cartProducts &&
                parsed.state.totalPrice == null
              ) {
                parsed.state.totalPrice = getTotalPrice(
                  parsed.state.cartProducts,
                );
              }
              return parsed;
            } catch {
              return null;
            }
          }
          return null;
        },
        setItem: (
          name,
          value: StorageValue<{
            cartProducts: CartProduct[];
            wishList: Product[];
            totalPrice: number;
            selectedLocation: LocationSlug;
          }>,
        ) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
          }
        },
      },
    },
  ),
);

/** Wait for persisted wishlist/location before loading Medusa cart (avoids hydration races). */
export function waitForStoreHydration(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    if (useStore.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = useStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

function normalizeStoredProductList(value: unknown): Product[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) =>
      typeof item === "object" && item !== null && "id" in item
        ? (item as Product)
        : undefined,
    )
    .filter((item): item is Product => Boolean(item));
}

function getContextSnapshot(state: StoreState) {
  return {
    cartProducts: state.cartProducts,
    setCartProducts: state.setCartProducts,
    totalPrice: state.totalPrice,
    addProductToCart: state.addProductToCart,
    isAddedToCartProducts: state.isAddedToCartProducts,
    removeFromWishlist: state.removeFromWishlist,
    addToWishlist: state.addToWishlist,
    isAddedtoWishlist: state.isAddedtoWishlist,
    quickViewItem: state.quickViewItem,
    wishList: state.wishList,
    setQuickViewItem: state.setQuickViewItem,
    quickAddItem: state.quickAddItem,
    setQuickAddItem: state.setQuickAddItem,
    updateQuantity: state.updateQuantity,
    removeProductFromCart: state.removeProductFromCart,
    quantityInCart: state.quantityInCart,
    activeCartProduct: state.activeCartProduct,
    setActiveCartProduct: state.setActiveCartProduct,
    selectedLocation: state.selectedLocation,
    setSelectedLocation: state.setSelectedLocation,
  };
}

type ContextSnapshot = ReturnType<typeof getContextSnapshot>;

let cachedState: StoreState | null = null;
let cachedSnapshot: ContextSnapshot | null = null;

function getStableContextSnapshot(state: StoreState): ContextSnapshot {
  if (state === cachedState && cachedSnapshot !== null) {
    return cachedSnapshot;
  }
  cachedState = state;
  cachedSnapshot = getContextSnapshot(state);
  return cachedSnapshot;
}

/** Same API as the old useContextElement() for drop-in replacement in existing components. */
export function useContextElement() {
  return useStore(getStableContextSnapshot);
}
