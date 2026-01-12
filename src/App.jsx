import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import Posts from "./Components/Posts";
import Preview from "./Components/Preview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/preview/:id" element={<Preview />} />
      </Routes>
    </Router>
  );
}

export default App;