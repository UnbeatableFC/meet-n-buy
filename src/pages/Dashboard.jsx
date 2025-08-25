import { useUserAuth } from "../context/userAuthContext";
import { Navigate, useNavigate } from "react-router";
import Layout from "../features/general/Layout";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FriendList } from "../features/general/friendsCardLayout";

const Dashboard = () => {
  const { user, onboarded, loading } = useUserAuth();
  const navigate = useNavigate();
  // const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (!onboarded) {
        navigate("/onboarding");
      }
    }
  }, [user, onboarded, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Layout>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h1>This is the Dashboard</h1>

            <div>
              {/* <DropdownMenu>
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
              </DropdownMenu> */}
            </div>
          </div>
          <div>
            <FriendList />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;
