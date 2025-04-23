import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import SpenttimeHeader from "./components/SpenttimeHeader";
import AddSpenttime from "./components/AddSpenttime";
import Dashboard from './components/Dashboard';
import Header from "./components/Header";
import Login from "./components/Login";
import Project from "./components/Project";
import ProjectHeader from "./components/ProjectHeader";
import Task from "./components/Task";
import TaskHeader from "./components/TaskHeader";

// Session handling function to check if user is logged in
const ProtectedRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('agentId') && localStorage.getItem('name');
  
  return isLoggedIn ? element : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in on initial load
  useEffect(() => {
    const agentId = localStorage.getItem('agentId');
    const name = localStorage.getItem('name');
    if (agentId && name) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <>
                  <Header />
                  <Dashboard />
                </>
              }
            />
          }
        />

        <Route
          path="/project"
          element={
            <ProtectedRoute
              element={
                <>
                  <ProjectHeader />
                  <Project />
                </>
              }
            />
          }
        />

        <Route
          path="/task"
          element={
            <ProtectedRoute
              element={
                <>
                  <TaskHeader />
                  <Task />
                </>
              }
            />
          }
        />

        <Route
          path="/spenttime"
          element={
            <ProtectedRoute
              element={
                <>
                  <SpenttimeHeader />
                  <AddSpenttime />
                </>
              }
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
