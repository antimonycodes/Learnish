"use client";

import React, { useEffect, useState } from "react";

import {
  Clock,
  BookOpen,
  BarChart3,
  User,
  Calendar,
  Tag,
  Loader2,
  Play,
  Star,
  Download,
  Share2,
  Loader2Icon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

// Topic represents a string array
type Topic = string;

export interface Chapter {
  chapterName: string;
  duration: string;
  topics: Topic[];
}

export interface CourseJsonData {
  name: string;
  description: string;
  category: string;
  level: string;
  noOfChapters: number;
  bannerImagePrompt: string;
  chapters: Chapter[];
}

export interface CourseJson {
  course: CourseJsonData;
}

export interface Course {
  id: number;
  cid: string;
  bannerImageUrl: string;
  name: string;
  description: string;
  duration: string | null;
  noOfChapters: number;
  difficulty: string;
  category: string;
  courseJson: CourseJson;
  userEmail: string;
  createdBy: string;
}

const EditCourse = ({ viewCourse = false }: any) => {
  const [loading, setLoading] = useState(false);
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);
  const [course, setCourse] = useState<Course>();
  const { courseId } = useParams();
  const router = useRouter();

  useEffect(() => {
    getCourseInfo();
  }, []);

  const getCourseInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/courses?courseId=${courseId}`);
      const data = await response.data;
      console.log(data);
      setCourse(data.courses);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(course?.cid);

  const calculateTotalDuration = () => {
    if (!course?.courseJson?.course?.chapters) return 0;
    return course.courseJson.course.chapters.reduce((total, chapter) => {
      const hours = parseFloat(chapter.duration.split(" ")[0]);
      return total + hours;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-gray-600 text-lg">Course not found</p>
        </div>
      </div>
    );
  }

  const generateCourseContent = async () => {
    setIsGeneratingContents(true);

    try {
      // Step 1: Generate course content
      console.log("Generating course content...");
      const generateResponse = await axios.post(
        "/api/generate-course-content",
        {
          courseJson: course?.courseJson?.course,
          courseTitle: course?.name,
          courseId: course?.cid,
        }
      );

      console.log("Course content generated:", generateResponse.data);

      // Check if generation was successful
      if (!generateResponse.data) {
        throw new Error("Course content generation failed");
      }

      // Step 2: Enroll user in the course
      console.log("Enrolling user in course...");
      const enrollResponse = await axios.post("/api/enrol-course", {
        courseId: course.cid,
      });

      console.log("Enrollment response:", enrollResponse.data);

      // Check enrollment result
      if (
        enrollResponse.data.success ||
        enrollResponse.data.message === "Already enrolled"
      ) {
        toast.success("Course generated and enrolled successfully!");
        // Optional: Add a small delay before navigation for better UX
        setTimeout(() => {
          router.replace("/workspace");
        }, 1000);
      } else {
        // Generation succeeded but enrollment failed
        toast.warning(
          "Course generated but enrollment failed. You can try enrolling manually."
        );
        router.replace("/workspace");
      }
    } catch (error: any) {
      console.error("Error in generateCourseContent:", error);

      // More specific error handling
      if (error.response) {
        // API returned an error response
        const status = error.response.status;
        const message =
          error.response.data?.message || error.response.data?.error;

        if (status === 409 && message === "Already enrolled") {
          toast.success(
            "Course generated successfully! You're already enrolled."
          );
          router.replace("/workspace");
        } else if (status >= 500) {
          toast.error("Server error occurred. Please try again later.");
        } else if (status === 401) {
          toast.error("Please log in to continue.");
        } else {
          toast.error(message || "An error occurred. Please try again.");
        }
      } else if (error.request) {
        // Network error
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Other errors
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsGeneratingContents(false);
    }
  };

  const totalDuration = calculateTotalDuration();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Enhanced Visual Appeal */}
      <div className="relative bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-orange-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-amber-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Main Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="order-2 lg:order-1">
                <div className="space-y-4 sm:space-y-6">
                  {/* Category and Difficulty Tags */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-full font-semibold shadow-lg text-sm">
                      {course.category}
                    </span>
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-semibold capitalize shadow-lg text-sm">
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                    {course.courseJson?.course?.name || course.name}
                  </h1>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    {course.courseJson?.course?.description || ""}
                  </p>

                  {/* Creator Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Created by{" "}
                      <span className="font-semibold text-gray-900">
                        {course.createdBy}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Image */}
              <div className="order-1 lg:order-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                  <div className="relative">
                    <img
                      src={course.bannerImageUrl}
                      alt={course.courseJson?.course?.name || course.name}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                      onError={(e: any) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwMCAxNzIuMDkxIDIyMi4wOTEgMTkwIDI1MCAyNEMyNzcuOTA5IDE5MCAzMDAgMTcyLjA5MSAzMDAgMTUwQzMwMCAxMjcuOTA5IDI3Ny45MDkgMTEwIDI1MCAxMTBDMjIyLjA5MSAxMTAgMjAwIDEyNy45MDkgMjAwIDE1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      {/* <div className="bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold text-gray-900">
                        Preview Available
                      </div> */}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    {/* <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                      <span>Course ID: {course.cid?.slice(0, 8)}...</span>
                      <span>Last updated today</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons and Stats */}
            <div className="mt-8 sm:mt-12">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {!viewCourse ? (
                  <button
                    className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                    onClick={generateCourseContent}
                    disabled={isGeneratingContents}
                  >
                    {isGeneratingContents ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2Icon className="animate-spin w-5 h-5" />
                          <span className="text-sm font-medium">
                            Generating Content...
                          </span>
                        </div>
                        <div className="text-xs opacity-90 text-center max-w-xs">
                          Creating videos and materials for your topics.
                          <br />
                          <span className="font-medium">
                            Check out the roadmap below!
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        <span>Start Learning</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <Link href={`/course/${course?.cid}`}>
                    <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      Continue Learning
                    </button>
                  </Link>
                )}
                <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Download Syllabus</span>
                  <span className="sm:hidden">Download</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-8 sm:space-y-12">
            {/* Course Overview */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Course Overview
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
                  {course.courseJson?.course?.description ||
                    "This comprehensive course will guide you through the essentials of prompt engineering, helping you master the art of communicating with AI models effectively."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <Tag className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mx-auto mb-3" />
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {course.category}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Category
                    </div>
                  </div>
                  <div className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mx-auto mb-3" />
                    <div className="font-semibold text-gray-900 capitalize text-sm sm:text-base">
                      {course.difficulty}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Difficulty
                    </div>
                  </div>
                  <div className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                    <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mx-auto mb-3" />
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {totalDuration} Hours
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Total Duration
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Chapters */}
            {course.courseJson?.course?.chapters && (
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Course Chapters
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {course.courseJson.course.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="group bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-base sm:text-lg group-hover:scale-110 transition-transform flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                              {chapter.chapterName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              {chapter.duration}
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 whitespace-nowrap">
                            Preview
                          </button>
                        </div>
                      </div>
                      <div className="ml-0 sm:ml-16">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                          Topics Covered:
                        </h4>
                        <div className="grid grid-cols-1 gap-2 sm:gap-3">
                          {chapter.topics?.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="flex items-start gap-3 text-sm text-gray-700 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="leading-relaxed">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
