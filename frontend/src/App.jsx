import { use } from "react";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import Home from "./pages/Home/Home.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
