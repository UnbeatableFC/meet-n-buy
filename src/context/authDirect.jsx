// src/components/AuthRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserAuth } from "./userAuthContext";

export default function AuthRedirect() {
  const { user, onboarded, loading } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login"); // not logged in
      } else if (onboarded) {
        navigate("/dashboard"); // already onboarded
      } else {
        navigate("/onboarding"); // needs onboarding
      }
    }
  }, [user, onboarded, loading, navigate]);

  return null; // this component just redirects
}
