import * as z from "zod";


const placaRegex = /^[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}$/;

export const truckSchema = z.object({
  plate: z.string()
    .min(1, { message: "A placa é obrigatória" })
    .regex(placaRegex, { message: "Placa inválida. Use o formato ABC1234 ou ABC1D23." }),
  model: z.string().min(1, { message: "O modelo é obrigatório" }),
  capacity: z.coerce.number().positive("A capacidade deve ser um número positivo"),
  length: z.coerce.number().positive("O comprimento deve ser um número positivo"),
  width: z.coerce.number().positive("A largura deve ser um número positivo"),
  height: z.coerce.number().positive("A altura deve ser um número positivo"),
  type: z.string().min(1, "O tipo é obrigatório"),
  detail: z.string().optional(),
  lastRevision: z.coerce.date({
    errorMap: () => ({ message: "Por favor, insira uma data válida." }),
  }),
  mileage: z.coerce.number().positive("A quilometragem deve ser um número positivo"),
});

export type TruckData = z.infer<typeof truckSchema>;