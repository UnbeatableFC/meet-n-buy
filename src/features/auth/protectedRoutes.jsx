import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useUserAuth } from "../../context/userAuthContext";

const ProtectedRoutes = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const { onboarded } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (!onboarded) return <Navigate to="/onboarding" />;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} />
  );
};

export default ProtectedRoutes;
