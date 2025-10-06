import { useState } from "react";
import TruckForm from "@components/TruckForm";
import { TruckData } from "@schemas/TruckSchema";
import { Button } from "@components/shadcn-ui/Button";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@components/shadcn-ui/Skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { ViewDataTable } from "@components/trucks/ViewDataTable";
import { ArrowLeft, Pencil, Trash, Truck, Wrench, Activity, Gauge } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/shadcn-ui/Tooltip";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@components/shadcn-ui/badge";
import PageHeader from "@components/PageHeader";

interface Truck extends TruckData {
  id: string;
}
interface Fleet {
  id: string;
  name: string;
  description: string;
  trucksQuantity: number;
  averageCapacity: number;
  activeTrucks: number;
  maintenanceTrucks: number;
  trucks: Truck[];
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    active: "default",
    maintenance: "secondary",
    inactive: "destructive",
};

const statusTextMap: { [key: string]: string } = {
    active: "Ativo",
    maintenance: "Em Manutenção",
    inactive: "Inativo",
};

function calculateFleetIndicators(trucks: Truck[]): Omit<Fleet, 'id' | 'name' | 'description' | 'trucks'> {
  const trucksQuantity = trucks.length;
  const activeTrucks = trucks.filter(truck => truck.status === 'active').length;
  const maintenanceTrucks = trucks.filter(truck => truck.status === 'maintenance').length;
  const averageCapacity = trucksQuantity > 0 
    ? Math.round(trucks.reduce((sum, truck) => sum + truck.capacity, 0) / trucksQuantity)
    : 0;

  return {
    trucksQuantity,
    activeTrucks,
    maintenanceTrucks,
    averageCapacity,
  };
}

const MOCKED_FLEETS: Fleet[] = [
    {
      id: "fleet-1",
      name: "Frota Principal - Longa Distância",
      description: "Caminhões pesados para rotas interestaduais.",
      trucksQuantity: 0,
      averageCapacity: 0,
      activeTrucks: 0,
      maintenanceTrucks: 0,
      trucks: [
        { id: "truck-1", plate: "ABC-1111", model: "Volvo FH 540", capacity: 25000, mileage: 150000, lastRevision: "2025-08-01", status: "active" },
        { id: "truck-2", plate: "DEF-2222", model: "Scania R450", capacity: 27000, mileage: 120000, lastRevision: "2025-07-15", status: "maintenance" },
        { id: "truck-3", plate: "GHI-3333", model: "Mercedes-Benz Actros", capacity: 29000, mileage: 200000, lastRevision: "2025-06-20", status: "active" },
      ],
    },
    {
      id: "fleet-2",
      name: "Frota Urbana - Entregas Locais",
      description: "Veículos leves para distribuição dentro da cidade.",
      trucksQuantity: 0,
      averageCapacity: 0,
      activeTrucks: 0,
      maintenanceTrucks: 0,
      trucks: [
        { id: "truck-4", plate: "VWX-8888", model: "VW Delivery Express", capacity: 4000, mileage: 80000, lastRevision: "2025-09-01", status: "active" },
      ],
    },
    { 
      id: "fleet-3", 
      name: "Frota Refrigerada", 
      description: "Caminhões com baú refrigerado.", 
      trucksQuantity: 0,
      averageCapacity: 0,
      activeTrucks: 0,
      maintenanceTrucks: 0,
      trucks: [] 
    },
];

async function fetchFleetById(fleetId: string): Promise<Fleet | undefined> {
  console.log(`Buscando frota com ID: ${fleetId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const fleet = MOCKED_FLEETS.find(f => f.id === fleetId);
  if (!fleet) {
    throw new Error("Fleet not found");
  }
  
  const indicators = calculateFleetIndicators(fleet.trucks);
  
  return {
    ...fleet,
    ...indicators,
  };
}

async function handleAddTruck(data: TruckData) {
  console.log("Adicionando caminhão:", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export default function FleetView() {
  const [showForm, setShowForm] = useState(false);
  const { fleetId } = useParams<{ fleetId: string }>(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const tableColumns: ColumnDef<Truck>[] = [
    { accessorKey: "plate", header: "Placa" },
    { accessorKey: "model", header: "Modelo" },
    { accessorKey: "capacity", header: "Capacidade (kg)", cell: ({ row }) => `${row.original.capacity.toLocaleString('pt-BR')} kg` },
    { accessorKey: "mileage", header: "Quilometragem", cell: ({ row }) => `${row.original.mileage.toLocaleString('pt-BR')} km` },
    { accessorKey: "lastRevision", header: "Última Revisão", cell: ({ row }) => new Date(row.original.lastRevision).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
          const status = row.original.status;
          return <Badge variant={statusVariantMap[status] || 'default'}>{statusTextMap[status] || 'Desconhecido'}</Badge>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const truck = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="cursor-pointer" onClick={() => console.log("Editando " + truck.id)}>
                  <Pencil className="h-4 w-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar caminhão</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" className="cursor-pointer">
                  <Trash className="h-4 w-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir caminhão</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const { data: fleet, isPending: isLoading, isError } = useQuery<Fleet | undefined>({
    queryKey: ["fleet", fleetId], 
    queryFn: () => fetchFleetById(fleetId!),
    enabled: !!fleetId, 
    retry: false,
  });

  const truckMutation = useMutation({
    mutationKey: ["save-truck", fleetId],
    mutationFn: handleAddTruck,
    onSuccess: () => {
      toast.success("Caminhão adicionado com sucesso!");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['fleet', fleetId] });
    },
    onError: () => {
      toast.error("Erro ao adicionar caminhão. Tente novamente.");
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="w-full h-[40vh]" />
      </div>
    );
  }

  if (isError || !fleet) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
            <p className="text-xl text-muted-foreground">Frota não encontrada.</p>
            <Button onClick={() => navigate("/fleets")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Frotas
            </Button>
        </div>
    );
  }

  const inactiveTrucks = fleet.trucksQuantity - fleet.activeTrucks - fleet.maintenanceTrucks;

  return (
    <div className="p-8">
      <div className="mb-4">
        <Button onClick={() => navigate("/fleets")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>

      <PageHeader
        title={`${fleet.name}`}
        actions={<Button onClick={() => setShowForm(true)}>Adicionar Caminhão</Button>}
        topClass="top-11"
      />
      
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Caminhões</h3>
            <Truck className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{fleet.trucksQuantity}</div>
          <p className="text-xs text-gray-500">veículos na frota</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Caminhões Ativos</h3>
            <Activity className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{fleet.activeTrucks}</div>
          <p className="text-xs text-gray-500">
            {fleet.trucksQuantity > 0 ? `${Math.round((fleet.activeTrucks / fleet.trucksQuantity) * 100)}% da frota` : '0% da frota'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Manutenção</h3>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600">{fleet.maintenanceTrucks}</div>
          <p className="text-xs text-gray-500">
            {inactiveTrucks > 0 && `${inactiveTrucks} inativos`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Capacidade Média</h3>
            <Gauge className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{fleet.averageCapacity.toLocaleString('pt-BR')}</div>
          <p className="text-xs text-gray-500">kg por veículo</p>
        </div>
      </div>
      
      <ViewDataTable columns={tableColumns} data={fleet.trucks || []} />
      
      <TruckForm
        onSubmit={truckMutation.mutate}
        open={showForm}
        handleOpenChange={(open) => setShowForm(open)}
      />
    </div>
  );
}