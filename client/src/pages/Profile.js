import React, { useState, useEffect } from 'react';
import { patientAPI } from '../utils/api';
import { User, Phone, Mail, MapPin, Heart, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { HEALTH_CATEGORIES, BLOOD_GROUPS, GENDERS } from '../utils/constants';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await patientAPI.getProfile();
      setProfile(response.data);
      setFormData(response.data);
      
      const categories = response.data.health_categories || [];
      setSelectedCategories(categories.map(c => ({ category: c.category, additional_info: c.additional_info })));
    } catch (error) {
      console.error('Load profile error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (category) => {
    const exists = selectedCategories.find(c => c.category === category);
    if (exists) {
      setSelectedCategories(selectedCategories.filter(c => c.category !== category));
    } else {
      setSelectedCategories([...selectedCategories, { category, additional_info: '' }]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await patientAPI.updateProfile(formData);
      await patientAPI.updateHealthCategories(selectedCategories);
      
      toast.success('Profile updated successfully');
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <button
            onClick={() => editing ? handleSaveProfile() : setEditing(true)}
            className="btn btn-primary"
          >
            {editing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-grid">
          <div className="profile-card card">
            <h2>Personal Information</h2>
            
            {editing ? (
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender || ''} onChange={handleChange}>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Blood Group</label>
                  <select name="blood_group" value={formData.blood_group || ''} onChange={handleChange}>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            ) : (
              <div className="info-list">
                <div className="info-item">
                  <User size={20} />
                  <div>
                    <label>Full Name</label>
                    <span>{profile.full_name}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar size={20} />
                  <div>
                    <label>Date of Birth</label>
                    <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="info-item">
                  <User size={20} />
                  <div>
                    <label>Gender</label>
                    <span>{profile.gender}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Heart size={20} />
                  <div>
                    <label>Blood Group</label>
                    <span>{profile.blood_group}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Phone size={20} />
                  <div>
                    <label>Contact Number</label>
                    <span>{profile.contact_number}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Mail size={20} />
                  <div>
                    <label>Email</label>
                    <span>{profile.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-card card">
            <h2>Address</h2>
            
            {editing ? (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Street Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    name="pin_code"
                    value={formData.pin_code || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <label>Full Address</label>
                  <span>
                    {profile.address}, {profile.city}, {profile.state} - {profile.pin_code}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-card card">
            <h2>Health Categories</h2>
            <p className="card-description">Select general health conditions (no detailed medical info)</p>
            
            <div className="health-categories">
              {HEALTH_CATEGORIES.map((cat) => (
                <label key={cat.value} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.some(c => c.category === cat.value)}
                    onChange={() => handleCategoryToggle(cat.value)}
                    disabled={!editing}
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile-card card">
            <h2>Emergency Contacts</h2>
            
            {profile.emergency_contacts && profile.emergency_contacts.length > 0 ? (
              <div className="contacts-list">
                {profile.emergency_contacts.map((contact) => (
                  <div key={contact.id} className="contact-item">
                    <div className="contact-priority">#{contact.priority}</div>
                    <div className="contact-info">
                      <strong>{contact.contact_name}</strong>
                      <span>{contact.relation}</span>
                      <span>{contact.phone_number}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No emergency contacts added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
