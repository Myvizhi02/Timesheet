import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Dashboard from './components/Dashboard';
import Header from "./components/Header";
import Login from "./components/Login";
import Project from "./components/Project";
import ProjectHeader from "./components/ProjectHeader";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
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
