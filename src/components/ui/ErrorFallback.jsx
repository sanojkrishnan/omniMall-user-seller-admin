import { ShoppingBag } from "lucide-react";
import P2 from "./P2";
import P from "./P";

function ErrorFallback({ loading, error, message, item }) {
  return (
    <>
      {!loading && error && (
        <div className="w-full h-[60vh] flex flex-col justify-center items-center">
          <h1 className="text-md font-semibold text-gray-800">
            {message || "Something went wrong"}
          </h1>
          <P2 className="text-sm text-neutral-500 mt-1">
            Please try again later.
          </P2>
        </div>
      )}

      {item === "cart_empty" && (
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-lg border border-neutral-200 p-4 mb-4">
            <ShoppingBag
              size={28}
              strokeWidth={1.5}
              className="text-neutral-400"
            />
          </div>
          <P2 className="text-black">Cart's empty</P2>
          <P2 className="text-xs text-neutral-500 max-w-[240px]">
            Add something from any store on OmniMall and it'll show up here.
          </P2>
        </div>
      )}
      {item === "cart_notMatch" && (
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 text-center">
          <P className="text-sm font-medium text-black">No matches</P>
          <P2 className="text-xs text-neutral-500 max-w-[240px]">
            Nothing in your cart matches that search or filter.
          </P2>
        </div>
      )}
    </>
  );
}

export default ErrorFallback;
