import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButtonUser({ variant = "primary" }) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`${variant === "primary" ? "bg-white" : ""} w-fit p-2 rounded-r-lg`}
      >
        {variant === "primary" && (
          <button
            className="flex items-center justify-center text-sm sm:text-md w-fit sm:pr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />{" "}
            <span className="sm:block hidden">Go Back</span>
          </button>
        )}
        {variant === "secondary" && (
          <button
            onClick={() => navigate("/user/profile")}
            className="mb-5 flex items-center gap-2 text-sm font-medium hover:opacity-60"
          >
            <ArrowLeft className="h-4 w-4" />{" "}
            <span className="sm:block hidden">Go Back</span>
          </button>
        )}
      </div>
    </>
  );
}

export default BackButtonUser;
