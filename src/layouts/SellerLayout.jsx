import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import SellerHeader from "../components/ui/SellerHeader";

function SellerLayout() {
  const { pathname } = useLocation();
  const getSelection = () => {
    if (pathname.includes("seller/dashboard")) return "dashboard";
    if (pathname.includes("seller/products")) return "products";
    if (pathname.includes("seller/profile")) return "profile";
    return "home";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SellerHeader
        borderLine={getSelection() !== "home"}
        selection={getSelection()}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SellerLayout;
