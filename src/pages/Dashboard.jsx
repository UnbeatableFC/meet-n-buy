import { useUserAuth } from "../context/userAuthContext";
import { Navigate } from "react-router";

const Dashboard = () => {
  const { user, onboarded, logOut } = useUserAuth();
  

  if (!user) {
    <Navigate to={"/login"} />;
  }

  if (!onboarded) {
    <Navigate to={"/onboarding"} />;
  }

  return (
   ( <div>
      <h1>This is the Dashboard</h1>
      <button onClick={logOut}>Log Out</button>
    </div>)
  );
};

export default Dashboard;
