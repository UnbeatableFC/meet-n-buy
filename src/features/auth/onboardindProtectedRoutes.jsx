import { Navigate, Outlet } from "react-router";
import { useUserAuth } from "../../context/userAuthContext";

const OnboardingProtectedRoute = () => {
  const { user, onboarded, loading } = useUserAuth();

  if (loading) return <div>Loading...</div>;

  // Redirect unauthenticated users to login
  if (!user) return <Navigate to="/login" replace />;

  // Redirect users who already onboarded to dashboard
  if (onboarded) return <Navigate to="/dashboard" replace />;

  // Otherwise, render onboarding routes
  return <Outlet />;
};

export default OnboardingProtectedRoute;
