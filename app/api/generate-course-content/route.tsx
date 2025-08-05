import { Course } from "@/app/workspace/edit-course/[courseId]/page";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const prompt = `
Depends on Chapter name and Topic Generate content for each topic in HTML 

and give response in JSON format. 

Schema:{
chapterName:<>,
{
topic:<>,
content:<>
}
}
: User Input:
`;

export async function POST(req: any) {
  const { courseJson, courseTitle, courseId } = await req.json();

  const promises = courseJson?.chapters?.map(async (chapter: any) => {
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
    const model = "gemini-2.5-flash";
    // Gemini 2.0 Flash-Lite
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt + JSON.stringify(chapter),
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });
    // console.log(response);

    const rawRes = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    const rawJson = rawRes?.replace("```json", "").replace("```", "").trim();
    let jsonRes: any = {};

    if (rawJson) {
      try {
        jsonRes = JSON.parse(rawJson) ?? {};
      } catch (err) {
        console.log("Failed to parse JSON from AI response:", err);
      }
    }

    // youtube vid link

    const youtubeData = await generateYoutubeVideo(chapter?.chapterName);
    return {
      youtubeVideo: youtubeData,
      courseData: jsonRes,
    };
  });

  const courseContent = await Promise.all(promises);
  const dbResp = await db
    .update(coursesTable)
    .set({
      courseContent: courseContent,
    })
    .where(eq(coursesTable.cid, courseId));

  return NextResponse.json({
    courseName: courseTitle,
    courseCOntent: courseContent,
  });
}

const YOUTUBE_BASE_URL = `https://www.googleapis.com/youtube/v3/search`;
const generateYoutubeVideo = async (topic: any) => {
  const params = {
    part: "snippet",
    q: topic,
    maxResults: 4,
    type: "video",
    key: process.env.YOUTUBE_API_KEY,
  };
  const response = await axios.get(YOUTUBE_BASE_URL, { params });
  const youtubeVideoListRes = response.data.items;
  const youtubeVideoList: any = [];
  youtubeVideoListRes.forEach((item: any) => {
    const data = {
      videoId: item.id?.videoId,
      title: item?.snippet?.title,
    };
    youtubeVideoList.push(data);
  });
  console.log(youtubeVideoList, "yt list");

  return youtubeVideoList;
};
