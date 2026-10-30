import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButtonUser() {
  const navigate = useNavigate();
  return (
    <div className="fixed z-50 bg-white w-fit sm:top-20 mt-2 top-12 p-2 rounded-r-lg">
      <button
        className="flex items-center justify-center text-sm sm:text-md w-fit sm:pr-2"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft /> <span className="sm:block hidden">Go Back</span>
      </button>
    </div>
  );
}

export default BackButtonUser;
