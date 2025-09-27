import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { truckSchema, TruckData } from "../schemas/truckSchema";
import Input from "./Input";
import { Button } from "./Button";
import Loader from "./Loader";

type Props = {
  onSubmit: (data: TruckData) => void;
  onClose: () => void;
  loading?: boolean;
};

export default function TruckForm({ onSubmit, onClose, loading }: Props) {
  const [truckTypes, setTruckTypes] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TruckData>({
    resolver: zodResolver(truckSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    async function fetchTruckTypes() {
      try {
        const res = await api.get("/truck-types");
        setTruckTypes(res.data);
      } catch (err) {
        console.error("Falha ao buscar tipos de caminhão:", err);
        setTruckTypes(["Baú", "Sider", "Graneleiro", "Refrigerado"]);
      }
    }
    fetchTruckTypes();
  }, []);

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof TruckData)[] = [
      "plate",
      "model",
      "capacity",
      "length",
      "width",
      "height",
      "type",
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
        aria-label="Fechar modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-4">
        <div className="text-center mb-4 pt-6"> 
          <p className="text-lg font-bold text-[#4C2D2D]">
            Etapa {step} de 2:{" "}
            {step === 1 ? "Dados Básicos" : "Dados de Manutenção"}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-[#744625] h-2.5 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? "50%" : "100%" }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <>
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
              text="Capacidade Máxima (kg)"
              id="capacity"
              type="number"
              placeholder="Insira a capacidade em kg..."
              register={register}
              error={errors.capacity?.message}
            />
            <p className="text-[#4C2D2D] font-medium -mb-1">
              Dimensões Internas
            </p>
            <div className="flex gap-2">
              <Input
                text="Comprimento (m)"
                id="length"
                type="number"
                placeholder="Ex: 14.5"
                register={register}
                error={errors.length?.message}
              />
              <Input
                text="Largura (m)"
                id="width"
                type="number"
                placeholder="Ex: 2.6"
                register={register}
                error={errors.width?.message}
              />
              <Input
                text="Altura (m)"
                id="height"
                type="number"
                placeholder="Ex: 3.1"
                register={register}
                error={errors.height?.message}
              />
            </div>
            <div className="flex flex-col w-full mt-2">
              <label
                htmlFor="type"
                className="mb-1 text-[#4C2D2D] font-medium"
              >
                Tipo
              </label>
              <select
                id="type"
                {...register("type")}
                className="w-full p-2 rounded-lg border-2 border-[#CABAAE] bg-[#E5DAD1] text-[#3F2323] text-sm hover:border-[#4C2D2D] focus:outline-none focus:ring-2 focus:ring-[#744625] transition"
              >
                <option value="">Selecione o tipo</option>
                {truckTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-[#800000] text-xs mt-1 ml-1 font-medium">
                  {errors.type.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full mt-2">
              <label
                htmlFor="detail"
                className="mb-1 text-[#4C2D2D] font-medium"
              >
                Detalhes/Sobre
              </label>
              <textarea
                id="detail"
                placeholder="Observações adicionais sobre o caminhão..."
                {...register("detail")}
                className="w-full p-2 rounded-lg border-2 border-[#CABAAE] bg-[#E5DAD1] text-[#3F2323] text-sm hover:border-[#4C2D2D] focus:outline-none focus:ring-2 focus:ring-[#744625] transition"
                rows={3}
              />
              {errors.detail && (
                <p className="text-[#800000] text-xs mt-1 ml-1 font-medium">
                  {errors.detail.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              text="Última Revisão"
              id="lastRevision"
              type="date"
              placeholder=""
              register={register}
              error={errors.lastRevision?.message}
            />
            <Input
              text="Quilometragem"
              id="mileage"
              type="number"
              placeholder="Insira a quilometragem atual"
              register={register}
              error={errors.mileage?.message}
            />
          </>
        )}

        <div className="flex justify-between mt-4">
          <div>
            {step === 2 && (
              <Button type="button" onClick={handlePrevStep}>
                Voltar
              </Button>
            )}
          </div>

          <div>
            {step === 1 && (
              <Button type="button" onClick={handleNextStep}>
                Próximo
              </Button>
            )}

            {step === 2 && (
              <Button type="submit" disabled={loading}>
                {loading ? <Loader /> : "Salvar"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}