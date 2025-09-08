import { useState } from "react";
import { NavLink } from "react-router";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  ShoppingCart,
  Users,
  Bell,
  Phone,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { randomAvatar } from "../../hooks/random-avatar";
import { useUserAuth } from "../../context/userAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logOut } = useUserAuth();
  const [avatarCollapsed, setAvatarCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home size={18} />,
      path: "/dashboard",
    },
    {
      name: "Marketplace",
      icon: <ShoppingBag size={18} />,
      path: "/marketplace",
    },
    { name: "Friends", icon: <Users size={18} />, path: "/friends" },
    {
      name: "Notifications",
      icon: <Bell size={18} />,
      path: "/notifications",
    },
    {
      name: "Buyers Dashboard",
      icon: <ShoppingCart size={18} />, 
      path: "/buyer-dashboard",
    },
    { name: "Contact", icon: <Phone size={18} />, path: "/contact" },
  ];

  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-base-200 shadow-lg transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 ${collapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4">
          {/* ✅ Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </Button>

          {/* Show logo only when expanded on desktop */}
          {!collapsed && (
            <div className="hidden md:block text-xl md:text-2xl font-bold text-primary">
              Meet'n'Buy
            </div>
          )}

          {/* Collapse toggle (desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-2 p-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition 
                ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-300"
                } 
                ${collapsed ? "justify-center" : ""}`
              }
              onClick={() => setSidebarOpen(false)} // also closes sidebar after click on mobile
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-base-200 px-4 py-3 shadow-md">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle (mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>

            {/* ✅ Logo: visible on mobile OR desktop when collapsed */}
            <span
              className={`text-xl md:text-2xl font-bold text-primary ${
                collapsed ? "hidden md:block" : "md:hidden"
              }`}
            >
              Meet'n'Buy
            </span>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={() => setAvatarCollapsed(!avatarCollapsed)}
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
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
