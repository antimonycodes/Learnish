import { Trophy } from "lucide-react";
import React from "react";
type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlockedDate: string;
  isNew?: boolean;
};
const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "First Course Completed",
    description: "Completed your first AI course",
    icon: "🎓",
    unlockedDate: "2 days ago",
    isNew: true,
  },
  {
    id: 2,
    title: "Speed Learner",
    description: "Completed 3 lessons in one day",
    icon: "⚡",
    unlockedDate: "1 week ago",
  },
  {
    id: 3,
    title: "Consistent Learner",
    description: "7-day learning streak",
    icon: "🔥",
    unlockedDate: "Yesterday",
    isNew: true,
  },
];

const Achievements = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-chart-4" />
          <h2 className="text-xl font-semibold">Recent Achievements</h2>
        </div>
      </div>
      <div className="space-y-3">
        {mockAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-card p-4 rounded-xl shadow-sm border border-border relative"
          >
            {achievement.isNew && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
            )}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1">
                  {achievement.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                <span className="text-xs text-muted-foreground opacity-75">
                  {achievement.unlockedDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
