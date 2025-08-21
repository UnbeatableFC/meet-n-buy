import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const ProtectedRoutes = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <div>Loading ...</div>;
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} />
  );
};

export default ProtectedRoutes;
