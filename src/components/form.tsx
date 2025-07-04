import LinkText from "./link";
import { Button } from "./button";
import Input from "./input";

type FormProps = {
  title: string;
};

export default function Form({ title }: FormProps) {
  return (
    <form className="flex flex-col items-center justify-start px-6">
      <p className="font-semibold text-gray-500 text-lg w-full">Comece agora!</p>

      <h1 className="text-7xl font-bold font-lexend tracking-tight mb-4 text-center flex align-items">
         {title} <span className="text-[#4C2D2D]"> login.</span>
      </h1>


      <LinkText text={"Não tem uma conta? "} link={" Crie aqui."} destiny={"registro"}/>
      <Input name={"Email"} type={"email"}/>
      <Input name={"Senha"} type={"password"}/>
      <div className="flex justify-center items-center w-full mt-5 text-sm">
        <LinkText text={"Esqueceu a senha? "} link={" Redefina aqui."} destiny={"redefinacao"}/>
        <Button className="w-50">Entrar</Button>
      </div>
      
    </form>
  );
}
