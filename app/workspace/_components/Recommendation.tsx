import { Brain, Clock, Star, Users, Sparkles, Zap } from "lucide-react";
import React from "react";

const mockRecommendations = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    reason: "Based on your progress in AI Ethics",
    rating: 4.9,
    students: "15.2k",
    duration: "8h 30m",
  },
  {
    id: 2,
    title: "Advanced Python for AI",
    reason: "Complements your LangChain course",
    rating: 4.7,
    students: "12.8k",
    duration: "12h 15m",
  },
];

const Recommendation = () => {
  const isComingSoon = true; // Set this to false when feature is ready

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-chart-2" />
          <h2 className="text-2xl font-semibold">AI Recommendations</h2>
          {/* {isComingSoon && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              Coming Soon
            </div>
          )} */}
        </div>
        <button
          className={`text-sm transition-all ${
            isComingSoon
              ? "text-muted-foreground cursor-not-allowed"
              : "text-chart-2 hover:underline"
          }`}
          disabled={isComingSoon}
        >
          View All
        </button>
      </div>

      <div className="relative">
        {/* Content */}
        <div
          className={`grid gap-4 transition-all duration-300 ${
            isComingSoon ? "blur-sm grayscale opacity-60" : ""
          }`}
        >
          {mockRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-card p-5 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.reason}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-chart-4" />
                      <span>{rec.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{rec.students}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rec.duration}</span>
                    </div>
                  </div>
                </div>
                <button
                  className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isComingSoon
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-chart-2 hover:bg-chart-2/90 text-primary-foreground"
                  }`}
                  disabled={isComingSoon}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg text-center max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  AI-Powered Recommendations
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  We're training our AI to provide personalized course
                  recommendations based on your learning patterns and goals.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-chart-2">
                  <Sparkles className="w-4 h-4" />
                  Coming Soon
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommendation;
