import React from "react";
import DashboardLayout from "../features/general/Layout";
import AllCategories from "../features/marketplace/AllCategories";
import { Link, Outlet } from "react-router";
import { Button } from "../components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

const MarketPlace = () => {
  return (
    <>
      <div className="flex flex-col p-6 gap-3">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-sans capitalize font-bold tracking-wider">
            Welcome to the store!
          </h1>

          <Link to={"/dashboard"}>
          <Button>
            <ArrowLeftCircle />
            Back to Dashboard
          </Button>
        </Link>
        </div>
        <div>
          <AllCategories />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default MarketPlace;
