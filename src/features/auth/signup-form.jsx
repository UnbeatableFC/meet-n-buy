import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext";

import { Label } from "@radix-ui/react-label";
import { FaGoogle } from "react-icons/fa";
import * as React from "react";
import { Link, useNavigate } from "react-router";
import AuthRedirect from "../../context/authDirect";
import toast from "react-hot-toast";

const initialValue = {
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const { googleSignIn, signUp } = useUserAuth();
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = React.useState(initialValue);
  // const [redirect, setRedirect] = React.useState(false);
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/onboarding")
    } catch (error) {
      console.log("Error : ", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("The user info is : ", userInfo);
      toast.success("Sign Up Successful");
      await signUp(userInfo.email, userInfo.password);
      navigate("/onboarding")
      // setRedirect(true)
    } catch (error) {
      console.log("Error : ", error);
      toast.error("Email is already in use");
    }
  };

  // if (redirect) {
  //   return <AuthRedirect />;
  // }

  return (
    <div className="bg-[#411B13]/60 rounded-2xl shadow-2xl w-full h-screen">
      <div className="container mx-auto p-6 flex h-full">
        <div className="flex justify-center items-center w-full">
          <div className="p-6 w-2/3 hidden lg:block">
            <img
              src="/i.png"
              alt="page"
              className="object-cover size-[400px]"
            />
          </div>
          <div className="min-w-sm rounded-xl border bg-card text-card-foreground shadow-sm">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center pb-4 font-extrabold leading-tight text-primary drop-shadow-lg">
                    Meet'N'Buy
                  </CardTitle>
                  <CardDescription>
                    Enter your email below to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid">
                    <Button
                      variant="outline"
                      onClick={handleGoogleSignIn}
                    >
                      <FaGoogle className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="demo@example.com"
                      value={userInfo.email}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={userInfo.password}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmpassword">
                      Confirm password
                    </Label>
                    <Input
                      id="confirmpassword"
                      type="password"
                      placeholder="Confirm password"
                      value={userInfo.confirmPassword}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col mt-4">
                  <Button
                    className="w-full cursor-pointer"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                  <p className="mt-3 text-sm text-center">
                    Already have an account ?{" "}
                    <Link to="/login" className="text-blue-500">
                      Login
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
