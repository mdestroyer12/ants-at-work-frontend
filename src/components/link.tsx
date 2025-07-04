import { Link } from "react-router-dom";

type LinkProps = {
  text: string;
  link: string;
  destiny: string;
};

export default function LinkText({ text, link, destiny }: LinkProps) {
  return (
    <p className="text-gray-500 font-medium w-full flex items-start gap-1 h-10">
        <span>{text}</span>
        <Link to={destiny} className="text-[#4C2D2D] font-bold hover:underline">
        {link}
        </Link>
    </p>

  );
}
