"use client";

import { useEffect, useMemo, useState } from "react";

import { useContextElement } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { hasMedusaApiBaseUrl } from "@/lib/api/config";
import { syncCartRegionForSelectedLocation } from "@/lib/cart/medusaCartSync";
import {
  changeCartTenure,
  parseDurationMonths,
  type CartTenureMonths,
} from "@/lib/cart/cartTenure";
import { getCartTotalDeposit } from "@/utils/cartDeposit";

import { type BillingMode } from "./CartBillingToggle";
import CartEmptyState from "./CartEmptyState";
import CartLineItem from "./CartLineItem";
import CartMobileCheckoutBar from "./CartMobileCheckoutBar";
import CartOrderSummary, { SHIP_PRICES, type ShipOption } from "./CartOrderSummary";
import CartTopControls from "./CartTopControls";
import CityShieldCard, { CITYSHIELD_PRICE } from "./CityShieldCard";
import { CART_PANEL } from "./cartStyles";

export default function ShoppingCart() {
  const { cartProducts, removeProductFromCart, updateQuantity, totalPrice } =
    useContextElement();

  const [shipOption, setShipOption] = useState<ShipOption>("free");
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");
  const [cityShieldEnabled, setCityShieldEnabled] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [tenureChanging, setTenureChanging] = useState(false);

  const selectedTenureMonths = useMemo((): CartTenureMonths => {
    return (
      parseDurationMonths(cartProducts[0]?.selectedSize) ??
      (12 as CartTenureMonths)
    );
  }, [cartProducts]);

  useEffect(() => {
    if (!hasMedusaApiBaseUrl) {
      return;
    }
    void syncCartRegionForSelectedLocation();
  }, []);

  const discount = 0;
  const shippingCost = SHIP_PRICES[shipOption];
  const totalDeposit = useMemo(
    () => getCartTotalDeposit(cartProducts),
    [cartProducts],
  );
  const orderTotal = Math.max(0, totalPrice - discount + shippingCost);

  const payableToday = useMemo(() => {
    const addons = cityShieldEnabled ? CITYSHIELD_PRICE : 0;
    return orderTotal + totalDeposit + addons;
  }, [cityShieldEnabled, orderTotal, totalDeposit]);

  const handleTenureChange = async (months: CartTenureMonths) => {
    if (tenureChanging || months === selectedTenureMonths) {
      return;
    }
    setTenureChanging(true);
    try {
      await changeCartTenure(months);
    } catch (error) {
      console.error("Failed to update cart tenure:", error);
    } finally {
      setTenureChanging(false);
    }
  };

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

  const handleApplyDiscount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  if (cartProducts.length === 0) {
    return (
      <section className="flat-spacing max-lg:!pt-[30px]">
        <div className="container">
          <h4 className="account-title">Cart</h4>
          <CartEmptyState />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="flat-spacing max-lg:!pt-[30px] pb-[100px] md:pb-[48px]">
        <div className="container">
          <div className="grid grid-cols-1 items-start gap-[20px] lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-[28px]">
            <div className="min-w-0 grid gap-[16px]">
              <div className={`${CART_PANEL} px-[16px] py-[16px] md:px-[20px] md:py-[18px]`}>
                <CartTopControls
                  selectedTenureMonths={selectedTenureMonths}
                  tenureChanging={tenureChanging}
                  onTenureChange={handleTenureChange}
                  billingMode={billingMode}
                  onBillingChange={setBillingMode}
                />
              </div>

              <ul className="mb-0 grid list-none gap-[16px] p-0">
                {cartProducts.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeLine(item.id)}
                    onQtyChange={(qty) => setQty(item.id, qty)}
                  />
                ))}
              </ul>

              <CityShieldCard
                enabled={cityShieldEnabled}
                onChange={setCityShieldEnabled}
              />
            </div>

            <aside className="w-full min-w-0 border-t border-[var(--line)] pt-[20px] lg:sticky lg:top-[100px] lg:border-t-0 lg:pt-0">
              <CartOrderSummary
                itemCount={cartProducts.length}
                totalPrice={totalPrice}
                totalDeposit={totalDeposit}
                discount={discount}
                shippingCost={shippingCost}
                orderTotal={orderTotal}
                cityShieldEnabled={cityShieldEnabled}
                cityShieldPrice={CITYSHIELD_PRICE}
                billingMode={billingMode}
                shipOption={shipOption}
                onShipOptionChange={setShipOption}
                agreeChecked={agreeChecked}
                onAgreeChange={setAgreeChecked}
                onApplyDiscount={handleApplyDiscount}
              />
            </aside>
          </div>
        </div>
      </section>

      <CartMobileCheckoutBar
        payableToday={payableToday}
        itemCount={cartProducts.length}
      />
    </>
  );
}
