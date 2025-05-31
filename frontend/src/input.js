import React, { useState } from "react";
import "./App.css";

const getHistory = async (user, topic) => {
  const response = await fetch("http://localhost:5000/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, topic }),
  });
  const data = await response.json();
  return data;
};

const InputPage = ({
  input,
  setInput,
  submit,
  loading,
  topics = [],
  user,
  setResponseData,
  setShowResults,
}) => {
  const [panelVisible, setPanelVisible] = useState(true);
  const handleTopicClick = async (topic) => {
    try {
      const data = await getHistory(user, topic);
      setResponseData(data);
      setShowResults(true);
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
          <h3 style={{ color: "white", marginBottom: 12, textAlign: "center" }}>Learning Hub</h3>
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
        <div className="card">
          <h1>What would you like to learn today?</h1>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="submit-btn" onClick={submit}>
              →
            </button>
          </div>
          {loading && (
            <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputPage;
