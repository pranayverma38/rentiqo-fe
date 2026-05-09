import DelhiShopListing from "@/components/delhi/DelhiShopListing";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Combos",
  "Browse curated rental combos with filters, sorting, and grid or list view.",
);

export default function page() {
  return (
    <DelhiShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Combos" },
      ]}
      title="Combos"
      description={
        <>
          Bundle essentials in one package—pick a combo that fits your move.
          <br className="d-none d-lg-block" />
          Sort and filter to match budget and duration.
        </>
      }
    />
  );
}
