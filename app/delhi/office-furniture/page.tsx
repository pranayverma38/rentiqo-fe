import DelhiShopListing from "@/components/delhi/DelhiShopListing";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Office furniture",
  "Browse office furniture with filters, sorting, and grid or list view.",
);

export default function page() {
  return (
    <DelhiShopListing
      crumbs={[
        { href: "/", label: "Home" },
        { label: "Office furniture" },
      ]}
      categoryPath="/delhi/office-furniture"
      categorySlug="office-furniture"
      title="Office furniture"
      description={
        <>
          Set up a productive workspace with desks, seating, and storage.
          <br className="d-none d-lg-block" />
          Tune results with filters for size, finish, and more.
        </>
      }
    />
  );
}
