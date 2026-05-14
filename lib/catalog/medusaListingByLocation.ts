import type { LocationSlug } from "@/lib/catalog/subcategories";

/** Medusa `/store/products` query context per storefront location (hardcoded). */
export type MedusaListingStoreContext = {
  regionId: string;
  salesChannelId: string;
};

const BY_LOCATION: Record<LocationSlug, MedusaListingStoreContext> = {
  delhi: {
    regionId: "reg_01KRM1QN3GABC30ANHPMW2A767",
    salesChannelId: "sc_01KRM2P4E4GPDG8RTEQ4RW5KZ5",
  },
  noida: {
    regionId: "reg_01KRM1RQ85W3ASMVSHJP403TSY",
    salesChannelId: "sc_01KRM2XA0Y56RK4ZFQ833NEHFE",
  },
  gurugram: {
    regionId: "reg_01KRM1SCRRK15VXZMDCKEB3PNY",
    salesChannelId: "sc_01KRM2XVHG1TS068M112CDVJ4Z",
  },
};

export function getMedusaListingStoreContext(
  location: LocationSlug,
): MedusaListingStoreContext {
  return BY_LOCATION[location];
}
