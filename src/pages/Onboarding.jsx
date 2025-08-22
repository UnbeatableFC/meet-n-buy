import { useUserAuth } from "../context/userAuthContext";
import { useNavigate } from "react-router";

const Onboarding = () => {
  const { setOnboarded } = useUserAuth();
  const navigate = useNavigate();

  function handleRoleSelect() {
    // Save role in database or context
    setOnboarded(true);
    navigate("/dashboard");
  }
  return (
    <div>
      <h2>Select your role</h2>
      <button onClick={() => handleRoleSelect("buyer")}>Buyer</button>
      <button onClick={() => handleRoleSelect("seller")}>
        Seller
      </button>
    </div>
  );
};

export default Onboarding;
