import { ShoppingCart } from "lucide-react";

function CartLoading() {
  return (
    <div className="w-[50px] h-[80px] overflow-hidden">
      <div className="flex justify-center relative">
        <div className="w-[10px] absolute left-0 top-2 animate-width origin-right">
          <div>
            <div className="w-full border rounded-lg border-black"></div>
          </div>
        </div>
        <div className="w-[20px] absolute left-[-10px] top-4 animate-width origin-right">
          <div>
            <div className="w-full border rounded-lg border-black"></div>
          </div>
        </div>
        <div className="w-[10px] absolute left-0 top-6 animate-width origin-right">
          <div>
            <div className="w-full border rounded-lg border-black"></div>
          </div>
        </div>
        <div className="animate-ride">
          <div className="  w-[30px] h-[30px] animate-wheelie origin-bottom-left ">
            <ShoppingCart className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className=" w-[60px] border-t-2 border-black"></div>
      </div>
      <div className="flex  w-[80px] animate-loopScroll">
        <div className=" w-[5px] h-[2px] ml-2 bg-black"></div>
        <div className=" w-[5px] h-[2px] ml-2 bg-black"></div>
        <div className=" w-[5px] h-[2px] ml-2 bg-black"></div>
        <div className=" w-[5px] h-[2px] ml-2 bg-black"></div>
        <div className=" w-[5px] h-[2px] ml-2 bg-black"></div>
        <div className=" w-[5px] h-[2px] ml-2 bg-black"></div>
      </div>

      <div className="flex items-center justify-center mt-2 w-full overflow-visible">
        <p className="text-xs font-thin">Loading...</p>
      </div>
    </div>
  );
}

export default CartLoading;
