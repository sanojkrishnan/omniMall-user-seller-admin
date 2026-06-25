import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";

function UserLayout() {
  const { pathname } = useLocation();
  const getSelection = () => {
    if (pathname.includes("/shop")) return "shop";
    if (pathname.includes("/cart")) return "cart";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          borderLine={getSelection() !== "home"}
          selection={getSelection()}
        />
        <main className="pt-[30px] p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserLayout;
