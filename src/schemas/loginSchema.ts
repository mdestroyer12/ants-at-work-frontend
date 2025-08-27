import * as z from "zod";

export const resetRequestSchema = z.object({
  email: z.string().email("Por favor, insira um email válido.")
});

export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(8, "Insira uma senha válida.")
});

export const registerSchema = z.object({
  name: z.string().nonempty("Por favor, insira um nome de usuário válido"),
  email: z.string().email("Por favor, insira um email válido."),
  role: z.string().min(1,"Selecione uma opção válida!")
});

export const resetConfirmSchema = z.object({
  newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres!")
});

export type ResetConfirmData = z.infer<typeof resetConfirmSchema>;

export type LoginData = z.infer<typeof loginSchema>;

export type RegisterData = z.infer<typeof registerSchema>;

export type ResetRequestData = z.infer<typeof resetRequestSchema>;




