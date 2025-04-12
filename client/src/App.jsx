import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Dashboard from './components/Dashboard';
import Header from "./components/Header";
import Login from "./components/Login";
import Project from "./components/Project";
import ProjectHeader from "./components/ProjectHeader";
import Task from "./components/Task";
import TaskHeader from "./components/TaskHeader";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/task"
          element={
            <>
              <TaskHeader />
              <Task />
            </>
          }
        />

        <Route
          path="/project"
          element={
            <>
              <ProjectHeader />
              <Project />
            </>
          }
        />

        <Route
          path="/dashboard"
          element={
            <>
              <Header />
              <Dashboard />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
