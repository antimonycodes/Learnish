import { db } from "@/config/db";
import { coursesTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    return NextResponse.json({
      error: "User not logged in",
      status: 401,
    });
  }

  const response = await db
    .select({
      user: usersTable,
      totalCourses: sql<number>`count(${coursesTable.id})`,
      nonEmptyCourses: sql<number>`count(${coursesTable.id}) filter (where ${coursesTable.courseContent}::text != '{}'::text)`,
    })
    .from(usersTable)
    .leftJoin(coursesTable, eq(coursesTable.userEmail, usersTable.email))
    .where(eq(usersTable.email, userEmail))
    .groupBy(
      usersTable.id,
      usersTable.name,
      usersTable.email,
      usersTable.subscriptionId,
      usersTable.currentStreak,
      usersTable.longestStreak,
      usersTable.lastCompletionDate,
      usersTable.streakStartDate
    );

  return NextResponse.json(response[0] || {});
}
