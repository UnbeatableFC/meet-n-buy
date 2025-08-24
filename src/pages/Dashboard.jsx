import { useUserAuth } from "../context/userAuthContext";
import { Navigate } from "react-router";
import Layout from "../features/general/Layout";
import { randomAvatar } from "../hooks/random-avatar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FriendList } from "../features/general/friendsList";

const Dashboard = () => {
  const { user, onboarded, logOut } = useUserAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) {
    <Navigate to={"/login"} />;
  }

  if (!onboarded) {
    <Navigate to={"/onboarding"} />;
  }

  return (
    <div>
      <Layout>
        <div className="flex justify-between items-center">
          <h1>This is the Dashboard</h1>

          <div>
            <FriendList />
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={() => setCollapsed(!collapsed)}
                asChild
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={user?.photoURL || randomAvatar()}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  {!collapsed && (
                    <span className="hidden md:block font-medium">
                      {user?.displayName || "User"}
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mr-4">
                <DropdownMenuLabel>
                  <div className="flex gap-2.5">
                    <div>{user?.displayName || "My Account"}</div>
                    <div>{user?.phoneNumber || "08********"}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={logOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;
