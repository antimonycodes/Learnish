import { db } from "@/config/db";
import { coursesTable, usersTable, enrolCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { sql, eq, and, not, exists } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!user || !userEmail) {
    return NextResponse.json({ error: "User not logged in", status: 401 });
  }

  // Check if user is registered in your users table
  const userExists = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (!userExists.length) {
    return NextResponse.json({ error: "User not registered", status: 403 });
  }

  // Fetch courses with content, not created by user, and not enrolled
  const courses = await db
    .select()
    .from(coursesTable)
    .where(
      and(
        sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`,
        not(eq(coursesTable.userEmail, userEmail)),
        not(
          exists(
            db
              .select()
              .from(enrolCourseTable)
              .where(
                and(
                  eq(enrolCourseTable.cid, coursesTable.cid),
                  eq(enrolCourseTable.userEmail, userEmail)
                )
              )
          )
        )
      )
    );

  return NextResponse.json(courses);
}
