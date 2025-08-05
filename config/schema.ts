import {
  integer,
  json,
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar(),
  currentStreak: integer("currentStreak").default(0),
  longestStreak: integer("longestStreak").default(0),
  lastCompletionDate: timestamp("lastCompletionDate"),
  streakStartDate: timestamp("streakStartDate"),
});

export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar().notNull(),
  bannerImageUrl: varchar().default(""),
  name: varchar().notNull(),
  description: varchar(),
  duration: varchar(),
  noOfChapters: integer().notNull(),
  difficulty: varchar().notNull(),
  category: varchar(),
  courseJson: json().notNull(),
  courseContent: json().default({}),
  userEmail: varchar("userEmail")
    .references(() => usersTable.email)
    .notNull(),
  createdBy: varchar("createdBy")
    .references(() => usersTable.name)
    .notNull(),
});

export const enrolCourseTable = pgTable("enrolcourse", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar("cid").references(() => coursesTable.cid),
  userEmail: varchar("userEmail").references(() => usersTable.email),
  completedChapters: json(),
});

export const achievementsTable = pgTable("achievements", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code").notNull().unique(), // e.g., "FIRST_COURSE_CREATED"
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  icon: varchar("icon").notNull(),
});

export const userAchievementsTable = pgTable("user_achievements", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("userEmail")
    .references(() => usersTable.email)
    .notNull(),
  achievementId: integer("achievementId")
    .references(() => achievementsTable.id)
    .notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow(),
});

// TYPE

// User Types
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

// Course Types
export type Course = typeof coursesTable.$inferSelect;
export type NewCourse = typeof coursesTable.$inferInsert;

// Enrollment Types
export type EnrollCourse = typeof enrolCourseTable.$inferSelect;
export type NewEnrollCourse = typeof enrolCourseTable.$inferInsert;

// Achievement Types
export type Achievement = typeof achievementsTable.$inferSelect;
export type NewAchievement = typeof achievementsTable.$inferInsert;

// User Achievement Types
export type UserAchievement = typeof userAchievementsTable.$inferSelect;
export type NewUserAchievement = typeof userAchievementsTable.$inferInsert;

// UTILITY TYPES

// Course with creator info
export type CourseWithCreator = Course & {
  creator?: Pick<User, "name" | "email">;
};

// Enrollment with course info
export type EnrollmentWithCourse = EnrollCourse & {
  course?: Course;
};

// User with their enrollments
export type UserWithEnrollments = User & {
  enrollments?: EnrollCourse[];
};

// Achievement with unlock info
export type UnlockedAchievement = Achievement & {
  unlockedAt?: Date;
};

// API Response Types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type CourseListResponse = ApiResponse<Course[]>;
export type UserResponse = ApiResponse<User>;
export type EnrollmentResponse = ApiResponse<EnrollCourse[]>;
export type AchievementResponse = ApiResponse<Achievement[]>;
