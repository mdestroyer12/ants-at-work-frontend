import * as z from "zod";

export const truckSchema = z.object({
  plate: z.string().min(7, "Placa inválida"),
  model: z.string().nonempty("Modelo é obrigatório"),
  year: z.string().min(4, "Ano inválido"),
  capacity: z.string().nonempty("Capacidade é obrigatória"),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  type: z.string().optional(),
  detail: z.string().optional(),
});

export type TruckData = z.infer<typeof truckSchema>;