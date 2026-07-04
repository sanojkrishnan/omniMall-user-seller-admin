function ErrorFallback({ loading, error, message }) {
  return (
    <>
      {!loading && error && (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <h1 className="text-md font-semibold text-gray-800">
            {message || "Something went wrong..."}
          </h1>
        </div>
      )}
    </>
  );
}

export default ErrorFallback;
