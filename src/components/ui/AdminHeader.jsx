import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { BellIcon } from "lucide-react";
import P2 from "./P2";
import H1 from "./H1";

function AdminHeader({ selection }) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDot, setNotificationDot] = useState(true);
  const [ringKey, setRingKey] = useState(0);

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
              e.stopPropagation();
              setShowNotification((prev) => !prev);
              setNotificationDot(false);
              setRingKey((prev) => prev + 1);
            }}
          >
            <div key={ringKey} className="relative">
              <BellIcon className="size-4 origin-top animate-bellRing" />
              <div
                className={`
                absolute -top-1 -right-1 p-1 rounded-full bg-red-500
                transition-all duration-300
                ${notificationDot ? "scale-100 opacity-100" : "scale-0 opacity-0"}
              `}
              />
            </div>
          </Button>

          {/* notification bar */}

          <div
            className={`border absolute top-16 right-[-130px] rounded-b-lg p-2 shadow-lg w-80 min-h-4 ${showNotification ? "scale-y-100 " : "scale-y-0 "} origin-top transition-all duration-500 bg-white`}
          >
            <P2
              className={`${showNotification ? "opacity-100" : "opacity-0"} transition-all duration-200 text-gray-500`}
            >
              No notifications
            </P2>
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
          <H1 className="font-semibold lg:text-lg mt-0 text-left">Admin</H1>
          <P2 className="text-gray-700 text-left">admin123@omnimall.com</P2>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
