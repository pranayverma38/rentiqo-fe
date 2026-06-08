"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";

const FREE_SHIPPING_THRESHOLD = 100;

type ShipOption = "free" | "local" | "flat";

const SHIP_PRICES: Record<ShipOption, number> = {
  free: 0,
  local: 35,
  flat: 35,
};

export default function ShoppingCart() {
  const { cartProducts, removeProductFromCart, updateQuantity, totalPrice } =
    useContextElement();
  const [shipOption, setShipOption] = useState<ShipOption>("free");

  const discount = 0;
  const shippingCost = SHIP_PRICES[shipOption];
  const orderTotal = Math.max(0, totalPrice - discount + shippingCost);

  const amountToFreeship = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shipProgressPercent = Math.min(
    100,
    FREE_SHIPPING_THRESHOLD > 0
      ? (totalPrice / FREE_SHIPPING_THRESHOLD) * 100
      : 0,
  );

  const removeLine = (id: ProductId) => {
    removeProductFromCart(id);
  };

  const setQty = (id: ProductId, qty: number) => {
    if (qty < 1) {
      removeLine(id);
      return;
    }
    updateQuantity(id, qty);
  };

  const freeshipMessage = useMemo(() => {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
      return (
        <>
          You qualify for{" "}
          <span className="text-primary fw-bold">free shipping</span>
        </>
      );
    }
    return (
      <>
        Buy
        <span className="text-primary fw-bold">
          {" "}
          {formatPrice(amountToFreeship)}{" "}
        </span>
        more for{" "}
        <span className="text-primary fw-bold">free shipping</span>
      </>
    );
  }, [amountToFreeship, totalPrice]);

  return (
    <section className="section-shoping-cart view-cart-page flat-spacing-2 pb-0">
      <div className="container">
        <div className="row gy-4">
          {cartProducts.length === 0 ? (
            <div className="col-12">
              <div className="view-cart-empty tf-page-checkout">
                <div className="box-text_empty type-shop_cart">
                  <div className="shop-empty_top">
                    <span className="icon">
                      <i className="icon-Handbag" />
                    </span>
                    <h4 className="text-emp">Your cart is empty</h4>
                    <p className="cl-text-2">
                      Looks like you haven&apos;t added anything yet. Browse our
                      collection and find something you love.
                    </p>
                  </div>
                  <div className="shop-empty_bot">
                    <Link href="/shop-default" className="tf-btn animate-btn">
                      Start shopping
                    </Link>
                    <Link href="/" className="tf-btn btn-stroke">
                      Back to home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="col-lg-8">
                <div className="view-cart-items tf-page-checkout">
                  <div className="view-cart-head">
                    <h5 className="title mb-0">
                      Cart items
                      <span className="view-cart-count">
                        {cartProducts.length}{" "}
                        {cartProducts.length === 1 ? "item" : "items"}
                      </span>
                    </h5>
                  </div>
                  <ul className="list-order-product view-cart-list">
                    {cartProducts.map((item) => (
                      <CartLineItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeLine(item.id)}
                        onQtyChange={(qty) => setQty(item.id, qty)}
                      />
                    ))}
                  </ul>
                  <form
                    className="view-cart-discount ip-discount-code"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <input type="text" placeholder="Enter discount code" />
                    <button className="tf-btn animate-btn" type="submit">
                      Apply
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="fl-sidebar-cart type-2 mt-lg-0 sticky-top">
                  <div className="box-order-summary view-cart-summary">
                    <div className="notification-progress">
                      <p className="mb-0">{freeshipMessage}</p>
                      <div className="progress-cart">
                        <div
                          className="value"
                          style={{ width: `${shipProgressPercent}%` }}
                          data-progress={Math.round(shipProgressPercent)}
                        >
                          <span className="round" />
                        </div>
                      </div>
                    </div>
                    <h5 className="title mb-20">Order Summary</h5>
                    <div className="subtotal d-flex justify-content-between align-items-center">
                      <p className="fw-medium lh-24 mb-0">Subtotal</p>
                      <span className="total fw-medium lh-24">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="discount d-flex justify-content-between align-items-center">
                      <p className="fw-medium lh-24 mb-0">Discounts</p>
                      <span className="total fw-medium lh-24">
                        {discount > 0
                          ? `-${formatPrice(discount)}`
                          : formatPrice(0)}
                      </span>
                    </div>
                    <div className="ship">
                      <p className="fw-medium lh-24 mb-0">Shipping</p>
                      <div className="box-check-payment flex-grow-1">
                        <fieldset className="ship-item">
                          <input
                            type="radio"
                            name="ship-check"
                            className="tf-check-rounded"
                            id="free"
                            checked={shipOption === "free"}
                            onChange={() => setShipOption("free")}
                          />
                          <label htmlFor="free">
                            <span>Free shipping</span>
                            <span className="price">{formatPrice(0)}</span>
                          </label>
                        </fieldset>
                        <fieldset className="ship-item">
                          <input
                            type="radio"
                            name="ship-check"
                            className="tf-check-rounded"
                            id="local"
                            checked={shipOption === "local"}
                            onChange={() => setShipOption("local")}
                          />
                          <label htmlFor="local">
                            <span>Local delivery</span>
                            <span className="price">{formatPrice(35)}</span>
                          </label>
                        </fieldset>
                        <fieldset className="ship-item">
                          <input
                            type="radio"
                            name="ship-check"
                            className="tf-check-rounded"
                            id="rate"
                            checked={shipOption === "flat"}
                            onChange={() => setShipOption("flat")}
                          />
                          <label htmlFor="rate">
                            <span>Flat rate</span>
                            <span className="price">{formatPrice(35)}</span>
                          </label>
                        </fieldset>
                      </div>
                    </div>
                    <h5 className="total-order d-flex justify-content-between align-items-center">
                      <span>Total</span>
                      <span className="total each-total-price">
                        {formatPrice(orderTotal)}
                      </span>
                    </h5>
                    <fieldset className="checkbox-wrap check-agree">
                      <input
                        type="checkbox"
                        name="agree"
                        className="tf-check-rounded"
                        id="checkOutAgree"
                      />
                      <label htmlFor="checkOutAgree">
                        I agree with the{" "}
                        <Link
                          href="/term-and-condition"
                          className="fw-medium text-decoration-underline link"
                        >
                          terms and conditions
                        </Link>
                      </label>
                    </fieldset>
                    <div className="list-ver text-center">
                      <Link
                        href="/checkout"
                        id="checkout-btn"
                        className="action-checkout tf-btn w-100 animate-btn text-center"
                      >
                        <span className="fw-semibold">Proceed to checkout</span>
                      </Link>
                      <Link
                        href="/shop-default"
                        className="link-underline link"
                      >
                        <span className="fw-semibold">Continue shopping</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function CartLineItem({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  const imgSrc =
    item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";

  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel = item.selectedSize ?? null;

  const lineTotal = item.price * item.quantity;

  return (
    <li className="order-item view-cart-item">
      <Link href={`/product-detail/${item.id}`} className="img-prd">
        <Image loading="lazy" width={100} height={133} src={imgSrc} alt="" />
      </Link>
      <div className="infor-prd">
        <Link
          href={`/product-detail/${item.id}`}
          className="prd_name fw-medium lh-24 link"
        >
          {item.name}
        </Link>
        {colorLabel ? (
          <div className="text-caption-01">
            <span className="cl-text-2">Color:</span> {colorLabel}
          </div>
        ) : null}
        {sizeLabel ? (
          <div className="text-caption-01">
            <span className="cl-text-2">Size:</span> {sizeLabel}
          </div>
        ) : null}
        <div className="view-cart-item-meta">
          <span className="unit-price cl-text-2 text-caption-01">
            {formatPrice(item.price)} each
          </span>
          <div className="wg-quantity">
            <button
              type="button"
              className="btn-quantity minus-quantity"
              onClick={() => onQtyChange(item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <i className="icon icon-minus" />
            </button>
            <input
              className="quantity-product"
              type="text"
              inputMode="numeric"
              name={`qty-${item.id}`}
              readOnly
              value={item.quantity}
              aria-label="Quantity"
            />
            <button
              type="button"
              className="btn-quantity plus-quantity"
              onClick={() => onQtyChange(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <i className="icon icon-plus" />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="cart_remove tf-btn-line-3 type-primary remove border-0 bg-transparent p-0"
          onClick={onRemove}
        >
          <span className="text-caption-01 fw-semibold">Remove</span>
        </button>
      </div>
      <div className="view-cart-line-total">
        <span className="line-total-label cl-text-2 text-caption-01 d-lg-none">
          Total
        </span>
        <span className="line-total-price fw-semibold text-primary">
          {formatPrice(lineTotal)}
        </span>
      </div>
    </li>
  );
}
