import React, { useState } from "react";
import "./App.css";
import InputPage from "./input.js";
import ResultsPage from "./Results.js";
import Login from "./Login.js";
// import { History } from "../../models/history.models";

function App() {
  const [input, setInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const submit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/learn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input, user: user }),
      });
      const data = await res.json();
      console.log("Backend response: ", data);
      setResponseData(data);
      setShowResults(true);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching backend response: ", err);
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
          setTopics={setTopics}
        />
      ) : !showResults ? (
        <InputPage
          input={input}
          setInput={setInput}
          submit={submit}
          loading={loading}
          topics={topics}
          user={user}
          setResponseData={setResponseData}
          setShowResults={setShowResults}
        />
      ) : (
        <ResultsPage
          responseData={responseData}
          input={input}
          topics={topics}
          user={user}
          setResponseData={setResponseData}
        />
      )}
    </div>
  );
}

export default App;
