import React from "react";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

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
        <h2 className="font-bold text-xl text-center">Oops..!</h2>
        <p className="font-normal text-center mt-4">
          Something Went <br /> Wrong
        </p>
        <h1 className="font-extrabold text-6xl mt-4">404</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}

export default NotFound;
