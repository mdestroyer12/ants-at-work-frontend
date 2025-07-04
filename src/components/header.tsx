import { Link } from "react-router-dom";
import { Button } from "../components/button";

export default function Header() {
  return (
    <div className="flex justify-end items-center w-screen">
      <Link to="/login"> 
        <Button className="bg-[#4C2D2D] hover:bg-[#3F2323] m-2">Login</Button>
      </Link>
    </div>
  );
}
