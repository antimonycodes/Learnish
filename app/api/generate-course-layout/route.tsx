interface CourseFormData {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  noOfChapters: number;
  videoInclude?: boolean;
}

interface CourseLayoutRequest extends CourseFormData {
  courseId: string;
}

interface CourseChapter {
  chapterName: string;
  duration: string;
  topics: string[];
}

interface GeneratedCourse {
  name: string;
  description: string;
  category: string;
  level: string;
  noOfChapters: number;
  bannerImagePrompt: string;
  chapters: CourseChapter[];
}

interface CourseResponse {
  course: GeneratedCourse;
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser, auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";

const prompt = `
Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
      }
    ]
  }
}

, User Input: 
`;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.GEMINI_API_KEY ||
      !process.env.CLIPDROP_API_KEY
    ) {
      console.error("Missing required environment variables");
      return NextResponse.json(
        { error: "Server configuration missing" },
        { status: 500 }
      );
    }

    const { has } = await auth();
    const hasPremiumAccess = has({ plan: "premium" });

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const requestBody: CourseLayoutRequest = await req.json();
    const { courseId, ...formData } = requestBody;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const tools = [
      {
        googleSearch: {},
      },
    ];

    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };

    if (!hasPremiumAccess) {
      const existingCourses = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.userEmail, userEmail));

      console.log("Existing courses:", existingCourses);

      if (existingCourses.length >= 1) {
        return NextResponse.json(
          { error: "Limit exceeded, subscribe to premium" },
          { status: 403 }
        );
      }
    }

    const model = "gemini-2.5-pro";
    const contents = [
      {
        role: "user" as const,
        parts: [
          {
            text: prompt + JSON.stringify(formData),
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const rawRes = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    const rawJson = rawRes?.replace("```json", "").replace("```", "").trim();

    let courseResponse: CourseResponse = {
      course: {
        name: formData.name || "Untitled Course",
        description: formData.description || "No description available",
        category: formData.category || "General",
        level: formData.difficulty || "Beginner",
        noOfChapters: formData.noOfChapters || 1,
        bannerImagePrompt: "A generic educational course illustration",
        chapters: [],
      },
    };

    if (rawJson) {
      try {
        const parsedResponse = JSON.parse(rawJson) as CourseResponse;
        courseResponse = parsedResponse;
      } catch (parseError) {
        console.log("Failed to parse JSON from AI response:", parseError);
      }
    }

    const imagePrompt = courseResponse.course.bannerImagePrompt;

    const bannerImageUrl = await generateImage(imagePrompt);

    await db.insert(coursesTable).values({
      name: courseResponse.course.name,
      description: courseResponse.course.description,
      category: formData.category,
      difficulty: formData.difficulty,
      duration: formData.duration,
      noOfChapters: formData.noOfChapters,
      courseJson: courseResponse,
      userEmail: userEmail,
      createdBy: user.fullName || "Unknown User",
      cid: courseId,
      bannerImageUrl: bannerImageUrl || "",
    });

    return NextResponse.json({
      courseId: courseId,
      course: courseResponse.course,
      bannerImageUrl: bannerImageUrl,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const generateImage = async (imagePrompt: string): Promise<string | null> => {
  try {
    if (!process.env.CLIPDROP_API_KEY) {
      console.error("ClipDrop API key missing");
      return null;
    }

    const formData = new FormData();
    formData.append("prompt", imagePrompt);

    const clipDropResponse = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    console.log("Image generated successfully");
    const imageBuffer = Buffer.from(clipDropResponse.data as ArrayBuffer);

    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        // Double-check configuration before upload
        if (!cloudinary.config().cloud_name) {
          console.error("Cloudinary not properly configured");
          reject(new Error("Cloudinary configuration missing"));
          return;
        }

        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "ai-generated",
            timeout: 120000,
          },
          (
            error: Error | undefined,
            result: CloudinaryUploadResult | undefined
          ) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else if (result) {
              console.log("Cloudinary upload successful:", result.secure_url);
              resolve(result);
            } else {
              reject(new Error("Upload result is undefined"));
            }
          }
        );
        stream.end(imageBuffer);
      }
    );

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error in generateImage:", error);
    return null;
  }
};

export type CourseInsertData = {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  noOfChapters: number;
  courseJson: CourseResponse;
  userEmail: string;
  createdBy: string;
  cid: string;
  bannerImageUrl: string;
};
