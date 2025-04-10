import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import CenterBlock from './components/CenterBlock';
import Header from "./components/Header";
import Tabs from './components/Tabs';
import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
     <BrowserRouter>
     {/* <Header/>
     <CenterBlock/>
     <Tabs/> */}
     <Routes>
     <Route path="/login" element={<Login />} />
     {/* <Route path="/dashboard" element={<Dashboard />} /> */}
     </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;
