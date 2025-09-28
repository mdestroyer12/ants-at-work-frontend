import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FleetData } from "../../schemas/FleetSchema";
import { toast } from "react-toastify";

export default function FleetList() {
  const [Fleets, setFleets] = useState<FleetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/Fleets")
      .then(res => setFleets(res.data))
      .catch(() => toast.error("Erro ao carregar frotas", { toastId: "load-fleets-error" }))
      .finally(() => setLoading(false));
  }, []);

  function handleAddFleet(data: FleetData) {
    setSaving(true);
    api.post("/Fleets", data)
      .then(res => {
        setFleets(prev => [...prev, res.data]);
        setShowForm(false);
        toast.success("Frota cadastrada!");
      })
      .catch(() => toast.error("Erro ao cadastrar frota"))
      .finally(() => setSaving(false));
  }

  return (
    
  );
}