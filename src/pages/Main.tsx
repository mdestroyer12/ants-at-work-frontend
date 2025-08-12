// import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "../components/button";

// type UserData = {
//   email: string;
//   password: string;
// }

export default function Main() {
  // const [user, setUser] = useState<UserData | null>(null);

  // const getProfileData = async () => {
  //   try {
  //     const res = await api.get<UserData>("/users/me");
  //     setUser(res.data);
  //   } catch (err) {
  //     alert("Erro ao carregar perfil");
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  // useEffect(() => {
  //   getProfileData();
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Bem-vindo</h1>

      {/* {user && (
        <div className="mb-4">
          <p><strong>Nome:</strong> {user.password}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )} */}

      
        <Button onClick={handleLogout}>Sair</Button>
        {/* <Button onClick={getProfileData}>Atualizar Perfil</Button> */}
    </div>
  );
}
