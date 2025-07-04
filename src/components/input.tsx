type InputProps = {
  name: string;
  type: string;
};

export default function Input({ name, type }: InputProps) {
  return (
    <div className="relative z-0 w-full group mt-6">
      <label
        htmlFor={name}
        className="absolute text-xs text-gray-500 m-1 ml-5 font-bold pointer-events-none"
      >
        {name}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="block w-full text-sm bg-gray-300 focus:bg-gray-300 pl-5 pt-5 pb-2 focus:outline-none font-semibold h-12 rounded-md"
        placeholder=" "
        required
      />
    </div>
  );
}
