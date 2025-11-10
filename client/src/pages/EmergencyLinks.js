import React, { useState, useEffect } from 'react';
import { emergencyLinkAPI, bookingAPI } from '../utils/api';
import { Link as LinkIcon, Building2, Trash2, Star, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { EMERGENCY_TYPES } from '../utils/constants';
import './EmergencyLinks.css';

const EmergencyLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const response = await emergencyLinkAPI.getAll();
      setLinks(response.data);
    } catch (error) {
      console.error('Load links error:', error);
      toast.error('Failed to load emergency links');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this emergency link?')) {
      return;
    }

    try {
      await emergencyLinkAPI.delete(id);
      toast.success('Emergency link removed');
      loadLinks();
    } catch (error) {
      console.error('Delete link error:', error);
      toast.error('Failed to remove link');
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await emergencyLinkAPI.update(id, { is_primary: true });
      toast.success('Primary link updated');
      loadLinks();
    } catch (error) {
      console.error('Update link error:', error);
      toast.error('Failed to update link');
    }
  };

  const handleBookAmbulance = (link) => {
    setBookingModal(link);
  };

  const handleConfirmBooking = async (emergencyType) => {
    try {
      const bookingData = {
        emergency_link_id: bookingModal.id,
        emergency_type: emergencyType,
        pickup_address: 'Current Location', // In real app, get from geolocation
        pickup_latitude: bookingModal.hospital_latitude,
        pickup_longitude: bookingModal.hospital_longitude,
      };

      const response = await bookingAPI.create(bookingData);
      toast.success('Ambulance booked successfully!');
      setBookingModal(null);
      navigate(`/bookings/${response.data.booking.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book ambulance');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading emergency links..." />;
  }

  return (
    <div className="emergency-links-container">
      <div className="container">
        <div className="page-header">
          <h1>Emergency Links</h1>
          <button onClick={() => navigate('/hospitals')} className="btn btn-primary">
            <LinkIcon size={20} />
            Add New Link
          </button>
        </div>

        {links.length === 0 ? (
          <div className="no-links card">
            <Building2 size={64} color="#9ca3af" />
            <h2>No Emergency Links</h2>
            <p>Create emergency links with hospitals for faster ambulance booking</p>
            <button onClick={() => navigate('/hospitals')} className="btn btn-primary">
              Find Hospitals
            </button>
          </div>
        ) : (
          <div className="links-grid">
            {links.map((link) => (
              <div key={link.id} className={`link-card card ${link.is_primary ? 'primary' : ''}`}>
                {link.is_primary && (
                  <div className="primary-badge">
                    <Star size={16} fill="white" />
                    Primary
                  </div>
                )}

                <div className="link-header">
                  <Building2 size={32} color="#dc2626" />
                  <h3>{link.hospital_name}</h3>
                </div>

                <div className="link-details">
                  <div className="detail-row">
                    <label>Location:</label>
                    <span>{link.hospital_city}</span>
                  </div>

                  <div className="detail-row">
                    <label>Contact:</label>
                    <span>{link.hospital_contact}</span>
                  </div>

                  {link.department_name && (
                    <div className="detail-row">
                      <label>Department:</label>
                      <span>{link.department_name}</span>
                    </div>
                  )}

                  {link.doctor_name && (
                    <div className="detail-row">
                      <label>Doctor:</label>
                      <span>{link.doctor_name}</span>
                    </div>
                  )}

                  {link.notes && (
                    <div className="detail-row">
                      <label>Notes:</label>
                      <span>{link.notes}</span>
                    </div>
                  )}
                </div>

                <div className="link-actions">
                  <button
                    onClick={() => handleBookAmbulance(link)}
                    className="btn btn-primary"
                  >
                    <Truck size={18} />
                    Book Ambulance
                  </button>

                  {!link.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(link.id)}
                      className="btn btn-outline"
                    >
                      <Star size={18} />
                      Set Primary
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(link.id)}
                    className="btn btn-secondary"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {bookingModal && (
          <div className="modal-overlay" onClick={() => setBookingModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Select Emergency Type</h2>
              <p>Booking ambulance from {bookingModal.hospital_name}</p>

              <div className="emergency-types">
                {EMERGENCY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleConfirmBooking(type.value)}
                    className="emergency-type-btn"
                  >
                    <span className="emergency-icon">{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>

              <button onClick={() => setBookingModal(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyLinks;
