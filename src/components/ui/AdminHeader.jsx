import { useState } from "react";
import { Button } from "./Button";
import { BellIcon } from "lucide-react";

function AdminHeader() {
  const [showNotification, setShowNotification] = useState(false);
  return (
    <>
      <div className="w-[80vw] p-6 fixed right-0 top-0 h-fit items-center flex justify-between border-b-1 shadow-lg">
        <h1 className="text-black text-2xl font-bold">Dashboard</h1>
        <div className="flex justify-start items-center mr-4">
          <div className="relative w-10 h-10">
            <Button
              variant="secondary"
              className={"rounded-full w-fit"}
              onClick={() => setShowNotification((prev) => !prev)}
            >
              <BellIcon className="size-4" />
            </Button>
            <div className="bg-red-500 px-2 py-[0.5px] text-xs rounded-2xl absolute top-0">
              99+
            </div>
          </div>

          {/* admin id */}
          <div
            className={`w-fit h-fit bg-white rounded-full shadow-lg text-black mx-4`}
          >
            <img
              src="../../../public/logo and other utilities/lipstick_profile.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Admin</h1>
            <p className="text-gray-700">admin@omnimall.com</p>
          </div>
        </div>
      </div>
      <div
        className={`${showNotification ? "block" : "hidden"} border fixed top-28 right-36 rounded-lg p-2 text-center shadow-lg w-80 min-h-4`}
      >
        <p className="text-gray-500">No notifications</p>
      </div>
    </>
  );
}

export default AdminHeader;
