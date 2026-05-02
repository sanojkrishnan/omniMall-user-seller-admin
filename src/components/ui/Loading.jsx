
function Loading() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-50">
        {/* Outer Spinner Ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </>
  );
}

export default Loading;
