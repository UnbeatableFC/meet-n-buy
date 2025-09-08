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
import Bags from "./pages/marketplace/Bags";
import Books from "./pages/marketplace/Books";
import Cars from "./pages/marketplace/Cars";
import Chairs from "./pages/marketplace/Chairs";
import HomeAppliances from "./pages/marketplace/HomeAppliances";
import Laptops from "./pages/marketplace/Laptops";
import Makeup from "./pages/marketplace/Makeup";
import Phones from "./pages/marketplace/Phones";
import Shoes from "./pages/marketplace/Shoes";
import AllUsers from "./pages/friends/all-users";
import ChatPage from "./pages/ChatPage";
import BuyersList from "./pages/BuyersList";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        element: <BuyersList />,
        path: "/buyer-dashboard"
      },
      {
        path: "/friends",
        children: [
          {
            element: <FriendsPage />,
            path: "",
          },
          {
            element: <AllUsers />,
            path: "all-users",
          },
          {
            path: "chats/:chatId",
            element: <ChatPage />,
          },
        ],
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
          {
            element: <Bags />,
            path: "bags",
          },
          {
            element: <Books />,
            path: "books",
          },
          {
            element: <Cars />,
            path: "cars",
          },
          {
            element: <Chairs />,
            path: "chairs",
          },
          {
            element: <HomeAppliances />,
            path: "home-appliances",
          },
          {
            element: <Laptops />,
            path: "laptops",
          },
          {
            element: <Makeup />,
            path: "make-up",
          },
          {
            element: <Phones />,
            path: "phones",
          },
          {
            element: <Shoes />,
            path: "shoes",
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
