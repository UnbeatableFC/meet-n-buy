import { Navigate } from "react-router";
// import { useUserAuth } from "../context/userAuthContext";
import { LoginForm } from "../features/auth/login-form";
// import { getAuth } from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
import { useUserAuth } from "../context/userAuthContext";

const Login = () => {
  const { user } = useUserAuth();

  if (user) return <Navigate to="/dashboard" />;

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
