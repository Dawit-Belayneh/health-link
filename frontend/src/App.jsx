import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
// import DoctorDashboard from "./pages/DoctorDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import Profile from "./pages/Profile";
// import MedicalRecords from "./pages/MedicalRecords";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        {/* <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        /> */}

        {/* <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        /> */}

        {/* <Route path="/profile" element={<Profile />} /> */}

        {/* <Route
          path="/medical-records"
          element={<MedicalRecords />}
        /> */}

        {/* <Route path="*" element={<NotFound />} />  */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;