import {
  CircleX,
  RotateCw,
  ServerCrash,
  ShoppingBag,
  WifiOff,
} from "lucide-react";
import P2 from "./P2";
import P from "./P";
import { Button } from "./Button";
import { useToastError } from "../../hooks/useToastError";

// accepts a string, an Error, an axios error, or { statusCode, message }
const getStatusCode = (error, statusCode) =>
  statusCode ??
  error?.statusCode ??
  error?.status ??
  error?.response?.status ??
  null;

const getErrorText = (error, message) => {
  if (message) return message;
  if (typeof error === "string") return error;
  return error?.message ?? error?.response?.data?.message ?? null;
};

function ErrorFallback({
  loading,
  error,
  message,
  statusCode,
  item,
  onRetry,
  className = "",
}) {
  // remove useState, useDispatch, clearError, setPage
  const code = getStatusCode(error, statusCode);
  const isServerError = code !== null && Number(code) >= 500;
  const text = getErrorText(error, message);
  const isNetworkError = /unable to connect|network|connection/i.test(
    text ?? "",
  );

  const handleRetry = () => (onRetry ? onRetry() : window.location.reload());

  useToastError({
    errorMessage: error,
    fallbackErrorMessage: "Failed to load products",
  });

  return (
    <>
      {!loading && error && (
        <div
          role="alert"
          className={`w-full h-[80vh] flex flex-col items-center justify-center gap-3 text-center px-4 py-12 ${className}`}
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            <div className="relative rounded-full bg-red-500/10 p-4 animate-shake">
              {isServerError ? (
                <ServerCrash className="size-8 sm:size-10 text-red-500" />
              ) : isNetworkError ? (
                <WifiOff className="size-8 sm:size-10 text-red-500" />
              ) : (
                <CircleX className="size-8 sm:size-10 text-red-500" />
              )}
            </div>
          </div>

          <div className="max-w-sm">
            <p className="font-semibold text-sm sm:text-base">
              {isServerError
                ? "Server error"
                : isNetworkError
                  ? "No connection"
                  : "Something went wrong"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {isServerError
                ? "Something went wrong on our side. Please reload and try again in a moment."
                : (text ?? "Please try again.")}
            </p>
            {isServerError && (
              <p className="text-xl text-gray-400 mt-1">Error code: {code}</p>
            )}
          </div>

          <Button
            variant="secondary"
            className="w-fit flex items-center gap-2 text-sm"
            onClick={handleRetry}
          >
            <RotateCw className="size-4" />
            {isServerError ? "Reload" : "Try again"}
          </Button>
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
