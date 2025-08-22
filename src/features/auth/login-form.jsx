import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "../../context/userAuthContext";

import { Label } from "@radix-ui/react-label";
import * as React from "react";
import { Link, useNavigate } from "react-router";

const initialValue = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const { googleSignIn, logIn } = useUserAuth();
  const navigate = useNavigate();
  const [userLogInInfo, setuserLogInInfo] =
    React.useState(initialValue);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/dashboard");
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("The user info is : ", userLogInInfo);
      await logIn(userLogInInfo.email, userLogInInfo.password);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error : ", error);
    }
  };
  return (
    <div className="bg-[#411B13]/60 rounded-2xl shadow-2xl w-full h-screen">
      <div className="container mx-auto p-6 flex h-full">
        <div className="flex justify-center items-center w-full">
          <div className="w-2/3 hidden lg:block">
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
                      placeholder="dipesh@example.com"
                      value={userLogInInfo.email}
                      onChange={(e) =>
                        setuserLogInInfo({
                          ...userLogInInfo,
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
                      value={userLogInInfo.password}
                      onChange={(e) =>
                        setuserLogInInfo({
                          ...userLogInInfo,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col mt-4">
                  <Button className="w-full cursor-pointer" type="submit">
                    Login
                  </Button>
                  <p className="mt-3 text-sm text-center">
                    Don't have an account ?{" "}
                    <Link to="/signup" className="text-blue-500">
                      Sign up
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

export default LoginForm;
