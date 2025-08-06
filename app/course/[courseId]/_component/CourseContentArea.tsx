import { SelectedChapterContext } from "@/app/context/SelectedChapterContext";
import axios from "axios";
import {
  ArrowRight,
  Check,
  Loader2Icon,
  Play,
  Flame,
  Loader2,
  Menu,
  Trophy,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface CourseContentProps {
  courseInfo: any;
  refreshData: () => any;
  onToggleSidebar: () => void;
}

export const CourseContentArea = ({
  courseInfo,
  refreshData,
  onToggleSidebar,
}: CourseContentProps) => {
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterContext
  );
  const [loading, setLoading] = useState(false);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
  });
  const [completedToday, setCompletedToday] = useState(false);

  const { courseId } = useParams();
  const { enrolcourse } = courseInfo ?? "";

  const courseContent =
    courseInfo?.courses?.courseContent || courseInfo?.courseContent;
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;

  const completedChapter = enrolcourse?.completedChapters ?? [];
  console.log("comp", completedChapter);

  const completedChapters = enrolcourse?.completedChapters ?? [];
  const isLastChapter = selectedChapterIndex === courseContent?.length - 1;
  const isChapterCompleted = completedChapters.includes(selectedChapterIndex);
  const currentChapter = courseContent?.[selectedChapterIndex];

  const goToNextChapter = () => {
    if (selectedChapterIndex < courseContent?.length - 1) {
      setSelectedChapterIndex(selectedChapterIndex + 1);
    }
  };

  const goToPreviousChapter = () => {
    if (selectedChapterIndex > 0) {
      setSelectedChapterIndex(selectedChapterIndex - 1);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const response = await axios.get("/api/user-streak");
      setStreakData(response.data);
      setCompletedToday(response.data.completedToday || false);
    } catch (error) {
      console.log(error);
      console.log("Failed to fetch streak data");
    }
  };

  const markChapterAsCOmpleted = async () => {
    setLoading(true);
    try {
      completedChapter.push(selectedChapterIndex);
      const response = await axios.put("/api/enrol-course", {
        courseId: courseId,
        completedChapter: completedChapter,
      });

      console.log(response);
      refreshData();

      // NEW: Handle streak response
      if (response.data.streakData) {
        const { currentStreak, longestStreak, isNewRecord } =
          response.data.streakData;
        setStreakData({ currentStreak, longestStreak });

        if (isNewRecord) {
          toast.success(`🔥 New record! ${currentStreak} day streak!`);
        } else if (currentStreak > 1) {
          toast.success(`🔥 ${currentStreak} day streak! Chapter completed!`);
        } else {
          toast.success("Chapter completed! 🎉");
        }

        setCompletedToday(true);
      } else {
        toast.success("Chapter mark as completed");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to complete chapter");
    } finally {
      setLoading(false);
    }
  };

  if (!courseInfo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-500">Loading course content...</p>
        </div>
      </div>
    );
  }

  const formatContent = (content: any) => {
    if (!content) return "";

    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>");
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            Chapter {selectedChapterIndex + 1}:{" "}
            {currentChapter?.courseData?.chapterName}
          </h1>
        </div>
      </div>

      {/*  */}
      <div className="flex-1 ">
        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
          {/* NEW: Streak Display */}
          {streakData.currentStreak > 0 && (
            <div className="bg-gradient-to-r from-orange-400  to-red-500 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Flame className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {streakData.currentStreak} Day Streak!
                    </h3>
                    <p className="text-white/90">
                      {completedToday
                        ? "🎉 Completed today! Keep the momentum going!"
                        : "Complete this chapter to continue your streak"}
                    </p>
                  </div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3">
                  <Trophy className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Best</p>
                  <p className="text-xl font-bold">
                    {streakData.longestStreak}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chapter Header */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bold px-3 py-1 rounded-full text-sm font-medium">
                    Chapter {selectedChapterIndex + 1}
                  </span>
                  {isChapterCompleted && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {currentChapter?.courseData?.chapterName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {topics?.length || 0} topics to learn
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={goToPreviousChapter}
                disabled={selectedChapterIndex === 0}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    selectedChapterIndex === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={markChapterAsCOmpleted}
                disabled={isChapterCompleted || loading}
                className={`
                  flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
                  ${
                    isChapterCompleted
                      ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
                      : "bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95"
                  }
                `}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isChapterCompleted ? "Completed" : "Mark as Complete"}
              </button>

              <button
                onClick={goToNextChapter}
                disabled={isLastChapter}
                className={`
                  flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-all
                  ${
                    isLastChapter
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "text-white hover:scale-105 active:scale-95"
                  }
                `}
                style={{
                  background: isLastChapter ? undefined : "var(--primary)",
                }}
              >
                {isLastChapter ? (
                  <>
                    <Trophy className="w-4 h-4" />
                    Course Complete!
                  </>
                ) : (
                  <>
                    Next Chapter
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoData?.map(
          (video, index) =>
            index < 2 && (
              <div key={index}>
                <YouTube
                  videoId={video?.videoId}
                  opts={{
                    height: "250",
                    width: "400",
                  }}
                />
              </div>
            )
        )}
      </div> */}

          {/* Video Section */}
          {videoData && videoData.length > 0 && (
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                Related Videos
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {videoData.slice(0, 2).map((video: any, index: number) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        className="w-full h-full"
                        allowFullScreen
                        title={`Video ${index + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Content */}
          {/* <div className="p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedChapterIndex + 1}.
            {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
          </h1>
        </div> */}

          {/* Course Materials */}
          <div>
            {topics?.map((topic: any, index: number) => (
              <div
                key={index}
                className=" mt-10  bg-secondary rounded-2xl  p-6 lg:p-8 shadow-sm border hover:shadow-md transition-shadow "
              >
                <h2 className=" font-bold text-2xl text-primary">
                  {index + 1}. {topic?.topic}
                </h2>
                <div
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: formatContent(topic?.content),
                  }}
                  style={{
                    lineHeight: "2.5",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={markChapterAsCOmpleted}
              disabled={
                completedChapter.includes(selectedChapterIndex) || loading
              }
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                completedChapter.includes(selectedChapterIndex)
                  ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <Loader2Icon className=" animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {completedChapter.includes(selectedChapterIndex)
                    ? "Completed "
                    : "Mark as Completed"}
                </>
              )}
            </button>

            {/* <button
            onClick={onGoToNext}
            disabled={isLastLesson}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isLastLesson
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "text-white hover:scale-105 active:scale-95"
            }`}
            style={{
              background: isLastLesson ? undefined : "var(--primary)",
            }}
          >
            {isLastLesson ? "Course Complete!" : "Next Lesson"}
            {!isLastLesson && <ArrowRight className="w-4 h-4" />}
          </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
