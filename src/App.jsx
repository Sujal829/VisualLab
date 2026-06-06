import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./components/Login";
import { sendDetails } from "./utils/visitorEmail";
import { Toaster } from "react-hot-toast";

// Lazy load pages for performance optimization
const Home = lazy(() => import("./Pages/Home"));
const ScenePage = lazy(() => import("./Pages/ScenePage"));
const Metrics = lazy(() => import("./Pages/Metrics"));
const Flow = lazy(() => import("./Pages/Flow"));
const Lamp = lazy(() => import("./Pages/ThreeJs/Lamp"));
const GradientMetric = lazy(() => import("./Pages/GradientMetric"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#02040a]">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      sendDetails(user);
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // sendDetails(userData); // useEffect will handle this
  };

  return (
    <div className="no-scrollbar">
      <Toaster position="top-center" reverseOrder={false} />
      <GoogleOAuthProvider clientId="548289576724-qo93e35blo5upl84p91r6n5q7ckpv6ka.apps.googleusercontent.com">
        {user ? (
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scene" element={<ScenePage />} />
                <Route path="/scene/lamp" element={<Lamp />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/metrics1" element={<GradientMetric />} />
                <Route path="/flow" element={<Flow />} />
              </Routes>
            </Suspense>
          </Router>
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;