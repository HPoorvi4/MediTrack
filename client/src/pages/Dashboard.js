import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { bookingAPI, emergencyLinkAPI } from "../utils/api";
import {
  Truck,
  Building2,
  Link as LinkIcon,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    emergencyLinks: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsRes, linksRes] = await Promise.all([
        bookingAPI.getAll(),
        emergencyLinkAPI.getAll(),
      ]);

      const bookings = bookingsRes.data;
      const activeBookings = bookings.filter(
        (b) => !["completed", "cancelled"].includes(b.status)
      );

      setStats({
        totalBookings: bookings.length,
        activeBookings: activeBookings.length,
        emergencyLinks: linksRes.data.length,
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error("Load dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.profile?.full_name || user?.user?.email}</h1>
          <p>Manage your emergency ambulance services</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#dbeafe" }}>
              <Calendar size={32} color="#3b82f6" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>
              <Truck size={32} color="#f59e0b" />
            </div>
            <div className="stat-info">
              <h3>{stats.activeBookings}</h3>
              <p>Active Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>
              <LinkIcon size={32} color="#10b981" />
            </div>
            <div className="stat-info">
              <h3>{stats.emergencyLinks}</h3>
              <p>Emergency Links</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/hospitals" className="action-card">
              <Building2 size={40} color="#dc2626" />
              <h3>Find Hospital</h3>
              <p>Search and connect with hospitals</p>
            </Link>

            <Link to="/emergency-links" className="action-card">
              <LinkIcon size={40} color="#dc2626" />
              <h3>Emergency Links</h3>
              <p>Manage your hospital connections</p>
            </Link>

            <Link to="/bookings/new" className="action-card emergency">
              <Truck size={40} color="white" />
              <h3>Book Ambulance</h3>
              <p>Emergency ambulance booking</p>
            </Link>
          </div>
        </div>

        {recentBookings.length > 0 && (
          <div className="recent-bookings">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <Link to="/bookings" className="view-all">
                View All
              </Link>
            </div>

            <div className="bookings-list">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <h4>{booking.hospital_name}</h4>
                    <p>{booking.emergency_type} Emergency</p>
                    <small>
                      {new Date(booking.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div className={`booking-status status-${booking.status}`}>
                    {booking.status.replace(/_/g, " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.emergencyLinks === 0 && (
          <div className="alert-box">
            <AlertCircle size={24} />
            <div>
              <h3>No Emergency Links</h3>
              <p>
                Create emergency links with your preferred hospitals for faster
                ambulance booking.
              </p>
              <Link to="/hospitals" className="btn btn-primary">
                Add Emergency Link
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
