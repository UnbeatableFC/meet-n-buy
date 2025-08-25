// src/components/AuthRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserAuth } from "./userAuthContext";

export default function AuthRedirect() {
  const { user, onboarded, loading } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // if (!user) {
      //   navigate("/login", { replace: true });
      // } else 
        if (onboarded) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [user, onboarded, loading, navigate]);

  return null; // this component just redirects
}
