import { useNavigate } from "react-router-dom";

function OmniMall() {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer" onClick={navigate("/")}>
      <h1 className="font-mono font-semibold">
        <span className="text-black bg-white border-[0.25px] border-black rounded-s-md pl-1 py-1">
          Omni
        </span>
        <span className="text-white bg-black border-[0.25px] border-black rounded-e-md pr-1 py-1">
          Mall
        </span>
      </h1>
    </div>
  );
}

export default OmniMall;
