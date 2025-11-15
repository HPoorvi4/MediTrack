import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import EmergencyLinks from "./pages/EmergencyLinks";
import Hospitals from "./pages/Hospitals";
import Profile from "./pages/Profile";
import BookingDetails from "./pages/BookingDetails";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Bookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/emergency-links"
            element={
              <PrivateRoute>
                <EmergencyLinks />
              </PrivateRoute>
            }
          />
          <Route
            path="/hospitals"
            element={
              <PrivateRoute>
                <Hospitals />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
