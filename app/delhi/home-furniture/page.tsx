import DelhiShopListing from "@/components/delhi/DelhiShopListing";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Home furniture",
  "Browse home furniture with filters, sorting, and grid or list view.",
);

export default function page() {
  return (
    <DelhiShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Home furniture" },
      ]}
      title="Home furniture"
      description={
        <>
          Furnish your space with pieces you can swap when life changes.
          <br className="d-none d-lg-block" />
          Use filters to narrow by room, style, and more.
        </>
      }
    />
  );
}
