import React, { useState, useEffect, useContext } from "react";
import {
  ChevronDown,
  ChevronRight,
  Play,
  Check,
  ArrowRight,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Circle,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterContext } from "@/app/context/SelectedChapterContext";

// Sidebar Component
const CourseSidebar = ({ courseInfo, sidebarOpen, onCloseSidebar }: any) => {
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterContext
  );
  const course = courseInfo?.courses;
  const enrolcourse = courseInfo?.enrolcourse;
  const courseContent =
    courseInfo?.courses?.courseContent || courseInfo?.courseContent;
  let completedChapters = enrolcourse?.completedChapters ?? [];

  const isChapterCompleted = (chapterIndex: number) => {
    return completedChapters.includes(chapterIndex);
  };

  const getChapterProgress = (chapter: any, chapterIndex: number) => {
    const totalTopics = chapter?.courseData?.topics?.length || 0;
    const isCompleted = isChapterCompleted(chapterIndex);

    return {
      completed: isCompleted ? totalTopics : 0,
      total: totalTopics,
      isCompleted,
    };
  };
  const getProgress = () => {
    const totalChapters = courseContent?.length || 0;
    const completedCount = completedChapters.length;
    const percentage =
      totalChapters > 0
        ? Math.round((completedCount / totalChapters) * 100)
        : 0;
    return { completed: completedCount, total: totalChapters, percentage };
  };

  const progress = getProgress();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#344054B2] bg-opacity-40 z-40 lg:hidden"
          onClick={onCloseSidebar}
        />
      )}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200  overflow-y-auto
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col h-full 
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {course?.title || "Course Content"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className=" bg-secondary  h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">
                {progress.percentage}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {progress.completed} of {progress.total} chapters completed
            </p>
          </div>
          <button
            onClick={onCloseSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Accordion type="single" collapsible className="space-y-0">
            {courseContent?.map((chapter, chapterIndex) => {
              const chapterProgress = getChapterProgress(chapter, chapterIndex);
              const isCurrentChapter = selectedChapterIndex === chapterIndex;
              const isChapterComplete = chapterProgress.isCompleted;
              const isActiveChapter = isCurrentChapter;

              return (
                <AccordionItem
                  key={chapterIndex}
                  value={`chapter-${chapterIndex}`}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <AccordionTrigger
                    className={`hover:no-underline py-4 px-0 transition-all duration-200 ${
                      isActiveChapter
                        ? "bg-orange-50 border-l-4 border-orange-500 pl-2"
                        : ""
                    }`}
                    onClick={() => setSelectedChapterIndex(chapterIndex)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        {/* Chapter completion indicator */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isChapterComplete
                              ? "bg-orange-500 border-orange-500"
                              : isActiveChapter
                              ? "border-orange-500 bg-orange-100"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChapterComplete ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <span
                              className={`text-sm font-bold ${
                                isActiveChapter
                                  ? "text-orange-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {chapterIndex + 1}
                            </span>
                          )}
                        </div>

                        {/* Chapter title */}
                        <div className="text-left">
                          <span
                            className={`font-bold text-md ${
                              isChapterComplete
                                ? "text-orange-500"
                                : isActiveChapter
                                ? "text-orange-600"
                                : "text-gray-900"
                            }`}
                          >
                            {chapter?.courseData?.chapterName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-4 pt-2">
                    <div className="space-y-2 ml-9">
                      {chapter?.courseData?.topics?.map((topic, topicIndex) => {
                        const isTopicCompleted = isChapterComplete;

                        return (
                          <div
                            key={topicIndex}
                            className={`relative cursor-pointer group transition-all duration-200 ${
                              isTopicCompleted
                                ? "bg-green-50 border-l-2 border-green-500"
                                : "hover:bg-gray-50 border-l-2 border-transparent"
                            } rounded-r-md`}
                          >
                            <div className="flex items-center gap-3 py-2.5 px-4">
                              {/* Topic completion indicator */}
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                  isTopicCompleted
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {isTopicCompleted && (
                                  <Check className="w-2.5 h-2.5 text-white" />
                                )}
                              </div>

                              {/* Topic title */}
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`text-sm font-medium truncate ${
                                    isTopicCompleted
                                      ? "text-green-700"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {topic.topic}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default CourseSidebar;
