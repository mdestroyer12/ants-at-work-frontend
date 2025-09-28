import { Navigate } from "react-router-dom";
import { getCookie } from "src/lib/utils";

interface Props {
  children: React.ReactNode;
}

export default function LoggedRoute({ children }: Props) {
  //const token = localStorage.getItem("accessToken");
  const token = getCookie("accessToken");

  if (token) {
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
}
