interface Chapter {
  chapterName: string;
  topics: Topic[];
}

interface Topic {
  topic: string;
  content: string;
}

interface CourseJson {
  chapters: Chapter[];
}

interface CourseRequest {
  courseJson: CourseJson;
  courseTitle: string;
  courseId: string;
}

interface YouTubeVideoItem {
  videoId: string;
  title: string;
}

interface YouTubeSearchItem {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
  };
}

interface YouTubeApiResponse {
  items: YouTubeSearchItem[];
}

interface GeneratedContent {
  chapterName: string;
  topics: Topic[];
}

interface CourseContentResponse {
  youtubeVideo: YouTubeVideoItem[];
  courseData: GeneratedContent;
}

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

export async function POST(req: Request) {
  try {
    const { courseJson, courseTitle, courseId }: CourseRequest =
      await req.json();

    const promises = courseJson?.chapters?.map(
      async (chapter: Chapter): Promise<CourseContentResponse> => {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY!,
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
        const contents = [
          {
            role: "user" as const,
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

        const rawRes = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        const rawJson = rawRes
          ?.replace("```json", "")
          .replace("```", "")
          .trim();
        let jsonRes: GeneratedContent = {
          chapterName: chapter.chapterName,
          topics: [],
        };

        if (rawJson) {
          try {
            jsonRes = JSON.parse(rawJson) as GeneratedContent;
          } catch (err) {
            console.log("Failed to parse JSON from AI response:", err);
          }
        }

        // YouTube video link
        const youtubeData = await generateYoutubeVideo(chapter?.chapterName);

        return {
          youtubeVideo: youtubeData,
          courseData: jsonRes,
        };
      }
    );

    const courseContent = await Promise.all(promises || []);

    await db
      .update(coursesTable)
      .set({
        courseContent: courseContent,
      })
      .where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      courseName: courseTitle,
      courseContent: courseContent, // Fixed typo: was courseCOntent
    });
  } catch (error) {
    console.error("Error generating course content:", error);
    return NextResponse.json(
      { error: "Failed to generate course content" },
      { status: 500 }
    );
  }
}

const YOUTUBE_BASE_URL = `https://www.googleapis.com/youtube/v3/search`;

const generateYoutubeVideo = async (
  topic: string
): Promise<YouTubeVideoItem[]> => {
  try {
    const params = {
      part: "snippet",
      q: topic,
      maxResults: 4,
      type: "video",
      key: process.env.YOUTUBE_API_KEY!,
    };

    const response = await axios.get<YouTubeApiResponse>(YOUTUBE_BASE_URL, {
      params,
    });
    const youtubeVideoListRes = response.data.items;
    const youtubeVideoList: YouTubeVideoItem[] = [];

    youtubeVideoListRes.forEach((item: YouTubeSearchItem) => {
      if (item.id?.videoId && item.snippet?.title) {
        const data: YouTubeVideoItem = {
          videoId: item.id.videoId,
          title: item.snippet.title,
        };
        youtubeVideoList.push(data);
      }
    });

    console.log(youtubeVideoList, "yt list");
    return youtubeVideoList;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};
