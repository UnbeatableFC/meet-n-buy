import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./features/auth/protectedRoutes";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/Onboarding";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <OnboardingPage />,
        path: "/onboarding",
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
