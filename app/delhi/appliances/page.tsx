import DelhiShopListing from "@/components/delhi/DelhiShopListing";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Appliances",
  "Browse appliances with filters, sorting, and grid or list view.",
);

export default function page() {
  return (
    <DelhiShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Appliances" },
      ]}
      title="Appliances"
      description={
        <>
          Rent the appliances you need without long-term commitment.
          <br className="d-none d-lg-block" />
          Filter by type, brand, and availability.
        </>
      }
    />
  );
}
