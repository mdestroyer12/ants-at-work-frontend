import "react-toastify/dist/ReactToastify.css";
import { Button } from "@components/Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "@components/Loader";
import api from "src/api/axios";
import { setCookie } from "@/lib/utils";

export default function Main() {
  const [userData, setUserData] = useState<{ name: string; email: string; roles: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    setCookie("accessToken", "", -1);
    setCookie("refreshToken", "", -1);
    setCookie("passwordChangeRequired", "", -1);
    delete api.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/users/me");
        setUserData(res.data);
      } catch {
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E5DAD1]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E5DAD1] px-5">
      <img src="/logo.png" alt="Logo" className="h-28 mb-6" />

      <h1 className="text-6xl max-[480px]:text-4xl font-bold font-lexend tracking-tight text-[#4C2D2D] mb-3">
        Bem-vindo(a){userData && `, ${userData.name}`}!
      </h1>

      <p className="text-lg text-[#3F2323] text-center max-w-[600px] mb-8">
        Você está logado no sistema. Explore as funcionalidades e gerencie seu
        acesso de forma simples e segura.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px] justify-center">
        {(userData?.roles.includes("Administrador") || userData?.roles.includes("Gestor")) && (
          <Button
            onClick={() => {
              setIsSubmitting(true);
              window.location.href = "/register";
            }}
            disabled={isSubmitting}
            className="h-12 bg-[#4C2D2D] text-base text-[#EFEAE6] hover:bg-[#3F2323] w-full sm:w-60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader /> : "Cadastrar Usuário"}
          </Button>
        )}

        <Button
          onClick={handleLogout}
          disabled={isSubmitting}
          className="h-12 bg-[#FFFFFF] text-base text-[#4C2D2D] border-2 border-[#4C2D2D] hover:bg-[#E5DAD1] w-full sm:w-60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader /> : "Sair"}
        </Button>
       <Button
          onClick={() => window.location.href = "/trucks"}
          disabled={isSubmitting}
          className="h-12 bg-[#FFFFFF] text-base text-[#4C2D2D] border-2 border-[#4C2D2D] hover:bg-[#E5DAD1] w-full sm:w-60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {isSubmitting ? <Loader /> : "Gerenciar Caminhões"}
        </Button> 
      </div>

      <footer className="mt-10 text-sm text-[#3F2323] opacity-75">
        &copy; {new Date().getFullYear()} Seu Sistema. Todos os direitos
        reservados.
      </footer>
    </div>
  );
}
