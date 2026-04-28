function Loading() {
  return (
    <div className="flex items-center justify-center w-[100vw] h-[100vh] bg-white">
      <div className="w-[80px] h-[80px]">
        <div className="flex justify-center relative">
          <div className="w-[20px] absolute left-0 top-2 animate-width origin-right">
            <div>
              <div className="w-full border rounded-lg border-black"></div>
            </div>
          </div>
          <div className="w-[30px] absolute left-[-10px] top-4 animate-width origin-right">
            <div>
              <div className="w-full border rounded-lg border-black"></div>
            </div>
          </div>
          <div className="w-[20px] absolute left-0 top-6 animate-width origin-right">
            <div>
              <div className="w-full border rounded-lg border-black"></div>
            </div>
          </div>
          <div className="animate-ride">
            <img
              className="  w-[30px] h-[30px] animate-wheelie animate-ride origin-bottom "
              src="/src/assets/logo and other utilities/Empty-Cart-PNG-Pic.png"
              alt="cart"
            />
          </div>
        </div>

        <div className="relative">
          <div className=" w-[60px] border-t-2 border-black"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
