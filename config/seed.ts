// import { db } from "./db";
import { db } from "./db";
import "dotenv/config";
import { achievementsTable } from "./schema";

async function seedAchievements() {
  try {
    await db.insert(achievementsTable).values([
      {
        code: "FIRST_COURSE_CREATED",
        title: "First Course Created",
        description: "You created your first course",
        icon: "🎯",
      },
      {
        code: "FIRST_COURSE_COMPLETED",
        title: "First Course Completed",
        description: "You completed your first course",
        icon: "🎓",
      },
      {
        code: "CONSISTENT_LEARNER",
        title: "Consistent Learner",
        description: "7-day learning streak",
        icon: "🔥",
      },
      {
        code: "CONSISTENT_LEARNER_X2",
        title: "Consistent Learner",
        description: "14-day learning streak",
        icon: "🔥🔥",
      },
    ]);

    console.log("✅ Achievements seeded successfully!");
  } catch (error) {
    console.error("❌ Failed to seed achievements:", error);
  } finally {
    process.exit(0); // Exit process
  }
}

seedAchievements();
