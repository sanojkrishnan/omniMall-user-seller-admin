import {
  ChartBarStacked,
  LayoutDashboard,
  LogOut,
  Logs,
  Puzzle,
  Settings,
  ShoppingBasket,
  UserSearch,
  Van,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearTokens } from "../../utils/apiClient";
import { logout } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";

const dashMenu = [
  "Dashboard",
  "Products",
  "Categories",
  "Coupon",
  "Order",
  "Users",
  "Sellers",
  "Settings",
];

function AdminSidePanel({ setSelection, selection }) {
  const [menuClick, setMenuClick] = useState(window.innerWidth <= 1280);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const activeItem =
    dashMenu.find(
      (item) => location.pathname === `/admin/${item.toLowerCase()}`,
    ) || selection;

  useEffect(() => {
    if (activeItem) setSelection(activeItem);
  }, [activeItem]); // sync parent whenever URL changes

  useEffect(() => {
    const handleResize = () => {
      setMenuClick(window.innerWidth <= 1280);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = (item) => {
    setSelection(item);
    navigate(`/admin/${item.toLowerCase()}`);
  };

  return (
    <div className={` sticky h-screen  top-0 left-0 z-50 w-24 xl:w-[340px]`}>
      <div
        className={` ${menuClick ? "w-24" : "w-[350px] "} fixed transition-all p-6 duration-500 text-white text-center shadow-xl rounded-tr-lg self-start h-screen overflow-y-auto bg-gradient-to-tl from-[#60001A] via-[#480014] to-[#60001A] `}
      >
        <div
          onClick={() => setMenuClick((prev) => !prev)}
          className={` ${menuClick ? "m-9" : "m-4"}  xl:hidden flex flex-col justify-center items-center transition-all duration-500 absolute right-0 top-0 mt-5 w-5 bg-transparent cursor-pointer`}
        >
          <div
            className={`${menuClick ? "w-5" : "w-1"} transition-all duration-300 h-1 rounded-full mb-1 bg-white`}
          ></div>
          <div
            className={`${menuClick ? "w-5" : "w-1"} transition-all duration-500 h-1 rounded-full mb-1 bg-white`}
          ></div>
          <div
            className={`${menuClick ? "w-5" : "w-1"} transition-all duration-700 h-1 rounded-full mb-1 bg-white`}
          ></div>
        </div>
        <div className="grid grid-cols-1 place-items-center">
          <h2
            className={`${menuClick ? "text-sm font-semibold mt-16" : "text-2xl font-bold"} transition-all duration-500 text font-hurricane`}
          >
            OmniMall
          </h2>
          <p
            className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
              menuClick ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Admin Panel
          </p>

          {/* logout button */}
          <button
            className={`flex justify-start ${menuClick ? "p-2 my-1" : "p-3 my-2"} mt-8 w-fit bg-[#5f0000] rounded-lg hover:scale-105 overflow-hidden transition-all duration-500 shadow-lg`}
            onClick={() => {
              dispatch(logout());
              navigate("/login", { replace: true });
            }}
          >
            <p
              className={`overflow-hidden whitespace-nowrap text-sm ${
                menuClick ? "opacity-0 w-0" : "opacity-100"
              } transition-all duration-500 `}
            >
              LogOut &nbsp;&nbsp;&nbsp;&nbsp;
            </p>
            <LogOut className="size-5" />
          </button>

          <div className="w-full h-[0.5px] rounded-full bg-white mt-10"></div>
        </div>
        {/* menu view */}
        <div className="mt-10">
          <ul
            className={`${menuClick ? "p-1" : "p-4"} bg-[#550017] rounded-xl`}
          >
            {dashMenu.map((item, index) => (
              <li
                className={`${activeItem === item ? "bg-[#26000a]" : "bg-[#3f0011]"} flex justify-start ${menuClick ? "p-2 my-1" : "p-2 md:p-4 my-2"} rounded-lg hover:scale-105 overflow-hidden transition-all duration-500 shadow-lg`}
                key={index}
                onClick={() => handleClick(item)}
              >
                <LayoutDashboard
                  className={item === "Dashboard" ? "block" : "hidden"}
                />
                <ShoppingBasket
                  className={item === "Products" ? "block" : "hidden"}
                />
                <ChartBarStacked
                  className={item === "Categories" ? "block" : "hidden"}
                />
                <Puzzle className={item === "Coupon" ? "block" : "hidden"} />
                <Logs className={item === "Order" ? "block" : "hidden"} />
                <UserSearch className={item === "Users" ? "block" : "hidden"} />
                <Van className={item === "Sellers" ? "block" : "hidden"} />
                <Settings
                  className={item === "Settings" ? "block" : "hidden"}
                />
                <p
                  className={`overflow-hidden whitespace-nowrap ${
                    menuClick ? "w-0 opacity-0" : "opacity-100"
                  } transition-all duration-500 `}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;{item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminSidePanel;
