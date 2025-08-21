import LoginForm from "../features/auth/login-form";

const Login = () => {
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
