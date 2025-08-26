import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Main from "../pages/Main";
import ProtectedRoute from "./protectedRoutes";
import Register from "../pages/RegisterForm";
import PasswordResetRequest from "../pages/PasswordResetRequestForm";
import PasswordResetConfirm from "../pages/PasswordResetConfirmForm";
import FirstAccessPasswordChange from "../pages/FirstAcessChangeForm";

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
     <ProtectedRoute>
        <Register />
    </ProtectedRoute>
    ),
  },
  {
    path: "/reset-request",
    element: <PasswordResetRequest />,
  },
  {
    path: "/reset-password",
    element: <PasswordResetConfirm />,
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
]);
