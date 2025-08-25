import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaGoogle } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserAuth } from "../../context/userAuthContext";
import {AuthRedirect} from "../../context/authDirect"

const initialValue = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const { user, googleSignIn, logIn } = useUserAuth();
  const [userLogInInfo, setUserLogInInfo] = useState(initialValue);
  const [redirect, setRedirect] = useState(false);

  // 🔹 Watch for auth state changes (user becomes available after login)
  useEffect(() => {
    if (user) {
      setRedirect(true);
    }
  }, [user]);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      // user state will update via context, redirect handled in useEffect
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(userLogInInfo.email, userLogInInfo.password);
      // user state will update via context, redirect handled in useEffect
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  if (redirect) {
    return <AuthRedirect />;
  }

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
                    Enter your email below to log into your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid">
                    <Button variant="outline" onClick={handleGoogleSignIn}>
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
                        setUserLogInInfo({
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
                        setUserLogInInfo({
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
                    Don't have an account?{" "}
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


