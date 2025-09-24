import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function LoggedRoute({ children }: Props) {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
}
