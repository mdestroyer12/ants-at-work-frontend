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
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/shadcn-ui/Tooltip";
import { Dialog, DialogContent } from "@components/Dialog";

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
              <Button variant="outline">
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Editar caminhão
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="destructive">
                <Trash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Excluir caminhão
            </TooltipContent>
          </Tooltip>
          
        </div>
      );
    }
  }
]

async function fetchTrucks(): Promise<Truck[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const trucks = [
    { id: "1", plate: "ABC-1234", model: "Ford F-150", capacity: 1000, mileage: 50000, lastRevision: "2023-10-01" },
    { id: "2", plate: "DEF-5678", model: "Chevrolet Silverado", capacity: 1200, mileage: 60000, lastRevision: "2023-09-15" }
  ]

  return trucks;
}

async function handleAddTruck(data: TruckData) {
    //api.post("/trucks", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

export default function TruckList() {
  const [showForm, setShowForm] = useState(false);

  const { data: trucks, isPending: isLoading, isError } = useQuery<Truck[]>({
    queryKey: ['trucks'],
    queryFn: fetchTrucks
  })

  const truckMutation = useMutation({
    mutationKey: ['save-trucks'],
    mutationFn: handleAddTruck,
    onSuccess: () => {
      toast.success("Caminhão adicionado com sucesso!");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Erro ao adicionar caminhão. Tente novamente.");
    }
  })

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
        // <table className="w-full border">
        //   <thead>
        //     <tr className="bg-[#E5DAD1] text-[#4C2D2D]">
        //       <th className="p-3 text-left">Placa</th>
        //       <th className="p-3 text-left">Modelo</th>
        //       <th className="p-3 text-left">Capacidade (kg)</th>
        //       <th className="p-3 text-left">Quilometragem</th>
        //       <th className="p-3 text-left">Última Revisão</th>
        //       <th className="p-3 text-left">Ações</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {trucks?.map((truck) => (
        //       <tr key={truck.plate} className="border-b border-[#CABAAE] hover:bg-[#F0EBE5]">
        //         <td className="p-3">{truck.plate}</td>
        //         <td className="p-3">{truck.model}</td>
        //         <td className="p-3">{truck.capacity}</td>
        //         <td className="p-3">{truck.mileage}</td>
        //         <td className="p-3">{new Date(truck.lastRevision).toLocaleDateString()}</td>
        //         {/* Buttons somente visuais, sem funcionalidade real. Aguarde poder testar o front com o back para adicionar essas functions*/}
        //         <td className="p-3">
        //           <button className="text-blue-600 hover:underline">Editar</button>
        //           <button className="text-red-600 hover:underline ml-4">Excluir</button>
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
        <ViewDataTable columns={tableColumns} data={trucks || []} />
      )}
      <Dialog open={showForm}>
        <DialogContent>
          <TruckForm onSubmit={truckMutation.mutate} onClose={() => setShowForm(false)} loading={truckMutation.isPending} />
        </DialogContent>
      </Dialog>
      {/* {showForm && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.74)' }}
        >
          <div className="bg-[#F9F5F2] rounded-lg shadow-xl p-2 max-w-lg w-full">
            
          </div>
        </div>
      )} */}
    </div>
  );
} 