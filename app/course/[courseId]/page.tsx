"use client";
import AppHeader from "@/app/workspace/_components/AppHeader";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
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

  const getCourse = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/courses?courseId=${courseId}&includeEnrollment=true`
      );
      setCourseInfo(response.data);
      console.log("res:", response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    getCourse();
  }, [getCourse]);

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
