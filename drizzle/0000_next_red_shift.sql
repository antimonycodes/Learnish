CREATE TABLE "courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cid" varchar NOT NULL,
	"bannerImageUrl" varchar DEFAULT '',
	"name" varchar NOT NULL,
	"description" varchar,
	"duration" varchar,
	"noOfChapters" integer NOT NULL,
	"difficulty" varchar NOT NULL,
	"category" varchar,
	"courseJson" json NOT NULL,
	"courseContent" json DEFAULT '{}'::json,
	"userEmail" varchar NOT NULL,
	"createdBy" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrolCourse" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "enrolCourse_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cid" varchar,
	"userEmail" varchar,
	"completedChapters" json
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscriptionId" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_createdBy_users_name_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrolCourse" ADD CONSTRAINT "enrolCourse_cid_courses_cid_fk" FOREIGN KEY ("cid") REFERENCES "public"."courses"("cid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrolCourse" ADD CONSTRAINT "enrolCourse_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;