"use client";

import { products } from "@/data/products/products";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";
import { useContextElement } from "@/context/Context";

function MayBe() {
  const { cartProducts } = useContextElement();

  if (cartProducts.length === 0) {
    return null;
  }

  return (
    <section className="flat-spacing-3 border-t border-[var(--line)]">
      <div className="container">
        <div className="mb-[24px]">
          <h4 className="account-title mb-[8px]">You may also like</h4>
          <p className="mb-0 text-[15px] cl-text-2">
            Complete your home with these popular picks
          </p>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          paginationLg={4}
          paginationMd={3}
          paginationSm={2}
          pagination={2}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {products.slice(4, 12).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default MayBe;
