import { useState } from "react";

const dashMenu = ["Dashboard", "Products", "Categories", "Coupon", "Order"];

function AdminSidePanel() {
  const [selection, setSelection] = useState("Dashboard");
  return (
    <>
      <div className="w-[20%] text-white text-center shadow-xl rounded-r-lg fixed top-0 z-1 h-[100vh]  p-10 bg-[#60001A]">
        <h2 className=" text text-2xl font-hurricane font-bold">Omni Mall</h2>
        <p className="text-sm">Admin Panel</p>
        <br />
        <br />
        <div className="w-full h-[0.5px] rounded-full bg-white"></div>
        <div className="mt-10">
          <ul className="p-4 bg-[#550017] rounded-xl">
            {dashMenu.map((item, index) => (
              <li
                className={`${selection === item ? "bg-[#26000a]" : "bg-[#3f0011]"} p-4 rounded-lg my-2 hover:scale-105 duration-500 shadow-lg`}
                key={index}
                onClick={() => setSelection(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminSidePanel;
