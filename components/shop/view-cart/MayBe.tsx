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
    <section className="flat-spacing view-cart-recommendations">
      <div className="container">
        <div className="sect-heading">
          <h4>You may also like</h4>
          <p className="cl-text-2 mb-0">
            Complete your look with these popular picks
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