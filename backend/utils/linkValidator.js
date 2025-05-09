import axios from "axios";

export const checkYouTubeLink = async (link) => {
  try {
    const videoId = link.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/
    )?.[1];
    if (!videoId) return false;

    // Check via YouTube oEmbed API
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await axios.get(oEmbedUrl);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const checkCourseLink = async (link) => {
  try {
    const response = await fetch(link);
    return response.ok || !(response.status === 404);
  } catch (error) {
    return false;
  }
};
