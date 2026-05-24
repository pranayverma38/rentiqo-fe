"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  findMedusaVariantByOptions,
  type ProductDetailVariant,
} from "@/lib/catalog/rentiqoStoreCatalog";
import { ProductSingleImage } from "@/types/productCard";

export interface ColorOption {
  label: string;
  swatchClass: string;
  img: string;
}

export interface SizeOption {
  value: string;
  price?: string;
  active?: boolean;
  variantId?: string;
  /** Medusa variant thumbnail for image-based size picker. */
  thumbnail?: string;
}

interface ProductContextType {
  pane: HTMLElement | null;
  registerPane: (el: HTMLElement | null) => void;
  isZooming: boolean;
  setIsZooming: (zooming: boolean) => void;

  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentDuration: string;
  setCurrentDuration: (value: string) => void;
  currentSize: string;
  setCurrentSize: (size: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;

  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
  durationOptions: SizeOption[];
  colors: ColorOption[];
  thumbnailPosition: "bottom" | "left" | "right";
  zoomType: "default" | "inner" | "magnifying" | "none";

  optionTitle?: string;
  hasDurationOption: boolean;
  medusaVariants: ProductDetailVariant[];
  selectedVariant: ProductDetailVariant | null;
  activeGalleryImages: ProductSingleImage[];
  activeThumbnail?: string;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export interface ProductProviderProps {
  children: React.ReactNode;
  initialColor?: string;
  initialDuration?: string;
  initialSize?: string;
  initialQuantity?: number;
  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
  durationOptions?: SizeOption[];
  colors: ColorOption[];
  thumbnailPosition?: "bottom" | "left" | "right";
  zoomType?: "default" | "inner" | "magnifying" | "none";
  medusaVariants?: ProductDetailVariant[];
  optionTitle?: string;
  hasDurationOption?: boolean;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
  initialColor = "",
  initialDuration = "",
  initialSize = "",
  initialQuantity = 1,
  extraImages,
  sizes: sizesProp,
  durationOptions: durationOptionsProp = [],
  colors,
  thumbnailPosition = "left",
  zoomType = "default",
  medusaVariants = [],
  optionTitle,
  hasDurationOption = false,
}) => {
  const [pane, setPane] = useState<HTMLElement | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [currentColor, setCurrentColor] = useState(
    initialColor || (colors.length > 0 ? colors[0].label.toLowerCase() : ""),
  );
  const [currentDuration, setCurrentDuration] = useState(
    initialDuration ||
      (durationOptionsProp.length > 0 ? durationOptionsProp[0].value : ""),
  );
  const [currentSize, setCurrentSize] = useState(
    initialSize || (sizesProp.length > 0 ? sizesProp[0].value : ""),
  );
  const [quantity, setQuantity] = useState(initialQuantity);

  const registerPane = useCallback((el: HTMLElement | null) => {
    setPane(el);
  }, []);

  const baseSelection = useMemo(
    () => ({
      ...(hasDurationOption && currentDuration
        ? { duration: currentDuration }
        : {}),
      ...(colors.length > 0 && currentColor ? { color: currentColor } : {}),
    }),
    [hasDurationOption, currentDuration, colors.length, currentColor],
  );

  const selection = useMemo(
    () => ({
      ...baseSelection,
      ...(sizesProp.length > 0 && currentSize ? { size: currentSize } : {}),
    }),
    [baseSelection, sizesProp.length, currentSize],
  );

  const selectedVariant = useMemo(() => {
    if (medusaVariants.length === 0) {
      return null;
    }
    return findMedusaVariantByOptions(medusaVariants, selection);
  }, [medusaVariants, selection]);

  const sizes = useMemo(() => {
    if (sizesProp.length === 0) {
      return sizesProp;
    }
    if (medusaVariants.length === 0) {
      return sizesProp;
    }
    return sizesProp.map((size) => {
      const variant = findMedusaVariantByOptions(medusaVariants, {
        ...baseSelection,
        size: size.value,
      });
      return {
        ...size,
        variantId: variant?.id ?? size.variantId,
        thumbnail: variant?.thumbnail ?? size.thumbnail,
        price:
          variant != null ? String(variant.price) : size.price,
      };
    });
  }, [sizesProp, medusaVariants, baseSelection]);

  useEffect(() => {
    if (selectedVariant == null) {
      return;
    }
    const ov = selectedVariant.optionValues;
    if (ov.duration != null && ov.duration !== currentDuration) {
      setCurrentDuration(ov.duration);
    }
    if (
      ov.color != null &&
      ov.color.toLowerCase() !== currentColor.toLowerCase()
    ) {
      setCurrentColor(ov.color.toLowerCase());
    }
    if (ov.size != null && ov.size.toLowerCase() !== currentSize.toLowerCase()) {
      setCurrentSize(ov.size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync UI when resolved variant changes
  }, [selectedVariant?.id]);

  const activeGalleryImages = useMemo(() => {
    if (selectedVariant != null && selectedVariant.galleryImages.length > 0) {
      return selectedVariant.galleryImages;
    }
    return extraImages;
  }, [selectedVariant, extraImages]);

  const activeThumbnail = selectedVariant?.thumbnail ?? activeGalleryImages[0]?.src;

  return (
    <ProductContext.Provider
      value={{
        pane,
        registerPane,
        isZooming,
        setIsZooming,
        currentColor,
        setCurrentColor,
        currentDuration,
        setCurrentDuration,
        currentSize,
        setCurrentSize,
        quantity,
        setQuantity,
        extraImages,
        sizes,
        durationOptions: durationOptionsProp,
        colors,
        thumbnailPosition,
        zoomType,
        optionTitle,
        hasDurationOption,
        medusaVariants,
        selectedVariant,
        activeGalleryImages,
        activeThumbnail,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export function useProductOptional() {
  return useContext(ProductContext);
}
