import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButtonUser({ variant = "primary" }) {
  const navigate = useNavigate();
  return (
    <>
      <div className={` w-fit p-2 rounded-r-lg`}>
        <button
          onClick={() => navigate(-1)}
          className={` ${(variant === "primary" && "text-white") || (variant === "secondary" && "text-black")} mb-5 flex items-center gap-2 text-sm font-medium hover:opacity-60`}
        >
          <ArrowLeft className="h-4 w-4" />{" "}
          <span className="sm:block hidden">Go Back</span>
        </button>
      </div>
    </>
  );
}

export default BackButtonUser;
