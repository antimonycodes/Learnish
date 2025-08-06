"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  ChevronRight,
  PlayCircle,
  Plus,
  BookOpen,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddNewCourseDialog from "@/shared/AddNewCourseDialog";
import Image from "next/image";

// TypeScript interfaces
interface CourseJson {
  course: {
    name: string;
    description: string;
    noOfChapters: number;
  };
}

export interface Course {
  id: number;
  cid: number; // Course ID for enrollment
  name: string;
  bannerImageUrl: string;
  category: string;
  createdBy: string;
  progress: number;
  courseJson: CourseJson;
  courseContent?: any[];
}

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

// Empty state component
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <BookOpen className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
    <p className="text-gray-600 mb-6 max-w-md">
      Get started by creating your first course. Build engaging content and
      start your learning journey.
    </p>
    <AddNewCourseDialog>
      <button
        // onClick={onCreateCourse}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Create First Course
      </button>
    </AddNewCourseDialog>
  </div>
);

const Courses = ({ full = false }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [enrollingCourses, setEnrollingCourses] = useState<Set<number>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getCourseList();
    }
  }, [user]);

  const getCourseList = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Course[]>("/api/courses");
      setCourseList(response.data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again.");
      setCourseList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async (course: Course): Promise<void> => {
    if (!course.cid) {
      console.error("Course ID not found");
      return;
    }

    setEnrollingCourses((prev) => new Set(prev).add(course.cid));

    try {
      const response = await axios.post("/api/enrol-course", {
        courseId: course.cid,
      });

      if (response.data.success) {
        // Refresh course list to get updated enrollment status
        await getCourseList();
        console.log("Successfully enrolled in course");
      }
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to enroll in course";
      toast.error(errorMessage); // You might want to replace this with a toast notification
    } finally {
      setEnrollingCourses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(course.cid);
        return newSet;
      });
    }
  };

  const handleCourseAction = async (course: Course): Promise<void> => {
    const hasContent = course.courseContent && course.courseContent.length > 0;

    if (hasContent) {
      // Navigate to course content
      if (course.progress > 0) {
        router.push(`/workspace/view-course/${course?.cid}`);
      } else {
        // router.push(`/course/${course.cid}/start`);
        router.push(`/workspace/view-course/${course?.cid}`);
      }
    } else {
      // Generate course content or enroll
      await handleEnrollCourse(course);
    }
  };

  // const handleCreateCourse = (): void => {
  //   router.push("/create-course");
  // };

  const handleExploreCourses = (): void => {
    router.push("/explore");
  };

  const getButtonText = (course: Course): string => {
    const hasContent = course.courseContent && course.courseContent.length > 0;
    const isEnrolling = enrollingCourses.has(course.cid);

    if (isEnrolling) return "Enrolling...";
    if (!hasContent) return "Generate Course";
    return course.progress > 0 ? "Continue" : "Continue";
  };

  const getButtonIcon = (course: Course) => {
    const isEnrolling = enrollingCourses.has(course.cid);

    if (isEnrolling) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return <PlayCircle className="w-4 h-4" />;
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
            onClick={handleExploreCourses}
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

  if (error) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
        </div>
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={getCourseList}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
        <button
          onClick={handleExploreCourses}
          className="text-primary hover:underline flex items-center gap-1 transition-colors"
        >
          Explore More <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {courseList.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-1">
          <EmptyState />
        </div>
      ) : (
        <div className={`grid gap-6 ${getGridClasses(courseList.length)}`}>
          {(full ? courseList : courseList.slice(0, 4)).map(
            (course: Course) => (
              <div
                key={course.id}
                className="flex flex-col justify-between  bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative">
                  <Image
                    height={160}
                    width={400}
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

                <div className="p-5 flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                    {course.courseJson.course.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {course.courseJson.course.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 italic">
                    <span>by {course.createdBy}</span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                      className="bg-primary h-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(course.progress || 0, 100)}%`,
                      }}
                    />
                  </div>

                  {/* This pushes the button section to the bottom */}
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="text-sm text-muted-foreground">
                      {course.courseJson.course.noOfChapters} Module
                      {course.courseJson.course.noOfChapters !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => handleCourseAction(course)}
                      disabled={enrollingCourses.has(course.cid)}
                      className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      {getButtonIcon(course)}
                      {getButtonText(course)}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default Courses;
