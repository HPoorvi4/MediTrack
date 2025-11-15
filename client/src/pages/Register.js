import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Truck } from "lucide-react";
import { toast } from "react-toastify";
import { BLOOD_GROUPS, GENDERS } from "../utils/constants";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Centralized form state
  // -------------------------------
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    contact_number: "",
    address: "",
    city: "",
    state: "",
    pin_code: "",
  });

  // -------------------------------
  // Input Change Handler
  // -------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------
  // Inline validation (cleaner)
  // -------------------------------
  const validateForm = () => {
    const { password, confirmPassword, contact_number, pin_code } = formData;

    if (password !== confirmPassword) return "Passwords do not match";

    if (password.length < 6) return "Password must be at least 6 characters";

    if (!/^\d{10}$/.test(contact_number))
      return "Contact number must be 10 digits";

    if (!/^\d{6}$/.test(pin_code)) return "PIN Code must be 6 digits";

    return null; // no errors
  };

  // -------------------------------
  // Submit Handler
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...payload } = formData;

    try {
      await api.post("/auth/register", payload);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <Truck size={48} color="#dc2626" />
          <h1>Create Account</h1>
          <p>Register for emergency ambulance services</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full name + Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password + Confirm Password */}
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* DOB + Gender + Blood Group */}
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Blood Group *</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              required
              maxLength={10}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* City + State + PIN */}
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>PIN Code *</label>
              <input
                type="text"
                name="pin_code"
                value={formData.pin_code}
                onChange={handleChange}
                required
                maxLength={6}
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
