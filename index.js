import express from 'express'
import cors from 'cors'
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
import axios from "axios"
// import { History } from './models/history.models'

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.API_Key });

const app = express()
const PORT = 5000
app.use(cors())
app.use(express.json())
app.post("/learn", async (req, res) => {
    const {topic} = req.body
    console.log("User wants to learn ", topic)
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
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    let text = response.text
    const cleaned = text.replace(/```json|```/g, "").trim();
    console.log(cleaned)
    let obj = JSON.parse(cleaned)
    async function checkYouTubeLink(link) {
        try {
          const videoId = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1];
          if (!videoId) return false;
      
          // Check via YouTube oEmbed API
          const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
          const response = await axios.get(oEmbedUrl);
          return response.status === 200;
        } catch (error) {
          return false;
        }
      }
      
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
        // console.log(obj);
        for(const item2 of obj["course-links"]) {
            let incoming = await fetch(item2.link)
            if(incoming.ok || !(incoming.status === 404)) validCourses.push(item2)
        }
        obj["course-links"] = validCourses
      }
    await filterValidLinks();
    console.log(obj)
    // const hist = new History({topic, obj})
    // await hist.save()
    res.json(obj)
})

app.listen(PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`)
})