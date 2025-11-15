import React from "react";
import { Link } from "react-router-dom";
import { Truck, Shield, Clock, MapPin } from "lucide-react";
import "./Home.css";

const Home = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Emergency Ambulance Booking</h1>
            <p className="hero-subtitle">
              Privacy-focused platform connecting patients with hospitals for
              emergency care
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={40} color="#dc2626" />
              </div>
              <h3>Quick Response</h3>
              <p>
                Fast ambulance dispatch with real-time tracking for emergency
                situations
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={40} color="#dc2626" />
              </div>
              <h3>Privacy First</h3>
              <p>
                Minimal data storage - your medical records stay with your
                hospital
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MapPin size={40} color="#dc2626" />
              </div>
              <h3>Hospital Network</h3>
              <p>Connect with verified hospitals and create emergency links</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Truck size={40} color="#dc2626" />
              </div>
              <h3>24/7 Service</h3>
              <p>Round-the-clock emergency ambulance booking service</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>Create your account with basic information</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Link Hospitals</h3>
              <p>Connect with your preferred hospitals and doctors</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Book Ambulance</h3>
              <p>Quick emergency booking when you need it</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Track & Reach</h3>
              <p>Real-time tracking until you reach the hospital</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of users who trust us for emergency medical services
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary btn-large">
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
