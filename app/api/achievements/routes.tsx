import { db } from "@/config/db";
import {
  Achievement,
  achievementsTable,
  userAchievementsTable,
} from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET route - Fetch unlocked achievements
export async function GET() {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    return NextResponse.json(
      { error: "You must be logged in to view this page" },
      { status: 401 }
    );
  }

  const unlocked = await db
    .select({
      title: achievementsTable.title,
      description: achievementsTable.description,
      icon: achievementsTable.icon,
      unlockedAt: userAchievementsTable.unlockedAt,
    })
    .from(userAchievementsTable)
    .where(eq(userAchievementsTable.userEmail, userEmail))
    .innerJoin(
      achievementsTable,
      eq(achievementsTable.id, userAchievementsTable.achievementId)
    );

  return NextResponse.json(unlocked);
}

// POST route - Unlock an achievement
export async function POST(req: Request) {
  const { code, userEmail } = await req.json();

  if (!code || !userEmail) {
    return new Response("Missing code or userEmail", { status: 400 });
  }

  // Get achievement by code (returns array, take first)
  const [achievement] = await db
    .select()
    .from(achievementsTable)
    .where(eq(achievementsTable.code, code));

  if (!achievement) {
    return new Response("Achievement not found", { status: 404 });
  }

  // Check if already unlocked
  const existing = await db
    .select()
    .from(userAchievementsTable)
    .where(
      and(
        eq(userAchievementsTable.achievementId, achievement.id),
        eq(userAchievementsTable.userEmail, userEmail)
      )
    );

  if (existing.length > 0) {
    return new Response("Already unlocked", { status: 200 });
  }

  // Insert into userAchievementsTable
  await db.insert(userAchievementsTable).values({
    achievementId: achievement.id,
    userEmail,
  });

  return new Response("Achievement awarded", { status: 201 });
}
