import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FleetCard from "@components/trucks/FleetCard";
import { Button } from "@components/shadcn-ui/Button";
import { Skeleton } from "@components/shadcn-ui/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/shadcn-ui/Dialog";
import { Input } from "@components/shadcn-ui/Input";
import { FleetSchema, FleetData } from "@schemas/FleetSchema";
import { Loader2 } from "lucide-react";

// --- SIMULAÇÃO DE API E BANCO DE DADOS ---

interface Truck {
  plate: string;
  model: string;
  capacity: number;
  mileage: number;
  lastRevision: string;
  status: "active" | "maintenance" | "inactive";
}

interface Fleet {
  id: string;
  name: string;
  description: string;
  trucks: Truck[];
}

// 1. MOCK CENTRALIZADO: Esta variável atuará como nosso "banco de dados" em memória.
const MOCKED_FLEETS: Fleet[] = [
  {
    id: "fleet-1",
    name: "Frota Principal - Longa Distância",
    description: "Caminhões pesados para rotas interestaduais.",
    trucks: [
      { plate: "ABC-1111", model: "Volvo FH 540", capacity: 25000, mileage: 150000, lastRevision: "2025-08-01", status: "active" },
      { plate: "DEF-2222", model: "Scania R450", capacity: 27000, mileage: 120000, lastRevision: "2025-07-15", status: "maintenance" },
      { plate: "GHI-3333", model: "Mercedes-Benz Actros", capacity: 29000, mileage: 200000, lastRevision: "2025-06-20", status: "active" },
    ],
  },
  {
    id: "fleet-2",
    name: "Frota Urbana - Entregas Locais",
    description: "Veículos leves para distribuição dentro da cidade.",
    trucks: [
      { plate: "VWX-8888", model: "VW Delivery Express", capacity: 4000, mileage: 80000, lastRevision: "2025-09-01", status: "active" },
    ],
  },
  { id: "fleet-3", name: "Frota Refrigerada", description: "Caminhões com baú refrigerado.", trucks: [] },
];

// 2. FUNÇÕES DA API SIMULADA
async function fetchFleets(): Promise<Fleet[]> {
  console.log("Buscando frotas...");
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simula delay da rede
  return JSON.parse(JSON.stringify(MOCKED_FLEETS)); // Retorna uma cópia para evitar mutações diretas
}

async function createFleet(data: FleetData): Promise<Fleet> {
  console.log("Salvando nova frota:", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newFleet: Fleet = {
    id: `fleet-${Date.now()}`,
    name: data.name,
    description: data.description,
    trucks: [],
  };
  MOCKED_FLEETS.push(newFleet); // Modifica o "banco de dados"
  return newFleet;
}


export default function FleetList() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: fleets, isLoading: loadingFleets } = useQuery<Fleet[]>({
    queryKey: ["fleets"],
    queryFn: fetchFleets,
  });

  const addFleetMutation = useMutation({
    mutationFn: createFleet,
    onSuccess: () => {
      toast.success("Frota adicionada com sucesso!");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
    },
    onError: () => {
      toast.error("Erro ao adicionar frota.");
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FleetData>({
    resolver: zodResolver(FleetSchema),
  });

  const handleFormSubmit = (data: FleetData) => {
    addFleetMutation.mutate(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset(); 
    }
    setShowForm(open);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Frotas</h1>
        <Button onClick={() => setShowForm(true)}>
          Adicionar Frota
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Frota</DialogTitle>
            <DialogDescription>
              Preencha os detalhes abaixo para criar uma nova frota.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome da Frota</label>
              <Input id="name" {...register("name")} placeholder="Ex: Frota Sudeste" />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
              <Input id="description" {...register("description")} placeholder="Ex: Caminhões para entregas na região..." />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addFleetMutation.isPending}>
                {addFleetMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Frota
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loadingFleets ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-[220px] rounded-lg" />
          <Skeleton className="w-full h-[220px] rounded-lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {fleets?.map((fleet) => {
            const trucksQuantity = fleet.trucks.length;
            const activeTrucks = fleet.trucks.filter((t) => t.status === "active").length;
            const maintenanceTrucks = fleet.trucks.filter((t) => t.status === "maintenance").length;
            const averageCapacity = trucksQuantity > 0 ? Math.round(fleet.trucks.reduce((sum, t) => sum + t.capacity, 0) / trucksQuantity) : 0;

            return (
              <FleetCard
                key={fleet.id}
                fleetId={fleet.id}
                name={fleet.name}
                trucks={fleet.trucks}
                trucksQuantity={trucksQuantity}
                averageCapacity={averageCapacity}
                activeTrucks={activeTrucks}
                maintenanceTrucks={maintenanceTrucks}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}