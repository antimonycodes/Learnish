"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import AddNewCourseDialog from "@/shared/AddNewCourseDialog";
import axios from "axios";
import {
  BookOpen,
  Home,
  Search,
  User,
  BotIcon,
  Compass,
  Currency,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarConfig = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/workspace ",
  },
  {
    title: "My Courses",
    icon: BookOpen,
    path: "/workspace/my-courses",
  },
  {
    title: "Explore Courses",
    icon: Search,
    path: "/workspace/explore",
  },
  {
    title: "Ai Tools",
    icon: BotIcon,
    path: "/workspace/ai-tools",
  },
  {
    title: "Billing",
    icon: Currency,
    path: "/workspace/billing",
  },
  {
    title: "Profile",
    icon: User,
    path: "/workspace/profile",
  },
];

export function AppSidebar() {
  const [completedToday, setCompletedToday] = useState(false);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
  });
  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const response = await axios.get("/api/user-streak");
      setStreakData(response.data);
      setCompletedToday(response.data.completedToday || false);
    } catch (error) {
      console.log("Failed to fetch streak data");
    }
  };

  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className=" p-4">
        <div className="relative flex items-center space-x-3">
          <Image src="/logo.svg" width={40} height={40} alt="logo" />
          <span className="text-2xl font-bold relative">
            Learn
            <span className="relative inline-block stroke-1 stroke-orange-500">
              ish
            </span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button>Create New Course</Button>
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarConfig.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className=" p-5 ">
                    <Link
                      href={item.path}
                      className={` text-base 
                        ${
                          path.includes(item.path) &&
                          "text-primary bg-secondary"
                        }
                        `}
                    >
                      <item.icon className=" h-10 w-10 font-bold text-3xl " />
                      <span className=" font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div>
              <div className="mt-8 p-4 bg-white  rounded-xl border shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  {/* <TrendingUp className="w-5 h-5 text-green-400" /> */}
                  <h3 className="font-semibold text-sm">Learning Streak</h3>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {streakData.currentStreak} Day Streak!
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Keep it up! You're on fire 🔥
                </p>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
