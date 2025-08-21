import { SignupForm } from "../features/auth/signup-form";

const Signup = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl flex">
        <div className="flex-1">
          <SignupForm />
        </div>
        <div className="bg-[#411B13]/60 flex-1 object-center hidden md:block border-2 rounded-2xl ">
          <div className="my-auto pt-20">
            <img src="/i.png" alt="page" className="object-fill" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
