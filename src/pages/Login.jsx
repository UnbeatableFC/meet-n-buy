import { Navigate, useLocation } from "react-router";
// import { useUserAuth } from "../context/userAuthContext";
import LoginForm from "../features/auth/login-form";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const location = useLocation();

  if (user)
    return (
      <Navigate to="/dashboard" state={{ from: location }} replace />
    );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl flex">
        <div className="flex-1">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
