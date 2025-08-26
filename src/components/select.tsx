import { FC } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
};

const Select: FC<SelectProps> = ({ options, value, placeholder, onChange, error, label }) => {
  return (
    <div className="flex flex-col w-full mt-2">
      {label && <label className="mb-1 text-[#4C2D2D] font-medium">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="
            w-full
            p-2
            rounded-lg
            border-2 border-[#CABAAE]
            bg-[#E5DAD1]
            text-[#3F2323]
            hover:border-[#4C2D2D]
            focus:outline-none
            focus:ring-2 focus:ring-[#744625]
            transition
            p-3
        "
        >
        {placeholder && (
            <option value="" disabled>
            {placeholder}
            </option>
        )}
        {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[#3F2323] bg-[#E5DAD1]">
            {opt.label}
            </option>
        ))}
        </select>
       {error && <p className="text-[#800000] text-xs mt-1 ml-1 font-medium">
          <i className="fas fa-exclamation-circle text-[#800000]"></i> {error}
      </p>}
    </div>
  );
};

export default Select;