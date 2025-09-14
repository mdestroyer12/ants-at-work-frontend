import { useEffect, useState } from "react";
import api from "../api/axios";
import TruckForm from "../components/TruckForm";
import { TruckData } from "../schemas/truckSchema";
import { Button } from "../components/button";
import Loader from "../components/loader";
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
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Capacidade</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck, idx) => (
              <tr key={idx}>
                <td>{truck.plate}</td>
                <td>{truck.model}</td>
                <td>{truck.year}</td>
                <td>{truck.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 min-w-[350px]">
            <h2 className="text-xl font-bold mb-4">Novo Caminhão</h2>
            <TruckForm onSubmit={handleAddTruck} onClose={() => setShowForm(false)} loading={saving} />
          </div>
        </div>
      )}
    </div>
  );
}