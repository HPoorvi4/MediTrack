import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../utils/api';
import { Calendar, MapPin, Clock, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { BOOKING_STATUSES } from '../utils/constants';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await bookingAPI.getAll(params);
      setBookings(response.data);
    } catch (error) {
      console.error('Load bookings error:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return BOOKING_STATUSES[status]?.color || '#6b7280';
  };

  const getStatusLabel = (status) => {
    return BOOKING_STATUSES[status]?.label || status;
  };

  if (loading) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  return (
    <div className="bookings-container">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
        </div>

        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Bookings
          </button>
          <button
            className={filter === 'confirmed' ? 'active' : ''}
            onClick={() => setFilter('confirmed')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={filter === 'cancelled' ? 'active' : ''}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings card">
            <Calendar size={64} color="#9ca3af" />
            <h2>No Bookings Found</h2>
            <p>You haven't made any ambulance bookings yet</p>
            <button onClick={() => navigate('/emergency-links')} className="btn btn-primary">
              Book Ambulance
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card card">
                <div className="booking-header">
                  <div className="booking-id">
                    <strong>Booking #{booking.id.substring(0, 8)}</strong>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>

                <div className="booking-info-grid">
                  <div className="info-section">
                    <h4>Hospital</h4>
                    <p>{booking.hospital_name}</p>
                    <small>{booking.hospital_address}</small>
                  </div>

                  <div className="info-section">
                    <h4>Emergency Type</h4>
                    <p>{booking.emergency_type}</p>
                  </div>

                  <div className="info-section">
                    <h4>Ambulance</h4>
                    <p>{booking.vehicle_number || 'Not assigned'}</p>
                    <small>{booking.vehicle_type}</small>
                  </div>

                  <div className="info-section">
                    <h4>Pickup Location</h4>
                    <p className="pickup-address">
                      <MapPin size={14} />
                      {booking.pickup_address}
                    </p>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="booking-time">
                    <Clock size={16} />
                    <span>Booked on {new Date(booking.created_at).toLocaleString()}</span>
                  </div>

                  {booking.driver_name && (
                    <div className="driver-info">
                      <strong>Driver:</strong> {booking.driver_name} ({booking.driver_contact})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
