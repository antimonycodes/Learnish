import { db } from "@/config/db";
import { coursesTable, enrolCourseTable, usersTable } from "@/config/schema";
import { updateStreakForUser } from "@/lib/streakHelper";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

async function unlockAchievement(userEmail: string, code: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/achievements`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          userEmail,
        }),
      }
    );

    if (response.ok) {
      console.log(`Achievement ${code} unlocked for user ${userEmail}`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`Achievement unlock result: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { courseId, action } = await req.json();
    const user = await currentUser();

    // Check if user is authenticated
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // If action is 'check', return enrollment status
    if (action === "check") {
      const response = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrolCourseTable, eq(coursesTable.cid, enrolCourseTable.cid))
        .where(
          and(
            eq(enrolCourseTable.userEmail, userEmail),
            eq(enrolCourseTable.cid, courseId)
          )
        )
        .orderBy(desc(enrolCourseTable.id));

      // Check if enrollment exists
      if (response.length === 0) {
        return NextResponse.json({
          enrolled: false,
          message: "User is not enrolled in this course",
        });
      }

      return NextResponse.json({
        enrolled: true,
        data: response[0],
      });
    }

    // Default action is to enroll
    // Check if user is already enrolled
    const enrolledCourses = await db
      .select()
      .from(enrolCourseTable)
      .where(
        and(
          eq(enrolCourseTable.userEmail, userEmail),
          eq(enrolCourseTable.cid, courseId)
        )
      );

    // If already enrolled, return conflict
    if (enrolledCourses.length > 0) {
      return NextResponse.json(
        {
          message: "Already enrolled",
          enrolled: true,
        },
        { status: 409 }
      );
    }

    // Check if this is the user's first course enrollment
    const allUserEnrollments = await db
      .select()
      .from(enrolCourseTable)
      .where(eq(enrolCourseTable.userEmail, userEmail));

    const isFirstCourse = allUserEnrollments.length === 0;

    // Enroll the user
    const response = await db
      .insert(enrolCourseTable)
      .values({
        cid: courseId,
        userEmail: userEmail,
      })
      .returning();

    // If this is the user's first course, unlock the achievement
    if (isFirstCourse) {
      await unlockAchievement(userEmail, "FIRST_COURSE_ENROLLED");
    }

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled",
      enrolled: true,
      data: response[0],
      isFirstCourse, // Optional: let frontend know if this was their first course
    });
  } catch (error) {
    console.error("Error in enrol-course API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { completedChapter, courseId } = await req.json();
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Check if user is authenticated
  if (!userEmail) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  if (!courseId) {
    return NextResponse.json(
      { error: "Course ID is required" },
      { status: 400 }
    );
  }

  const response = await db
    .update(enrolCourseTable)
    .set({
      completedChapters: completedChapter,
    })
    .where(
      and(
        eq(enrolCourseTable.cid, courseId),
        eq(enrolCourseTable.userEmail, userEmail)
      )
    )
    .returning();

  const streakData = await updateStreakForUser(userEmail);

  const userdata = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (userdata && userdata.length > 0) {
    const userData = userdata[0];
    console.log(userData);

    if (userData.currentStreak === 1) {
      await unlockAchievement(userEmail, "FIRST_CHAPTER");
    }

    if (userData.currentStreak === 7) {
      await unlockAchievement(userEmail, "CONSISTENT_LEARNER");
    }

    if (userData.currentStreak === 30) {
      await unlockAchievement(userEmail, "MONTH_WARRIOR");
    }

    if (userData.longestStreak === 14) {
      await unlockAchievement(userEmail, "CONSISTENT_LEARNER_X2");
    }
  }

  return NextResponse.json({
    ...response[0],
    streakData,
  });
}
