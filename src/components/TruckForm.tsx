import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema, TruckData } from "../schemas/truckSchema";
import Input from "./input";
import { Button } from "./button";
import Loader from "./loader";

type Props = {
  onSubmit: (data: TruckData) => void;
  onClose: () => void;
  loading?: boolean;
};

export default function TruckForm({ onSubmit, onClose, loading }: Props) {
  const [truckTypes, setTruckTypes] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TruckData>({ resolver: zodResolver(truckSchema) });

  useEffect(() => {
    async function fetchTruckTypes() {
      try {
        const res = await api.get("/truck-types");
        setTruckTypes(res.data);
      } catch (err) {
        setTruckTypes(["Baú", "Sider", "Graneleiro"]);
      }
    }
    fetchTruckTypes();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-4">
      <Input
        text="Placa"
        id="plate"
        type="text"
        placeholder="Insira a placa..."
        register={register}
        error={errors.plate?.message}
      />
      <Input
        text="Modelo"
        id="model"
        type="text"
        placeholder="Insira o modelo..."
        register={register}
        error={errors.model?.message}
      />
      <Input
        text="Capacidade Máxima"
        id="capacity"
        type="text"
        placeholder="Insira a capacidade..."
        register={register}
        error={errors.capacity?.message}
      />
      <Input
        text="Ano"
        id="year"
        type="text"
        placeholder="Insira o ano..."
        register={register}
        error={errors.year?.message}
      />
      <div className="flex gap-2">
        <Input
          text="Comprimento (m)"
          id="length"
          type="number"
          placeholder="Comprimento interno"
          register={register}
          error={errors.length?.message}
        />
        <Input
          text="Largura (m)"
          id="width"
          type="number"
          placeholder="Largura interna"
          register={register}
          error={errors.width?.message}
        />
        <Input
          text="Altura (m)"
          id="height"
          type="number"
          placeholder="Altura interna"
          register={register}
          error={errors.height?.message}
        />
      </div>
      <div className="flex flex-col w-full mt-2">
        <label htmlFor="type" className="mb-1 text-[#4C2D2D] font-medium">Tipo</label>
        <select
          id="type"
          {...register("type")}
          className="w-full p-2 rounded-lg border-2 border-[#CABAAE] bg-[#E5DAD1] text-[#3F2323] text-sm hover:border-[#4C2D2D] focus:outline-none focus:ring-2 focus:ring-[#744625] transition"
        >
          <option value="" disabled>Selecione o tipo</option>
          {truckTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.type && <p className="text-[#800000] text-xs mt-1 ml-1 font-medium">{errors.type.message}</p>}
      </div>
      <Input
        text="Detalhe"
        id="detail"
        type="text"
        placeholder="Observações adicionais"
        register={register}
        error={errors.detail?.message}
      />
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Salvar"}
        </Button>
        <Button type="button" onClick={onClose} className="bg-gray-300 text-black">
          Cancelar
        </Button>
      </div>
    </form>
  );
}