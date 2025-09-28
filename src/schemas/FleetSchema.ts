import * as z from "zod";

export const FleetSchema = z.object({
    nome: z.string().min(1, { message: "O nome é obrigatório" }),
    quantidade: z.coerce.number().positive("A quantidade deve ser um número positivo"),
    capacidade: z.coerce.number().positive("A capacidade deve ser um número positivo"),
    quantidadeEmManutencao: z.coerce.number().positive("A quantidade em manutenção deve ser um número positivo"),
    quantidadeDisponivel: z.coerce.number().positive("A quantidade disponível deve ser um número positivo"),
});

export type FleetData = z.infer<typeof FleetSchema>;