import { Navigate, Outlet } from "react-router";

import { useUserAuth } from "../../context/userAuthContext";
import DashboardLayout from "../general/Layout";

const AuthProtectedRoute = () => {
  const { user, onboarded, loading } = useUserAuth();
  // const navigate = useNavigate

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!onboarded) return <Navigate to="/onboarding" replace />;

  return (
    <div>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default AuthProtectedRoute;
