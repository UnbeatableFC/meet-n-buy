import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./features/auth/protectedRoutes";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import FriendsPage from "./pages/Friends";
import OnboardingProtectedRoute from "./features/auth/onboardindProtectedRoutes";
import MarketPlace from "./pages/MarketPlace";
import Clothes from "./pages/marketplace/Clothes";
import AllUsers from "./pages/friends/all-users";
import ChatPage from "./pages/ChatPage";




export const router = createBrowserRouter(
  
  [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/friends",
        children :[
          {
            element: <FriendsPage  />,
            path :""
          },
          {
            element: <AllUsers />,
            path :"all-users"
          },
           {
        path : "chats/:chatId",
        element : <ChatPage />
      }
        ]
        ,
      },
      {
        path: "/marketplace",
        // element: <MarketPlace />,
        children: [
          {
            element: <MarketPlace />,
            path: "",
          },
          {
            element: <Clothes />,
            path: "clothes",
          },
        ],
      },
      
    ],
  },
  {
    element: <OnboardingProtectedRoute />,
    children: [
      {
        element: <Onboarding />,
        path: "/onboarding",
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
