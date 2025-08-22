import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const AuthProtectedRoute = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user)
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );

  return <Outlet />;
};

export default AuthProtectedRoute;
