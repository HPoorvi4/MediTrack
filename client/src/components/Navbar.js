import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  User,
  LogOut,
  Home,
  Building2,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <Truck size={32} />
          <span>Emergency Ambulance</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/hospitals" className="nav-link">
                <Building2 size={20} />
                <span>Hospitals</span>
              </Link>
              <Link to="/emergency-links" className="nav-link">
                <LinkIcon size={20} />
                <span>My Links</span>
              </Link>
              <Link to="/bookings" className="nav-link">
                <Calendar size={20} />
                <span>Bookings</span>
              </Link>
              <Link to="/profile" className="nav-link">
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
