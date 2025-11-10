import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalAPI, emergencyLinkAPI } from '../utils/api';
import { Search, MapPin, Phone, Star, Bed, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import './Hospitals.css';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    city: '',
    name: '',
    department: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    searchHospitals();
  }, []);

  const searchHospitals = async () => {
    setLoading(true);
    try {
      const response = await hospitalAPI.search(searchParams);
      setHospitals(response.data);
    } catch (error) {
      console.error('Search hospitals error:', error);
      toast.error('Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchHospitals();
  };

  const handleCreateLink = async (hospitalId) => {
    navigate(`/hospitals/${hospitalId}`);
  };

  return (
    <div className="hospitals-container">
      <div className="container">
        <div className="page-header">
          <h1>Find Hospitals</h1>
          <p>Search and connect with hospitals for emergency services</p>
        </div>

        <form onSubmit={handleSearch} className="search-form card">
          <div className="search-inputs">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                placeholder="Enter city name"
                value={searchParams.city}
                onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Hospital Name</label>
              <input
                type="text"
                placeholder="Enter hospital name"
                value={searchParams.name}
                onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                placeholder="e.g., Cardiology"
                value={searchParams.department}
                onChange={(e) => setSearchParams({ ...searchParams, department: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            <Search size={20} />
            Search Hospitals
          </button>
        </form>

        {loading ? (
          <LoadingSpinner message="Searching hospitals..." />
        ) : (
          <div className="hospitals-grid">
            {hospitals.length === 0 ? (
              <div className="no-results">
                <p>No hospitals found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              hospitals.map((hospital) => (
                <div key={hospital.id} className="hospital-card card">
                  <div className="hospital-header">
                    <h3>{hospital.name}</h3>
                    {hospital.is_verified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>

                  <div className="hospital-info">
                    <div className="info-item">
                      <MapPin size={18} />
                      <span>{hospital.city}, {hospital.state}</span>
                    </div>

                    <div className="info-item">
                      <Phone size={18} />
                      <span>{hospital.contact_number}</span>
                    </div>

                    <div className="info-item">
                      <Bed size={18} />
                      <span>{hospital.available_beds} beds available</span>
                    </div>

                    {hospital.rating > 0 && (
                      <div className="info-item">
                        <Star size={18} fill="#f59e0b" color="#f59e0b" />
                        <span>{hospital.rating.toFixed(1)} ({hospital.total_reviews} reviews)</span>
                      </div>
                    )}
                  </div>

                  <div className="hospital-features">
                    {hospital.has_emergency && <span className="feature-tag">Emergency</span>}
                    {hospital.has_icu && <span className="feature-tag">ICU</span>}
                    {hospital.has_trauma_center && <span className="feature-tag">Trauma Center</span>}
                  </div>

                  <div className="hospital-stats">
                    <div className="stat">
                      <strong>{hospital.department_count || 0}</strong>
                      <span>Departments</span>
                    </div>
                    <div className="stat">
                      <strong>{hospital.doctor_count || 0}</strong>
                      <span>Doctors</span>
                    </div>
                    <div className="stat">
                      <strong>{hospital.available_ambulances || 0}</strong>
                      <span>Ambulances</span>
                    </div>
                  </div>

                  <div className="hospital-actions">
                    <button
                      onClick={() => navigate(`/hospitals/${hospital.id}`)}
                      className="btn btn-outline"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleCreateLink(hospital.id)}
                      className="btn btn-primary"
                    >
                      <LinkIcon size={18} />
                      Create Link
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
