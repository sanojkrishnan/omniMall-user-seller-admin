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
  return (
    <div className="min-w-[20%] md:block hidden text-white text-center shadow-xl rounded-tr-lg sticky top-0 self-start h-screen overflow-y-auto p-10 bg-gradient-to-tl from-[#60001A] via-[#480014] to-[#60001A] ">
      <h2 className=" text text-2xl font-hurricane font-bold">OmniMall</h2>
      <p className="text-sm">Admin Panel</p>
      <br />
      <br />
      <div className="w-full h-[0.5px] rounded-full bg-white"></div>
      <div className="mt-10">
        <ul className="p-4 bg-[#550017] rounded-xl">
          {dashMenu.map((item, index) => (
            <li
              className={`${selection === item ? "bg-[#26000a]" : "bg-[#3f0011]"} p-2 md:p-4 rounded-lg my-2 hover:scale-105 duration-500 shadow-lg`}
              key={index}
              onClick={() => setSelection(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminSidePanel;
