import { useEffect, useState } from "react";
import api from "../../api/axios";
import TruckForm from "../../components/TruckForm";
import { TruckData } from "../../schemas/TruckSchema";
import { Button } from "../../components/Button";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

export default function TruckList() {
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/trucks")
      .then(res => setTrucks(res.data))
      .catch(() => toast.error("Erro ao carregar caminhões", { toastId: "load-trucks-error" }))
      .finally(() => setLoading(false));
  }, []);

  function handleAddTruck(data: TruckData) {
    setSaving(true);
    api.post("/trucks", data)
      .then(res => {
        setTrucks(prev => [...prev, res.data]);
        setShowForm(false);
        toast.success("Caminhão cadastrado!");
      })
      .catch(() => toast.error("Erro ao cadastrar caminhão"))
      .finally(() => setSaving(false));
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Caminhões</h1>
      <Button onClick={() => setShowForm(true)} className="mb-4">
        Adicionar Caminhão
      </Button>
      {loading ? (
        <Loader />
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-[#E5DAD1] text-[#4C2D2D]">
              <th className="p-3 text-left">Placa</th>
              <th className="p-3 text-left">Modelo</th>
              <th className="p-3 text-left">Capacidade (kg)</th>
              <th className="p-3 text-left">Quilometragem</th>
              <th className="p-3 text-left">Última Revisão</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.plate} className="border-b border-[#CABAAE] hover:bg-[#F0EBE5]">
                <td className="p-3">{truck.plate}</td>
                <td className="p-3">{truck.model}</td>
                <td className="p-3">{truck.capacity}</td>
                <td className="p-3">{truck.mileage}</td>
                <td className="p-3">{new Date(truck.lastRevision).toLocaleDateString()}</td>
                {/* Buttons somente visuais, sem funcionalidade real. Aguarde poder testar o front com o back para adicionar essas functions*/}
                <td className="p-3">
                  <button className="text-blue-600 hover:underline">Editar</button>
                  <button className="text-red-600 hover:underline ml-4">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )} 
      {showForm && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.74)' }}
        >
          <div className="bg-[#F9F5F2] rounded-lg shadow-xl p-2 max-w-lg w-full">
            <TruckForm onSubmit={handleAddTruck} onClose={() => setShowForm(false)} loading={saving} />
          </div>
        </div>
      )}
    </div>
  );
} 