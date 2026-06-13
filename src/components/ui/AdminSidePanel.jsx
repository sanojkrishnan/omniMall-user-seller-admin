import {
  ChartBarStacked,
  LayoutDashboard,
  Logs,
  Puzzle,
  ShoppingBasket,
  UserSearch,
  Van,
} from "lucide-react";
import { useState } from "react";

const dashMenu = [
  "Dashboard",
  "Products",
  "Categories",
  "Coupon",
  "Order",
  "Users",
  "Sellers",
];

function AdminSidePanel({ setSelection, selection }) {
  const [menuClick, setMenuClick] = useState(false);

  return (
    <>
    
      <div
        className={` ${menuClick ? "w-24 sticky" : "w-[250px] fixed xl:sticky"} top-0 z-50 transition-all p-6 duration-500 text-white text-center shadow-xl rounded-tr-lg self-start h-screen overflow-y-auto bg-gradient-to-tl from-[#60001A] via-[#480014] to-[#60001A] `}
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
        <div>
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

          <div className="w-full h-[0.5px] rounded-full bg-white mt-10"></div>
        </div>
        {/* menu view */}
        <div className="mt-10">
          <ul
            className={`${menuClick ? "p-1" : "p-4"} bg-[#550017] rounded-xl`}
          >
            {dashMenu.map((item, index) => (
              <li
                className={`${selection === item ? "bg-[#26000a]" : "bg-[#3f0011]"} flex justify-evenly ${menuClick ? "p-2 my-1" : "p-2 md:p-4 my-2"} rounded-lg  hover:scale-105 overflow-hidden transition-all duration-500 shadow-lg`}
                key={index}
                onClick={() => setSelection(item)}
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
                <p
                  className={`overflow-hidden whitespace-nowrap ${
                    menuClick ? "w-0 opacity-0" : "opacity-100"
                  } transition-all duration-500 `}
                >
                  &nbsp;&nbsp;{item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminSidePanel;
