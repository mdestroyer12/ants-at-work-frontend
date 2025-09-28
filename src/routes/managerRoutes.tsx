import { useEffect, useState } from "react";
import api from "src/api/axios";
import Loader from "@components/Loader";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router";
import { getCookie } from "src/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

interface UserResponse {
  roles: string[];
}

async function fetchUser(): Promise<UserResponse> {
  const res = await api.get("/users/me");
  return res.data;
}

export default function ManagerRoute({ children }: Props) {
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(false);
  const { data, isPending, isError } = useQuery<UserResponse, Error>({
    queryKey: ["user-me"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    const roles = (data as UserResponse).roles;
    if (roles.includes("Administrador") || roles.includes("Gestor")) {
      setIsManager(true);
      return;
    }
    navigate("/login");
  }, [data, navigate]);

  useEffect(() => {
    if (!isError) return;
    
    toast.error("Erro ao carregar dados do usuário");
    navigate("/login");
  }, [isError, navigate])

  const token = getCookie("accessToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <>{isManager && children}</>;
}
