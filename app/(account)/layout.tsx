import Footer1 from "@/components/footers/Footer1";
import AccountAuthGuard from "@/components/auth/AccountAuthGuard";
import CloseNavDropdownsOnRoute from "@/components/headers/CloseNavDropdownsOnRoute";
import Header1 from "@/components/headers/Header1";
import TopBar4 from "@/components/topBars/TopBar4";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CloseNavDropdownsOnRoute />
      <TopBar4 />
      <Header1 />
      <AccountAuthGuard>{children}</AccountAuthGuard>
      <Footer1 />
    </>
  );
}
