import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser, auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import { error } from "console";

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

// Configure Cloudinary once at module level
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: any) {
  try {
    // Add environment variable validation
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary environment variables");
      return NextResponse.json(
        { error: "Cloudinary configuration missing" },
        { status: 500 }
      );
    }

    const { has } = await auth();
    const hasPremiumAccess = has({ plan: "premium" });

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const { courseId, ...formData } = await req.json();
    // console.log(req);

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

    const model = "gemini-2.5-pro";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt + JSON.stringify(formData),
          },
        ],
      },
    ];
    if (!userEmail) {
      return NextResponse.json({ error: "Sign in" }, { status: 401 });
    }

    if (!hasPremiumAccess) {
      const result = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.userEmail, userEmail));

      console.log(result);

      if (result?.length >= 1) {
        return NextResponse.json(
          { error: "Limit exceeded, subscribe to premium" },
          { status: 500 }
        );
      }
    }
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const rawRes = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    const rawJson = rawRes?.replace("```json", "").replace("```", "");
    let jsonRes: any = {};

    if (rawJson) {
      try {
        jsonRes = JSON.parse(rawJson) ?? {};
      } catch (err) {
        console.log("Failed to parse JSON from AI response:", err);
      }
    }

    const imagePrompt = jsonRes?.course?.bannerImagePrompt;

    // Generate banner image
    const bannerImageUrl = await generateImage(imagePrompt);

    // Save to database
    const result = await db.insert(coursesTable).values({
      ...formData,
      courseJson: jsonRes,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdBy: user?.fullName,
      cid: courseId,
      bannerImageUrl: bannerImageUrl,
    });

    return NextResponse.json({
      courseId: courseId,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const generateImage = async (imagePrompt: any) => {
  try {
    const formData = new FormData();
    formData.append("prompt", imagePrompt);

    const result = await axios.post(
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
    const imageBuffer = Buffer.from(result.data);

    // Upload to Cloudinary with explicit configuration check
    const uploadResult: any = await new Promise((resolve, reject) => {
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
        (error: any, result: any) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result.secure_url);
            resolve(result);
          }
        }
      );
      stream.end(imageBuffer);
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error in generateImage:", error);
    throw error;
  }
};
