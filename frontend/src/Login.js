import React from "react";
import "./App.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// let user;

const backendLogin = async (user) => {
  console.log(user.email);
  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: user.email, name: user.name }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

const Login = ({ setIsLoggedIn, setUser, setTopics }) => {
  const LoggedIn = async (credentialResponse) => {
    console.log(credentialResponse);
    console.log(jwtDecode(credentialResponse.credential));
    const user = jwtDecode(credentialResponse.credential);
    let data = await backendLogin(user);
    setTopics(data.topics);
    setUser(user);
    setIsLoggedIn(true);
  };

  return (
    <div className="login-container">
      <div
        className="login-card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        }}
      >
        <h1>Learning Hub</h1>
        <p style={{ color: "white", marginBottom: "20px" }}>
          Sign in to continue learning
        </p>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <GoogleLogin
            onSuccess={LoggedIn}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
