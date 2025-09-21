import './App.css'
import React, { useState } from "react";
import Auth from "./components/Auth/Auth";
import Todo from "./components/Todo/Todo";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access"));

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return <Todo token={token} />;
}

export default App;