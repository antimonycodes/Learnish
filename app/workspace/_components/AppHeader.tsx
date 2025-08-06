import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AppHeader = ({ hideSidebar = false }: any) => {
  return (
    <div className=" p-4 flex justify-between items-center shadow-sm">
      {!hideSidebar ? (
        <SidebarTrigger />
      ) : (
        <Link href="/workspace">
          <div className="relative flex items-center space-x-3">
            <Image src="/logo.svg" width={40} height={40} alt="logo" />
            <span className="text-primary text-2xl font-bold relative">
              Learn
              <span className="relative inline-block">ish</span>
            </span>
          </div>
        </Link>
      )}
      <UserButton />
    </div>
  );
};

export default AppHeader;
