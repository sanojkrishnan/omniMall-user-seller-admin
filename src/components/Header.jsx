import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserCog,
} from "lucide-react";
import OmniMall from "./ui/OmniMall";

function Header() {
  return (
    <>
      <div className="m-2 ml-4 w-fit">
        <OmniMall />
      </div>

      {/* menu */}
      <div className="mr-5 hidden sm:block ">
        <div className="w-fit p-1 text-center text-sm text-white rounded-b-3xl bg-black flex justify-evenly">
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer">
            <HomeIcon className="size-6" />
            <p>Home</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer">
            <ShoppingBagIcon className="size-6" />
            <p>Shop</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer">
            <ShoppingCartIcon className="size-6" />
            <p>Cart</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black transition-all duration-500 rounded-3xl cursor-pointer">
            <div className="w-fit h-fit p-1 rounded-full bg-white text-black">
              <UserCog className="size-5" />
            </div>
            <p>Profile</p>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <div className=" fixed top-3 right-0 flex sm:hidden">
        <div className="w-fit p-1 text-center text-xs text-white rounded-l-3xl bg-black flex flex-col justify-evenly">
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
            <HomeIcon className="size-4" />
            <p>Home</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
            <ShoppingBagIcon className="size-4" />
            <p>Shop</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
            <ShoppingCartIcon className="size-4" />
            <p>Cart</p>
          </div>
          <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
            <div className="w-fit h-fit p-2 rounded-full bg-white text-black">
              <UserCog className="size-4 " />
            </div>
            <p>Profile</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
