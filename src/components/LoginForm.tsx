import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData, loginSchema } from "@schemas/LoginSchema";
import { toast } from "react-toastify";
import { Button } from "@components/Button";
import LinkText from "@components/LinkText";
import Loader from "@components/Loader";
import FormInput from "@components/FormInput";
import api from "src/api/axios";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function handleLogin(data: LoginData) {
    try {
      const res = await api.post("/auth/login", data);
      if (res.status === 200) {
        document.cookie = `accessToken=${res.data.accessToken}; refreshToken=${res.data.refreshToken}; path=/;`;
        localStorage.setItem("passwordChangeRequired", res.data.passwordChangeRequired);
        if (res.data.passwordChangeRequired) {
          toast.info(
            "Você precisa trocar a sua senha de primeiro acesso antes de continuar."
          );
          window.location.href = "/first-access-change";
          return;
        }
        toast.success("Login efetuado com sucesso!");
        window.location.href = "/main";
      } else {
        toast.error("Erro ao efetuar o login.");
      }
    } catch {
      toast.error("Erro inesperado.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="min-h-screen flex flex-col items-center m-15 pt-10"
    >
      <img src="/logo.png" alt="Logo" className="h-30 mb-3 mt-5" />

      <h1 className="text-7xl max-[480px]:text-4xl font-bold font-lexend tracking-tight mb-3 w-full">
        Faça seu <span className="text-[#4C2D2D]">login</span>
      </h1>

      <FormInput
        text="Email"
        type="email"
        id="email"
        placeholder="Insira seu email..."
        register={register}
        error={errors.email?.message}
      />

      <FormInput
        text="Senha"
        type="password"
        id="password"
        placeholder="Insira sua senha..."
        register={register}
        error={errors.password?.message}
      />

      <div className="flex flex-col sm:flex-row justify-center items-start w-full mt-5 gap-4">
        <LinkText
          text="Esqueceu a senha?"
          link="Clique aqui!"
          destiny="reset-request"
          className="text-xs"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 bg-[#4C2D2D] text-base text-[#EFEAE6] hover:bg-[#3F2323] w-full sm:w-60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader /> : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
