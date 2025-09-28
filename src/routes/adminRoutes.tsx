import { useEffect, useState } from "react";
import api from "src/api/axios";
import Loader from "@components/Loader";
import { toast } from "react-toastify";
import { Navigate } from "react-router";
import { getCookie } from "src/lib/utils";

interface Props {
  children: React.ReactNode;
}

export default function ManagerRoute({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  //const token = localStorage.getItem("accessToken");
  const token = getCookie("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/users/me");
        if (res.data.roles && res.data.roles.includes("Administrador")) {
          setIsAdmin(true);
        } else {
          window.location.href = "/login"; 
        }
      } catch (err) {
        toast.error("Erro ao carregar dados do usuário");
        window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <>{isAdmin && children}</>;
}
