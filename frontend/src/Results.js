import React, { useState } from "react";
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

const ResultsPage = ({
  responseData,
  input,
  topics = [],
  user,
  setResponseData,
}) => {
  const [panelVisible, setPanelVisible] = useState(true);
  const handleTopicClick = async (topic) => {
    try {
      const data = await getHistory(user, topic);
      setResponseData(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", position: "relative" }}>
      {panelVisible && (
        <div className="side-panel" style={{ position: "relative" }}>
          <button
            className="side-toggle-btn"
            onClick={() => setPanelVisible(false)}
            aria-label="Hide Panel"
          >
            ◀
          </button>
          <h3 style={{ color: "white", marginBottom: 12 }}>Topics</h3>
          {topics.length === 0 ? (
            <p style={{ color: "white" }}>No topics yet</p>
          ) : (
            topics.map((topic, idx) => (
              <button
                key={idx}
                className="topic-button"
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </button>
            ))
          )}
        </div>
      )}
      {!panelVisible && (
        <button
          className="side-toggle-btn show"
          onClick={() => setPanelVisible(true)}
          aria-label="Show Panel"
          style={{ position: "fixed" }}
        >
          ▶
        </button>
      )}
      <div
        className={panelVisible ? "main-content" : "main-content full-width"}
      >
        <div className="results">
          <h1>{input.toUpperCase()}</h1>
          {responseData && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
