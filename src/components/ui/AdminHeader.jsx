import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { BellIcon } from "lucide-react";

function AdminHeader({ selection }) {
  const [showNotification, setShowNotification] = useState(false);

  const divRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full py-4 px-6 sticky top-0 z-40 bg-white items-center flex justify-between border-b shadow-lg">
      <h1 className="text-black md:ml-14 text-2xl font-bold">{selection}</h1>
      <div className="flex justify-start items-center mr-4">
        <div ref={divRef} className="relative">
          <Button
            variant="secondary"
            className="rounded-full w-fit"
            onMouseDown={(e) => {
              e.stopPropagation(); // block document mousedown handler
              setShowNotification((prev) => !prev);
            }}
          >
            <BellIcon className="size-4" />
          </Button>

          {/* notification bar */}

          {showNotification && (
            <div className="border absolute top-16 right-[-130px] rounded-lg rounded-t-none p-2 text-center shadow-lg w-80 min-h-4 bg-white">
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
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
          <p className="text-gray-700">admin123@omnimall.com</p>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
