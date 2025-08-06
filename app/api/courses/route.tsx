import { db } from "@/config/db";
import { coursesTable, enrolCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, and, or, exists } from "drizzle-orm";
import { NextResponse } from "next/server";

function serializeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (data instanceof Date) return data.toISOString();
  if (typeof data === "bigint") return data.toString();

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item));
  }

  if (typeof data === "object") {
    const serialized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeData(value);
    }
    return serialized;
  }

  return data;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const includeEnrollment = searchParams.get("includeEnrollment") === "true"; // Simple flag

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    // Return error response for unauthenticated users
    if (!user || !email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    if (courseId) {
      console.log(`Fetching course with ID: ${courseId} for user: ${email}`);

      if (includeEnrollment) {
        // When taking a course - include enrollment data
        const response = await db
          .select()
          .from(coursesTable)
          .leftJoin(
            enrolCourseTable,
            eq(coursesTable.cid, enrolCourseTable.cid)
          )
          .where(
            and(
              eq(coursesTable.cid, courseId),
              eq(enrolCourseTable.userEmail, email)
            )
          );

        if (!response || response.length === 0) {
          return NextResponse.json(
            { error: "Course not found or not enrolled" },
            { status: 404 }
          );
        }

        const serializedResponse = serializeData(response[0]);
        console.log("Course with enrollment data fetched successfully");
        return NextResponse.json(serializedResponse);
      } else {
        // Original logic for editing - course access (created or enrolled)
        const courseResponse = await db
          .select()
          .from(coursesTable)
          .where(eq(coursesTable.cid, courseId));

        if (!courseResponse || courseResponse.length === 0) {
          return NextResponse.json(
            { error: "Course not found" },
            { status: 404 }
          );
        }

        const course = courseResponse[0];
        const hasAccess = course.userEmail === email;

        let isEnrolled = false;
        if (!hasAccess) {
          // Check if user is enrolled
          const enrollmentResponse = await db
            .select()
            .from(enrolCourseTable)
            .where(
              and(
                eq(enrolCourseTable.cid, courseId),
                eq(enrolCourseTable.userEmail, email)
              )
            );

          isEnrolled = enrollmentResponse.length > 0;
        }

        if (!hasAccess && !isEnrolled) {
          return NextResponse.json(
            { error: "Course not found or not accessible" },
            { status: 404 }
          );
        }

        // Return course data in the same format as before
        const serializedResponse = serializeData({ courses: course });
        console.log("Course data fetched successfully");
        return NextResponse.json(serializedResponse);
      }
    } else {
      // Fetch all courses for the user (unchanged)
      console.log(`Fetching all courses for user: ${email}`);

      const response = await db
        .select()
        .from(coursesTable)
        .where(
          or(
            eq(coursesTable.userEmail, email), // Courses created by user
            exists(
              db
                .select()
                .from(enrolCourseTable)
                .where(
                  and(
                    eq(enrolCourseTable.cid, coursesTable.cid),
                    eq(enrolCourseTable.userEmail, email)
                  )
                )
            )
          )
        )
        .orderBy(desc(coursesTable.id));

      const serializedResponse = serializeData(response);
      console.log(`Found ${response.length} courses for user`);
      return NextResponse.json(serializedResponse);
    }
  } catch (error) {
    console.error("Error in courses API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
