import { GoogleGenAI } from "@google/genai";
import { checkYouTubeLink, checkCourseLink } from "../utils/linkValidator.js";
import History from "../models/history.models.js";
import User from "../models/user.models.js";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_Key });

export const generateLearningContent = async (req, res) => {
  const { topic, user } = req.body; // user is the Google user object
  console.log("User wants to learn ", topic);
  const prompt = `I want to master ${topic}. First divide this topic in 3 to 5 parts based on level like basics, intermediate advanced or either based on sub topics. Prepare detailed notes explaining each of these topics and all the key points regarding these. After this give me a list of links of you-tube videos/playlists which are considered the best resources for this. In another list give me links of free online courses on sites like coursera which are considered the best resources for this. GIve me the response as a json object following the format:
{
  // Main sections of the JavaScript learning path
  "parts": [
    "Section Title 1",
    "Section Title 2",
    "Section Title 3",
    "Section Title 4"
  ],
  
  // Detailed notes for each section
  "notes": [
    {
      "title": "Section Title 1",
      "content": "Detailed markdown content for section 1..."
    },
    {
      "title": "Section Title 2",
      "content": "Detailed markdown content for section 2..."
    },
    {
      "title": "Section Title 3",
      "content": "Detailed markdown content for section 3..."
    },
    {
      "title": "Section Title 4",
      "content": "Detailed markdown content for section 4..."
    }
  ],
  
  // YouTube video resources
  "yt-links": [
    {
      "title": "YouTube Video Title 1",
      "link": "https://www.youtube.com/..."
    },
    {
      "title": "YouTube Video Title 2",
      "link": "https://www.youtube.com/..."
    },
    // Additional YouTube resources...
  ],
  
  // Course resources
  "course-links": [
    {
      "title": "Course Title 1 - Provider",
      "link": "https://www.provider.com/..."
    },
    {
      "title": "Course Title 2 - Provider",
      "link": "https://www.provider.com/..."
    },
    // Additional courses...
  ]
}
    where the array of parts is the parts in which the topic was divided, the array of notes is where the notes for each of the parts are listed as elements of the array, one element has the complete notes of one topic. The other two are arrays of links for the yt videos and courses respectively. The response contains only the json object enclosed in {} and no extra text. Make sure the courses and yt links you give are valid links and the courses have not been taken down/links are not expired.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    let text = response.text;
    const cleaned = text.replace(/```json|```/g, "").trim();
    console.log(cleaned);
    let obj = JSON.parse(cleaned);

    async function filterValidLinks() {
      const validLinks = [];
      for (const item of obj["yt-links"]) {
        const isValid = await checkYouTubeLink(item.link);
        if (isValid) {
          console.log(`✅ Valid: ${item.link}`);
          validLinks.push(item);
        } else {
          console.log(`❌ Invalid: ${item.link}`);
        }
      }
      const validCourses = [];
      obj["yt-links"] = validLinks;

      for (const item2 of obj["course-links"]) {
        const isValid = await checkCourseLink(item2.link);
        if (isValid) {
          console.log(`✅ Valid: ${item2.link}`);
          validCourses.push(item2);
        } else {
          console.log(`❌ Invalid: ${item2.link}`);
        }
      }
      obj["course-links"] = validCourses;
    }

    await filterValidLinks();
    console.log(obj);
    // Find or create the user in the DB using email
    let dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      dbUser = new User({ email: user.email, name: user.name });
      await dbUser.save();
    }
    // Save history with the user's MongoDB _id
    const history = new History({
      topic,
      data: obj,
      user: dbUser._id,
      searchedAt: new Date(),
    });
    try {await history.save();
      console.log("History saved");
    }
    catch (error) {
      console.log(error);
    }
    res.json(obj);
  } catch (error) {
    console.error("Error generating learning content:", error);
    res.status(500).json({ error: "Failed to generate learning content" });
  }
};
