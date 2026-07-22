import { Button } from "./Button";
import P from "./P";
function ConfirmProvider({ children, variant = "user", open, onResult }) {
  return (
    <div
      className={`${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-500 flex items-center justify-center absolute inset-0 backdrop-blur-sm z-10`}
    >
      <div
        className={`${
          open ? "scale-100" : "scale-0"
        } transition-all duration-300 rounded-lg p-4 shadow-lg w-fit h-fit bg-white`}
      >
        <P>{children}</P>
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={() => onResult(true)}
            className={`${variant === "user" ? "" : "bg-[#5f0000]"} w-fit`}
          >
            Confirm
          </Button>
          <Button
            onClick={() => onResult(false)}
            variant="secondary"
            className={`${
              variant === "user" ? "" : "border-[#5f0000] text-[#5f0000]"
            } w-fit`}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmProvider;
