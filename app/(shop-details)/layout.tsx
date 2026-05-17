import Footer1 from "@/components/footers/Footer1";
import CloseNavDropdownsOnRoute from "@/components/headers/CloseNavDropdownsOnRoute";
import Header1 from "@/components/headers/Header1";
import TopBar4 from "@/components/topBars/TopBar4";
import type { Metadata } from "next";
import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";
export const metadata: Metadata = {
  title: `Shop product | ${AMERCE_SITE_TITLE}`,
  description: AMERCE_DEFAULT_DESCRIPTION,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CloseNavDropdownsOnRoute />
      <TopBar4 />
      <Header1 />
      {children}
      <Footer1/>
    </>
  );
}

