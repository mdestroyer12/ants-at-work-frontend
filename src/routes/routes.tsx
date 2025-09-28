import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Main from "../pages/Main";
import ProtectedRoute from "./protectedRoutes";
import Register from "../pages/Auth/RegisterForm";
import PasswordResetRequest from "../pages/Auth/PasswordResetRequestForm";
import PasswordResetConfirm from "../pages/Auth/PasswordResetConfirmForm";
import FirstAccessPasswordChange from "../pages/Auth/FirstAcessChangeForm";
import ManagerRoute from "./managerRoutes";
import TruckList from "../pages/Trucks/TruckList";
import LoggedRoute from "./LoggedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: (
      <ManagerRoute>
        <Register />
      </ManagerRoute>
    ),
  },
  {
    path: "/reset-request",
    element: (
      <LoggedRoute>
        <PasswordResetRequest />,
      </LoggedRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <LoggedRoute>
        <PasswordResetConfirm />,
      </LoggedRoute>
    ),
  },
  {
    path: "/first-access-change",
    element: <FirstAccessPasswordChange />,
  },
  {
    path: "/main",
    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    ),
  },
  {
    path: "/trucks",
    element: (
        <ProtectedRoute>
         <TruckList />
        </ProtectedRoute>
    ),
  },
]);
