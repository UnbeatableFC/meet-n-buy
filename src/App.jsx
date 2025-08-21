import { RouterProvider } from "react-router";
import router from "./routes";
import { UserAuthProvider } from "./context/userAuthContext";

const App = () => {
  return (
    <div data-theme={"caramelltte"}>
      <UserAuthProvider>
        <RouterProvider router={router} />
      </UserAuthProvider>
    </div>
  );
};

export default App;
