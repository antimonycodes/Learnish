"use client";
import AppHeader from "@/app/workspace/_components/AppHeader";
import { AppSidebar } from "@/app/workspace/_components/AppSidebar";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseSidebar from "./_component/CourseSideBar";
import { CourseContentArea } from "./_component/CourseContentArea";
import LearningLoadingScreen from "./_component/LearningLoadingScreen";

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);

  const { courseId } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    getCourse();
  }, [courseId]);

  const getCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/courses?courseId=${courseId}&includeEnrollment=true`
      );
      setCourseInfo(response.data);
      console.log("res:", response);
      console.log(response.data, "df");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return <LearningLoadingScreen />;
  }

  return (
    <div className="flex flex-col bg-gray-50 h-screen ">
      <AppHeader hideSidebar={true} />
      <div className=" flex h-[90%] ">
        <CourseSidebar
          sidebarOpen={sidebarOpen}
          onCloseSidebar={() => setSidebarOpen(false)}
          courseInfo={courseInfo}
        />
        <CourseContentArea
          courseInfo={courseInfo}
          refreshData={() => getCourse()}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
};

export default Course;
