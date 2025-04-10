import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import CenterBlock from './components/CenterBlock';
import Header from "./components/Header";
import Tabs from './components/Tabs';

function App() {
  return (
    <>
     <BrowserRouter>
     <Header/>
     <CenterBlock/>
     <Tabs/>
     <Routes>
      <Route></Route>
     </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;
