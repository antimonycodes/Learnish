"use client";
import React, { useEffect, useState } from "react";
import { Clock, Zap, Target, BookOpen } from "lucide-react";
import axios from "axios";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const formatTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OverviewPage = () => {
  const [time, setTime] = useState(formatTime());
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getUserStats();
  }, []);

  const getUserStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/user-stats");
      setUserStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !userStats) {
    return (
      <main className="p-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FancySkeletonCard />
          <FancySkeletonCard />
          <FancySkeletonCard />
          <FancySkeletonCard />
        </section>
      </main>
    );
  }

  console.log(userStats);

  const { user, totalCourses, nonEmptyCourses } = userStats;

  return (
    <main className="bg-background text-foreground">
      {/* Greeting Section */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold">
          {getGreeting()}, <span className="text-primary">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground mt-2">Current time: {time}</p>
      </section>

      {/* Quick Stats Dashboard */}
      <section className="mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                <BookOpen className="w-5 h-5 text-secondary-foreground" />
              </div>
              {/* <span className="text-xs text-chart-4 font-medium">
                +2 this week
              </span> */}
            </div>
            <h3 className="text-2xl font-bold mb-1">{totalCourses}</h3>
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                <Target className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-xs text-chart-4 font-medium">
                in progress
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{nonEmptyCourses}</h3>
            <p className="text-sm text-muted-foreground">Active Courses</p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                <Zap className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-xs text-primary font-medium">
                Personal best!
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {user?.currentStreak || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                <Clock className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-xs text-chart-2 font-medium">
                tracking soon
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">—</h3>
            <p className="text-sm text-muted-foreground">Weekly Hours</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OverviewPage;

const FancySkeletonCard = () => (
  <div className="relative overflow-hidden bg-muted p-6 rounded-xl space-y-4 h-[120px] flex flex-col justify-between">
    <div className="h-5 w-1/3 bg-muted-foreground/20 rounded" />
    <div className="h-6 w-2/3 bg-muted-foreground/30 rounded" />
    <div className="h-4 w-1/4 bg-muted-foreground/20 rounded self-end" />

    {/* Shimmer overlay with arbitrary animation */}
    <div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent
                 [animation:shimmer_1.5s_infinite] pointer-events-none"
    />
  </div>
);
