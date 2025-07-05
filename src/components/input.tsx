import type { UseFormRegister } from "react-hook-form";

type InputProps = {
  name: string;
  type: string;
  id: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: string;
};

export default function Input({ name, type, id, placeholder, register, error }: InputProps) {
  return (
    <div className="relative w-full group mt-2">
      <label htmlFor={id} className="absolute left-5 top-2 text-xs text-[#3F2323] font-semibold pointer-events-none">
        {name}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`peer block w-full text-sm bg-[#E5DAD1] pl-5 pt-6 pb-2 h-13 rounded-md font-semibold border focus:border-[#3F2323] focus:bg-[#CABAAE] focus:outline-none transition-all duration-200 placeholder:text-xs`}
      />
      {error && <p className="text-[#800000] text-xs mt-1 ml-1 font-semibold ">{error}</p>}
    </div>
  );
}
