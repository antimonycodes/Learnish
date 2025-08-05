import { db } from "@/config/db";
import { achievementsTable, userAchievementsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const user = await currentUser();
const userEmail = user?.primaryEmailAddress?.emailAddress;

export async function GET() {
  if (!userEmail) return;
  NextResponse.json({ error: "You must be logged in to view this page" });

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
  return Response.json(unlocked);
}

export async function POST(req: Request) {
  const { code, userEmail } = await req.json();
  const achievement: any = await db
    .select()
    .from(achievementsTable)
    .where(eq(achievementsTable.code, code));

  if (!achievement)
    return new Response("Achievement not found", { status: 404 });

  const exists = await db
    .select()
    .from(userAchievementsTable)
    .where(
      and(
        eq(userAchievementsTable.achievementId, achievement.id),
        eq(userAchievementsTable.userEmail, userEmail)
      )
    );

  if (exists) return new Response("Already unlocked", { status: 200 });

  await db.insert(userAchievementsTable).values({
    achievementId: achievement.id,
    userEmail,
  });

  return new Response("Achievement awarded", { status: 201 });
}
