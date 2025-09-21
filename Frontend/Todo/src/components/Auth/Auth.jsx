import React, { useState } from "react";
import axios from "axios";
import './Auth.css'

const backend = "http://127.0.0.1:8000/api/";

const Auth = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true); // toggle between login/register

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN
        const response = await axios.post(`${backend}token/`, {
          username,
          password,
        });
        const { access, refresh } = response.data;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        setToken(access); // pass token to parent
      } else {
        // REGISTER
        await axios.post(`${backend}register/`, {
          username,
          password,
          email,
        });
        alert("Registration successful! Please log in.");
        setIsLogin(true); // switch to login after register
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <p>
        {isLogin ? "No account?" : "Already registered?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default Auth;
