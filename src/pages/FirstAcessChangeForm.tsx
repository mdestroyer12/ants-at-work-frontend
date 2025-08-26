import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/axios";
import Input from "../components/input";
import { Button } from "../components/button";
import Loader from "../components/loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FirstAccessData, firstAccessSchema } from "../schemas/loginSchema";
import { useState } from "react";

export default function FirstAccessPasswordChange() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FirstAccessData>({
    resolver: zodResolver(firstAccessSchema),
  });

  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword]= useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  async function handleFirstAccessChange(data: FirstAccessData) {
    if (confirmPassword !== data.newPassword) {
      toast.error("As senhas não coincidem!");
      return;
    } 
    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.post("/auth/password/first-access-change",data);

      if (res.status === 200) {
        toast.success("Senha alterada com sucesso!");
        navigate("/login");
      } else {
        toast.error("Erro ao alterar a senha.");
      }
    } catch (err) {
      toast.error("Erro inesperado ao trocar a senha.");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit(handleFirstAccessChange)}
        className="flex flex-col items-center max-w-[500px] w-full p-5"
      >
        <img src="/logo.png" alt="Logo" className="h-30 mb-3 mt-5" />

        <h1 className="text-5xl font-bold font-lexend tracking-tight mb-6 text-center">
          Trocar <span className="text-[#4C2D2D]">Senha</span>
        </h1>

        <Input
        text="Senha"
        type="password"
        id="newPassword"
        placeholder="Insira a senha do usuário..."
        register={register}
        error={errors.newPassword?.message}
      />

      <Input
        text="Confirmar Senha"
        type="password"
        id="passwordConfirm"
        placeholder="Confirme a senha do usuário  ..."
        value = {confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value)
        }}
        error={confirmPasswordError}
      />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 h-12 bg-[#4C2D2D] text-base text-[#EFEAE6] hover:bg-[#3F2323] w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader /> : "Alterar senha"}
        </Button>
      </form>
    </div>
  );
}
