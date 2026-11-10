import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/Footer";

function SellerLayout() {
  // const { pathname } = useLocation();
  // const getSelection = () => {
  //   if (pathname.includes("seller/shop")) return "shop";
  //   if (pathname.includes("seller/cart")) return "cart";
  //   if (pathname.includes("seller/profile")) return "profile";
  //   return "home";
  // };

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header
        borderLine={getSelection() !== "home"}
        selection={getSelection()}
      /> */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SellerLayout;
