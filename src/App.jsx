import { RouterProvider } from "react-router";
import router from "./routes";
import { UserAuthProvider } from "./context/userAuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div data-theme={"caramelltte"}>
      <Toaster />
      <UserAuthProvider>
        <RouterProvider router={router} />
      </UserAuthProvider>
    </div>
  );
};

export default App;
