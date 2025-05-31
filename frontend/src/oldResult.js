import React from "react";
import "./App.css";
import downloadTextFile from "./utils/downloadtextfile.js";

const getHistory = async (user, topic) => {
    const response = await fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, topic }),
    });
    const data = await response.json();
    return data;
  };

const oldResult = ({ responseData, topics, user }) => {

     let input = responseData.topic;

    const handleTopicClick = async (topic) => {
        const data = await getHistory(user, topic);
        // setResponseData(data);
        responseData = data;
      };
      return (
      <div style={{ display: "flex", width: "100%" }}>
        {/* Side panel */}
        <div
          style={{
            minWidth: 200,
            background: "#333",
            padding: 16,
            borderRadius: 12,
            marginRight: 24,
            height: "fit-content",
          }}
        >
          <h3 style={{ color: "white", marginBottom: 12 }}>Topics</h3>
          {topics.length === 0 ? (
            <p style={{ color: "white" }}>No topics yet</p>
          ) : (
            topics.map((topic, idx) => (
              <button
                key={idx}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: 8,
                  padding: "10px 12px",
                  background: "#444",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: 500,
                }}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </button>
            ))
          )}
        </div>
        {/* Main results area */}
        <div style={{ flex: 1 }}>
          <div className="results">
            <h1>{input.toUpperCase()}</h1>
            <h2 style={{ color: "white" }}>Notes</h2>
            <div className="card-container">
              {responseData.notes.map((note, index) => (
                <div key={index} className="note-card">
                  <p>{note.title}</p>
                  <button
                    onClick={() =>
                      downloadTextFile(`${note.title}.txt`, note.content)
                    }
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
            <h2 style={{ color: "white" }}>YouTube Links</h2>
            <div className="card-container">
              {responseData["yt-links"].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-card"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(item.link, "_blank");
                    console.log(item.link);
                  }}
                >
                  📺 {item.title}
                </a>
              ))}
            </div>
            <h2 style={{ color: "white" }}>Courses</h2>
            <div className="card-container">
              {responseData["course-links"].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-card"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(item.link, "_blank");
                  }}
                >
                  🎓 {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}

export default oldResult;