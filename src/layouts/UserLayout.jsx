import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/Footer";

function UserLayout() {
  const { pathname } = useLocation();
  const getSelection = () => {
    if (pathname.includes("user/shop")) return "shop";
    if (pathname.includes("user/cart")) return "cart";
    if (pathname.includes("user/profile")) return "profile";
    return "home";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
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

export default UserLayout;
