import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function updateStreakForUser(userEmail: string) {
  try {
    // Get user's current streak data
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    const user = users[0];
    console.log(user);
    if (!user) return null;

    const now = new Date();
    const lastCompletion = user.lastCompletionDate;

    let newCurrentStreak = user.currentStreak || 0;
    let newLongestStreak = user.longestStreak || 0;

    if (!lastCompletion) {
      // First completion ever
      newCurrentStreak = 1;
    } else {
      // Calculate days between last completion and today
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastCompletionDay = new Date(
        lastCompletion.getFullYear(),
        lastCompletion.getMonth(),
        lastCompletion.getDate()
      );

      const daysDiff = Math.floor(
        (today.getTime() - lastCompletionDay.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Same day - don't increment streak, just maintain
        // newCurrentStreak stays the same
      } else if (daysDiff === 1) {
        // Next day - continue streak
        newCurrentStreak += 1;
      } else {
        // Gap > 1 day - reset streak
        newCurrentStreak = 1;
      }
    }

    // Update longest streak if current exceeds it
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    // Update user in database
    await db
      .update(usersTable)
      .set({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastCompletionDate: now,
        streakStartDate: user.streakStartDate || now,
      })
      .where(eq(usersTable.email, userEmail));

    return {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      isNewRecord:
        newCurrentStreak === newLongestStreak && newCurrentStreak > 1,
    };
  } catch (error) {
    console.error("Streak update error:", error);
    return null;
  }
}

export async function checkTodayCompletion(
  userEmail: string
): Promise<boolean> {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    const user = users[0];

    if (!user?.lastCompletionDate) return false;

    const today = new Date();
    const lastCompletion = user.lastCompletionDate;

    const todayStr = today.toDateString();
    const lastCompletionStr = lastCompletion.toDateString();

    return todayStr === lastCompletionStr;
  } catch (error) {
    console.error("Check today completion error:", error);
    return false;
  }
}
