import { useUserAuth } from "../context/userAuthContext";

import Layout from "../features/general/Layout";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { FriendList } from "../features/general/friendsCardLayout";
import { randomAvatar } from "../hooks/random-avatar";
import { useState } from "react";
import Categories from "../features/dashboard/Categories";
import RecentChats from "../features/dashboard/RecentChats";
import NewlyJoined from "../features/dashboard/NewlyJoined";
import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";

const Dashboard = () => {
  const { user, loading, logOut } = useUserAuth();

  const [collapsed, setCollapsed] = useState(false);

  console.log(user?.itemsSelected?.[0])

  if (loading) {
    return <p>Loading...</p>;
  } else if (user) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">
              Welcome Back{" "}
              <span className="font-bold italic">
                {user.displayName.toUpperCase()}
              </span>{" "}
              !
            </h1>

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
                      {/* <div>{user?.itemsSelected }</div> */}
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
          <div className="flex flex-col pt-5 gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h1>Latest Updates/Categories</h1>
                <Button>
                  <ArrowRightIcon />
                  <Link to={"/marketplace"}>More</Link>
                </Button>
              </div>
              <Categories />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Recent Chats With</h1>
              <RecentChats />
            </div>
            <div className="flex flex-col gap-1">
              <h1>Newly Joined Users</h1>
              <NewlyJoined />
            </div>

            {/* <FriendList /> */}
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
