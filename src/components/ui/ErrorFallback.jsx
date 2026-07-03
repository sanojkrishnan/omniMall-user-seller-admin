function ErrorFallback({ loading, error }) {
  return (
    <>
      {!loading && error && (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <h1 className="text-md font-semibold text-gray-800">
            Something went wrong...
          </h1>
        </div>
      )}
    </>
  );
}

export default ErrorFallback;
