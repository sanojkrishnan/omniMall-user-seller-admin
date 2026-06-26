import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserCog,
} from "lucide-react";
import OmniMall from "./OmniMall";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header({ hideMenu, borderLine }) {
  const { user } = useSelector((state) => state.auth);
  console.log("Header user:", user);
  const navigate = useNavigate();

  return (
    <div
      className={`w-full fixed z-50 m-0 top-0 h-18 flex items-center justify-between ${borderLine ? "border-b-1 shadow-lg bg-white" : ""}`}
    >
      <div className="m-2 ml-4 w-fit">
        <OmniMall />
      </div>

      {/* menu */}
      {!hideMenu && (
        <div className={`mr-5 hidden sm:block`}>
          <div className="w-fit p-1 text-center text-sm text-white rounded-b-3xl bg-black flex justify-evenly">
            <div
              className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer"
              onClick={() => {
                user ? navigate("/user") : navigate("/");
              }}
            >
              <HomeIcon className="size-6" />
              <p>Home</p>
            </div>
            <div
              className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer"
              onClick={() => {
                user ? navigate("/user/shop") : navigate("/shop");
              }}
            >
              <ShoppingBagIcon className="size-6" />
              <p>Shop</p>
            </div>
            <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer">
              <ShoppingCartIcon className="size-6" />
              <p>Cart</p>
            </div>
            <div
              onClick={() => {
                user ? null : navigate("/login");
              }}
              className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer"
            >
              <div
                className={`w-fit h-fit p-1 bg-white rounded-full text-black`}
              >
                {user && user.provider === "google" && user.profileImage.url ? (
                  <img
                    src={user.profileImage.url}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : user &&
                  user.provider === "local" &&
                  user.profileImage.url ? (
                  <img
                    src={user.profileImage.url}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserCog className="size-6 " />
                )}
              </div>
              {user ? <p>Profile</p> : <p>Login</p>}
            </div>
          </div>
        </div>
      )}

      {/* mobile menu */}
      {!hideMenu && (
        <div
          className={`fixed top-3 right-0 flex sm:hidden ${hideMenu ? "hidden" : "block"}`}
        >
          <div className="w-fit p-1 text-center text-xs text-white rounded-l-3xl bg-black flex flex-col justify-evenly">
            <div
              className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer"
              onClick={() => {
                user ? navigate("/user") : navigate("/");
              }}
            >
              <HomeIcon className="size-4" />
              <p>Home</p>
            </div>
            <div
              className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer"
              onClick={() => {
                user ? navigate("/user/shop") : navigate("/shop");
              }}
            >
              <ShoppingBagIcon className="size-4" />
              <p>Shop</p>
            </div>
            <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
              <ShoppingCartIcon className="size-4" />
              <p>Cart</p>
            </div>
            <div
              onClick={() => {
                user ? null : navigate("/login");
              }}
              className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer"
            >
              <div
                className={`w-fit h-fit p-1 bg-white rounded-full text-black`}
              >
                {user && user.provider === "google" && user.profileImage.url ? (
                  <img
                    src={user.profileImage.url}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : user &&
                  user.provider === "local" &&
                  user.profileImage.url ? (
                  <img
                    src={URL.createObjectURL(user.profileImage)}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserCog className="size-6 " />
                )}
              </div>
              {user ? <p>Profile</p> : <p>Login</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
