import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import api from "../../api/axios";
import { loginSchema } from "../../schemas/loginSchema";
import Input from "./input";
import LinkText from "../link";
import { Button } from "../button";

type LoginData = zod.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function handleLogin(data: LoginData) {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      window.location.href = "/main";
    } catch (err: any) {
      alert("Login inválido");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="min-h-screen flex flex-col items-center m-15 pt-10"
    >
      <img src="/logo.png" alt="Logo" className="h-30 mb-3 mt-5" />

      <p className="font-semibold text-start text-gray-500 text-sm sm:text-lg w-full">
        Comece agora!
      </p>

      <h1 className="text-7xl max-[480px]:text-4xl font-bold font-lexend tracking-tight mb-3 w-full">
        Faça seu <span className="text-[#4C2D2D]">login</span>
      </h1>

      <Input
        text="Email"
        type="email"
        id="InputEmail"
        placeholder="Insira seu email..."
        register={register}
        error={errors.email?.message}
      />

      <Input
        text="Senha"
        type="password"
        id="InputPassword"
        placeholder="Insira sua senha..."
        register={register}
        error={errors.password?.message}
      />

      <div className="flex flex-col sm:flex-row justify-center items-start w-full mt-5 gap-4">
        <LinkText
          text="Esqueceu a senha?"
          link=" Clique aqui!"
          destiny="redefinacao"
          className="text-xs"
        />
        <Button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="h-12 bg-[#4C2D2D] text-base text-[#EFEAE6] hover:bg-[#3F2323] w-full sm:w-60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
