import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";

const WorkSpaceProvider = ({ children }: any) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className=" w-full">
        <AppHeader />
        <div className=" p-6 ">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default WorkSpaceProvider;
