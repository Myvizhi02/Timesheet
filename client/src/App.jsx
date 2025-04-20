import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <>
              <Header />
              <Dashboard />
            </>
          }
        />

        {/* Project Route */}
        <Route
          path="/project"
          element={
            <>
              <ProjectHeader />
              <Project />
            </>
          }
        />

        {/* Task Route */}
        <Route
          path="/task"
          element={
            <>
              <TaskHeader />
              <Task />
            </>
          }
        />

        {/* Spent Time Route */}
        { <Route
          path="/spenttime"
          element={
            <>
              <SpenttimeHeader/>
              <AddSpenttime />
            </>
          }
        /> }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
