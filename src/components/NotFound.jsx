import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";
import H2 from "./ui/H2";
import P2 from "./ui/P2";
import H1 from "./ui/H1";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#D8D8D8] w-full h-screen flex justify-center items-center">
      <div className="w-fit flex flex-col justify-center items-center">
        <img
          className="w-[100px] h-[100px] mx-auto"
          src="/src/assets/404.png"
          alt="404 not found"
        />
        <H2 className="font-bold">Oops..!</H2>
        <P2 className="mt-4">
          Something Went <br /> Wrong
        </P2>
        <H1 className="font-extrabold text-6xl mt-4">404</H1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}

export default NotFound;
