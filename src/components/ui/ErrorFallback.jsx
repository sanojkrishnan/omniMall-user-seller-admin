import P2 from "./P2";

function ErrorFallback({ loading, error, message }) {
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
    </>
  );
}

export default ErrorFallback;
