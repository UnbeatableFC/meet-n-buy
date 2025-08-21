import  SignupForm  from "../features/auth/signup-form";

const Signup = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl flex">
        <div className="flex-1">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
