import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { checkTodayCompletion } from "@/lib/streakHelper";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    const userData = users[0];
    console.log(userData);

    const completedToday = await checkTodayCompletion(userEmail);

    return NextResponse.json({
      currentStreak: userData?.currentStreak || 0,
      longestStreak: userData?.longestStreak || 0,
      lastCompletionDate: userData?.lastCompletionDate,
      completedToday,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch streak" },
      { status: 500 }
    );
  }
}
