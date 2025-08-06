"use client";

import axios from "axios";
import { ChevronRight, Loader2, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Course } from "../_components/Courses";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Explore = () => {
  // const [courses, setCourse] = useState();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [enrollingCourses, setEnrollingCourses] = useState<any>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    allCourses();
  }, []);

  const allCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/all-courses");
      setCourseList(response.data || []);

      console.log(response);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(courseList);

  const handleEnrollCourse = async (course: Course): Promise<void> => {
    // const isEnrolling = enrollingCourses === course.cid;
    console.log(course);
    if (!course.cid) {
      console.error("Course ID not found");
      return;
    }

    setEnrollingCourses(course.cid);

    try {
      const response = await axios.post("/api/enrol-course", {
        courseId: course.cid,
      });

      if (response.data.success) {
        // Refresh course list to get updated enrollment status
        // await getCourseList();
        router.push(`/workspace/view-course/${course?.cid}`);

        console.log("Successfully enrolled in course");
      }
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to enroll in course";
      toast.error(errorMessage);
    } finally {
      setEnrollingCourses("");
    }
  };

  const getGridClasses = (count: number): string => {
    if (count === 1) return "sm:grid-cols-1 max-w-md mx-auto";
    if (count === 2) return "sm:grid-cols-2 max-w-4xl mx-auto";
    return "sm:grid-cols-2 lg:grid-cols-3";
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
          <button
            // onClick={handleExploreCourses}
            className="text-primary hover:underline flex items-center gap-1 transition-colors"
          >
            Explore More <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
        <button
          //   onClick={handleExploreCourses}
          className="text-primary hover:underline flex items-center gap-1 transition-colors"
        >
          Explore More <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      {/*  */}
      <div className={`grid gap-6 ${getGridClasses(courseList.length)}`}>
        {courseList.map((course: Course) => {
          const isEnrolling = enrollingCourses === course.cid;
          return (
            <div
              key={course.id}
              className="flex flex-col justify-between bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="relative">
                <Image
                  src={course.bannerImageUrl || ""}
                  alt={course.courseJson.course.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/70 text-white text-xs rounded-full font-medium">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-grow p-5">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                  {course.courseJson.course.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {course.courseJson.course.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <span>by {course.createdBy}</span>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(course.progress || 0, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {course.courseJson.course.noOfChapters} Module
                      {course.courseJson.course.noOfChapters !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleEnrollCourse(course)}
                      disabled={isEnrolling}
                      className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enrolling
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          Enroll
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
// Loading skeleton component
const CourseSkeleton = () => (
  <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
    <div className="w-full h-40 bg-gray-200 animate-pulse" />
    <div className="p-5">
      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-3" />
      <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse mb-3" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-24" />
      </div>
    </div>
  </div>
);
