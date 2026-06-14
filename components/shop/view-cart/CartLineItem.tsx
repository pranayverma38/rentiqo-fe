"use client";

import Link from "next/link";
import Image from "next/image";

import type { CartProduct } from "@/context/Context";
import { formatDepositAmount } from "@/utils/formatPrice";
import {
  getCartLineDeposit,
  getCartLineUnitDeposit,
} from "@/utils/cartDeposit";

import { formatDurationLabel } from "./cartUtils";
import { CART_CONTROL, CART_PANEL } from "./cartStyles";

type CartLineItemProps = {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
};

export default function CartLineItem({
  item,
  onRemove,
  onQtyChange,
}: CartLineItemProps) {
  const imgSrc =
    item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";

  const lineRent = item.price * item.quantity;
  const lineDeposit = getCartLineDeposit(item);
  const unitDeposit = getCartLineUnitDeposit(item);
  const productHref = `/product-detail/${item.medusaProductId ?? item.id}`;
  const durationLabel = formatDurationLabel(item.selectedSize);
  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const unitRentOld =
    item.priceOld != null && item.priceOld > item.price
      ? item.priceOld * item.quantity
      : null;

  return (
    <li className="list-none">
      <article
        className={`${CART_PANEL} p-[16px] transition-colors hover:border-[#d1d5db] md:p-[20px]`}
      >
        <div className="flex flex-col gap-[16px] lg:flex-row lg:items-start lg:gap-[20px]">
          <Link
            href={productHref}
            className={`relative mx-auto h-[112px] w-[112px] shrink-0 overflow-hidden ${CART_CONTROL} border border-[var(--line)] bg-[var(--bg)] lg:mx-0 lg:h-[100px] lg:w-[100px]`}
          >
            <Image
              loading="lazy"
              fill
              sizes="(max-width: 1024px) 112px, 100px"
              src={imgSrc}
              alt={item.name}
              className="object-cover"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="mb-[10px] flex items-start justify-between gap-[12px]">
              <div className="min-w-0">
                <Link
                  href={productHref}
                  className="mb-[6px] block text-[16px] font-medium leading-[1.4] text-[var(--text)] hover:text-[var(--primary)] md:text-[17px]"
                >
                  {item.name}
                </Link>
                {item.subtitle ? (
                  <p className="mb-[8px] text-[13px] leading-[1.4] cl-text-2">
                    {item.subtitle}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-[8px]">
                  <span
                    className={`inline-flex items-center ${CART_CONTROL} bg-[#eff6ff] px-[10px] py-[4px] text-[12px] font-medium text-[#1d4ed8]`}
                  >
                    {durationLabel}
                  </span>
                  {colorLabel ? (
                    <span
                      className={`inline-flex items-center ${CART_CONTROL} bg-[var(--bg)] px-[10px] py-[4px] text-[12px] font-medium text-[var(--text)]`}
                    >
                      {colorLabel}
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${item.name} from cart`}
                className={`m-0 inline-flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center ${CART_CONTROL} border border-[var(--line)] bg-[var(--white)] p-0 cl-text-2 shadow-none outline-none transition-colors hover:border-[#fecaca] hover:bg-[#fef2f2] hover:text-[#ef4444]`}
              >
                <i className="icon icon-trash text-[16px] leading-none" aria-hidden />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-[12px]">
              <div
                className={`inline-flex h-[40px] items-center overflow-hidden ${CART_CONTROL} border border-[var(--line)] bg-[var(--white)]`}
              >
                <button
                  type="button"
                  className="m-0 inline-flex h-[40px] w-[40px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--text)] shadow-none outline-none transition-colors hover:bg-[var(--bg)]"
                  onClick={() => onQtyChange(item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <i className="icon icon-minus text-[14px] leading-none" />
                </button>
                <span className="inline-flex h-[40px] min-w-[44px] items-center justify-center border-x border-[var(--line)] px-[10px] text-[15px] font-semibold text-[var(--text)]">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="m-0 inline-flex h-[40px] w-[40px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--text)] shadow-none outline-none transition-colors hover:bg-[var(--bg)]"
                  onClick={() => onQtyChange(item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <i className="icon icon-plus text-[14px] leading-none" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-row items-center justify-between gap-[16px] border-t border-[var(--line)] pt-[16px] lg:w-[240px] lg:flex-col lg:items-stretch lg:justify-start lg:border-l lg:border-t-0 lg:pl-[20px] lg:pt-0">
            <div className="min-w-0 flex-1 lg:flex-none">
              <p className="mb-[6px] text-[11px] uppercase tracking-[0.04em] cl-text-2">
                Monthly Rent
              </p>
              <div className="flex flex-wrap items-baseline gap-[8px]">
                <span className="text-[18px] font-semibold leading-none text-[var(--text)]">
                  {formatDepositAmount(lineRent)}
                </span>
                {unitRentOld != null ? (
                  <span className="text-[14px] leading-none cl-text-2 line-through">
                    {formatDepositAmount(unitRentOld)}
                  </span>
                ) : null}
              </div>
              {item.quantity > 1 ? (
                <p className="mb-0 mt-[4px] text-[12px] cl-text-2">
                  {formatDepositAmount(item.price)} × {item.quantity}
                </p>
              ) : null}
            </div>

            <span className="text-[20px] font-light leading-none text-[var(--line)]">
              +
            </span>

            <div className="min-w-0 flex-1 text-right lg:flex-none lg:text-left">
              <p className="mb-[6px] text-[11px] uppercase tracking-[0.04em] cl-text-2">
                Refundable Deposit
              </p>
              <span className="text-[18px] font-semibold leading-none text-[var(--text)]">
                {formatDepositAmount(lineDeposit)}
              </span>
              {item.quantity > 1 ? (
                <p className="mb-0 mt-[4px] text-[12px] cl-text-2">
                  {formatDepositAmount(unitDeposit)} × {item.quantity}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
