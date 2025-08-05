import { PricingTable } from "@clerk/nextjs";
import React from "react";

const Billing = () => {
  return (
    <div>
      <h1 className=" font-bold">Select Plan</h1>
      <PricingTable />
    </div>
  );
};

export default Billing;
