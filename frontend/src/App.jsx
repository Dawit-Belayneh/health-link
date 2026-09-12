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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Patient Only Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/medical-records" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <MedicalRecords />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Appointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/medications" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Medications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/health" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <HealthStatus />
            </ProtectedRoute>
          } 
        />

        {/* Doctor Only Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['doctor', 'hospital_staff']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Hospital Admin Only Routes */}
        <Route
          path="/hospital/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />

        {/* Authenticated Routes (Role-Aware) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;