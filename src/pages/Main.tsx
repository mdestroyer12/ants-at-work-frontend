import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/button";
import api from "../api/axios";

export default function Main() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Bem-vindo</h1>

      <Button onClick={handleLogout}>Sair</Button>
    </div>
  );
}
