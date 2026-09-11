import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import Profile from "./pages/Profile";
import MedicalRecords from "./pages/MedicalRecords";
import Appointments from "./pages/Appointments";
import Medications from "./pages/Medications";
import HealthStatus from "./pages/HealthStatus";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
// import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/patient"
          element={<PatientDashboard />}
        />

        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/hospital/dashboard"
          element={<HospitalDashboard />}
        />
          
        {/* <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        /> */}

        <Route path="/profile" element={<Profile />} />

        <Route path="/medical-records" element={<MedicalRecords />} />

        <Route path="/appointments" element={<Appointments />} />

        <Route path="/medications" element={<Medications />} />

        <Route path="/health" element={<HealthStatus />} />

        <Route path="/notifications" element={<Notifications />} />

        <Route path="/settings" element={<Settings />} />

        {/* <Route path="*" element={<NotFound />} />  */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;