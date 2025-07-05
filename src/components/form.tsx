import LinkText from "./link";
import { Button } from "./button";
import Input from "./input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

const loginSchema = zod.object({
  Email: zod.string().email("Email inválido!"),
  Senha: zod.string().min(6, "A senha deve ter no mínimo 6 caracteres!"),
});
type LoginData = zod.infer<typeof loginSchema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  function handleLogin(data: LoginData) {
    console.log("Dados enviados:", data);
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="min-h-screen flex flex-col items-center m-5">
      <img src="../../public/logo.png" alt="" className="h-30 mb-3 mt-5" />
      <p className="font-bold text-gray-500 text-sm sm:text-lg w-full">Comece agora!</p>

      <h1 className="text-7xl max-[480px]:text-4xl font-bold font-lexend tracking-tight mb-3 w-full">
        Faça seu <span className="text-[#4C2D2D]">login</span>
      </h1>

      {/* <LinkText text={"Não tem uma conta? "} link={" Crie aqui."} destiny={"registro"} className="mb-6 text-xs sm:text-sm"/> */}

      <Input
        name="Email"
        type="email"
        id="InputEmail"
        placeholder="Insira seu email..."
        register={register}
        error={errors.Email?.message}
      />

      <Input
        name="Senha"
        type="password"
        id="InputPassword"
        placeholder="Insira sua senha..."
        register={register}
        error={errors.Senha?.message}
      />

      <div className="flex flex-col sm:flex-row justify-center items-start w-full mt-5">
        <LinkText
          text={"Esqueceu a senha?"}
          link={" Clique aqui!"}
          destiny={"redefinacao"}
          className="text-xs sm:text-sm"
        />
        <Button className="h-12 bg-[#4C2D2D] text-base text-[#EFEAE6] hover:bg-   [#3F2323] w-36 sm:w-50 max-[640px]:w-44 max-[600px]:w-full max-[480px]:w-full  mt-2">
          Entrar
        </Button>
      </div>
    </form>
  );
}
