import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import Dashboard from './components/Dashboard';
<<<<<<< HEAD
import Header from "./components/Header";
import Login from "./components/Login";
import Project from"./components/Project"
=======
import Header from './components/Header';
import Login from './components/Login';

>>>>>>> cfb6a14339ab4ef869f134a01f5c3ed87f6ab75f

function App() {
  return (
    <>
     <BrowserRouter> 
     <Routes>
     <Route path="/login" element={<Login />} />
     <Route path="/project" element={<Project/>} />
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
    </>
  );
}

export default App;
