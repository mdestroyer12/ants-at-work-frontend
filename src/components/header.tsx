import { Link } from "react-router-dom";
import { Button } from "../components/button";

export default function Header() {
  return (
    <div className="flex justify-between items-center w-screen p-4">
      <img src="/logo.png" className="h-11 w-16 object-contain" alt="Logo" />


      <div className="flex gap-4">
        <Button className="bg-[#4C2D2D] hover:bg-[#3F2323] text-white cursor-pointer flex items-center gap-2 px-4 py-2 rounded-2xl pr-1">
          Inicio
          <div className="border rounded-full h-7 w-7 flex justify-center items-center bg-[#EFEAE6]">
            <i className="fa-solid fa-house text-[#4C2D2D] text-sm"></i>
          </div>
        </Button>
        <Button className="bg-[#4C2D2D] hover:bg-[#3F2323] text-white cursor-pointer px-4 py-2 rounded-md">Inicio</Button>
        <Button className="bg-[#4C2D2D] hover:bg-[#3F2323] text-white cursor-pointer px-4 py-2 rounded-md">Inicio</Button>
      </div>

      <Link to="/login">
        <Button className="bg-[#4C2D2D] hover:bg-[#3F2323] text-white cursor-pointer px-4 py-2 rounded-md">Login</Button>
      </Link>
    </div>
  );
}
