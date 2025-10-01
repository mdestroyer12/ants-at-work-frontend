import { useEffect, useState } from "react";
import TruckForm from "@components/TruckForm";
import { TruckData } from "@schemas/TruckSchema";
import { Button } from "@components/Button";
import { toast } from "react-toastify";
import { Truck } from "@/types/Truck";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@components/shadcn-ui/Skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { ViewDataTable } from "@components/trucks/ViewDataTable";
import { Pencil, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/shadcn-ui/Tooltip";
import api from "@/api/axios";

const tableColumns: ColumnDef<Truck>[] = [
  {
    accessorKey: "plate",
    header: "Placa",
  },
  {
    accessorKey: "model",
    header: "Modelo",
  },
  {
    accessorKey: "capacity",
    header: "Capacidade (kg)",
  },
  {
    accessorKey: "mileage",
    header: "Quilometragem",
  },
  {
    accessorKey: "lastRevision",
    header: "Última Revisão",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const truck = row.original;
      return (
        <div className="flex gap-2 justify-end">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" className="cursor-pointer" onClick={() => console.log("Editando " + truck.id)}>
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar caminhão</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="destructive" className="cursor-pointer">
                <Trash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir caminhão</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

async function fetchTrucks(): Promise<Truck[]> {
  await api.get("/trucks");
  // const trucks = [
  //   {
  //     id: "1",
  //     plate: "ABC-1234",
  //     model: "Ford F-150",
  //     capacity: 1000,
  //     mileage: 50000,
  //     lastRevision: "2023-10-01",
  //   },
  //   {
  //     id: "2",
  //     plate: "DEF-5678",
  //     model: "Chevrolet Silverado",
  //     capacity: 1200,
  //     mileage: 60000,
  //     lastRevision: "2023-09-15",
  //   },
  // ];

  return trucks;
}

async function handleAddTruck(data: TruckData) {
  await api.post("/trucks", data);
}

export default function TruckList() {
  const [showForm, setShowForm] = useState(false);

  const {
    data: trucks,
    isPending: isLoading,
    isError,
  } = useQuery<Truck[]>({
    queryKey: ["trucks"],
    queryFn: fetchTrucks,
  });

  const truckMutation = useMutation({
    mutationKey: ["save-trucks"],
    mutationFn: handleAddTruck,
    onSuccess: () => {
      toast.success("Caminhão adicionado com sucesso!");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Erro ao adicionar caminhão. Tente novamente.");
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Erro ao carregar caminhões");
    }
  }, [isError]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Caminhões</h1>
      <Button onClick={() => setShowForm(true)} className="mb-4">
        Adicionar Caminhão
      </Button>
      {isLoading ? (
        <Skeleton className="w-full h-[60vh] mb-2" />
      ) : (
        <ViewDataTable columns={tableColumns} data={trucks || []} />
      )}
      <TruckForm
        onSubmit={truckMutation.mutate}
        open={showForm}
        handleOpenChange={(open) => setShowForm(open)}
      />
    </div>
  );
}