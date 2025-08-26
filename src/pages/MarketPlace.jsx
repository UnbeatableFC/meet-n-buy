import React from "react";
import DashboardLayout from "../features/general/Layout";
import AllCategories from "../features/marketplace/AllCategories";
import { Outlet } from "react-router";

const MarketPlace = () => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-3xl font-sans capitalize font-bold tracking-wider">
            Welcome to the store!
          </h1>
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
