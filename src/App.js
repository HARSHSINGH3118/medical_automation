// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDashboard from "./components/PatientDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* This is the root route */}
        <Route path="/login" element={<Login />} />{" "}
        {/* Ensure the Login route is correctly defined */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
