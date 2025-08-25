// src/pages/OnboardingPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { OnboardingForm } from "../features/auth/onboarding-form";

import { useUserAuth } from "../context/userAuthContext";

export default function OnboardingPage() {
  const { user, onboarded, loading } = useUserAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!loading) {
  //     if (!user) {
  //       navigate("/login");
  //     } else if (onboarded) {
  //       navigate("/dashboard");
  //     }
  //   }
  // }, [user, onboarded, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  // return <OnboardingForm />;
}
