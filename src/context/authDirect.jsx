// src/components/AuthRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserAuth } from "./userAuthContext";

export function AuthRedirect() {
  const { user, onboarded, loading } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (onboarded) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [user, onboarded, loading, navigate]);

  return null; // this component just redirects
}
