import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../utils/api';
import { ArrowLeft, MapPin, Phone, Truck, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { BOOKING_STATUSES } from '../utils/constants';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingDetails();
    
    // Auto-refresh every 10 seconds for active bookings
    const interval = setInterval(() => {
      if (booking && !['completed', 'cancelled'].includes(booking.status)) {
        loadBookingDetails();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);

  const loadBookingDetails = async () => {
    try {
      const response = await bookingAPI.getDetails(id);
      setBooking(response.data);
    } catch (error) {
      console.error('Load booking details error:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.updateStatus(id, {
        status: 'cancelled',
        cancellation_reason: 'Cancelled by patient',
      });
      toast.success('Booking cancelled');
      loadBookingDetails();
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Booking not found</h2>
          <button onClick={() => navigate('/bookings')} className="btn btn-primary">
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const statusColor = BOOKING_STATUSES[booking.status]?.color || '#6b7280';
  const statusLabel = BOOKING_STATUSES[booking.status]?.label || booking.status;

  return (
    <div className="booking-details-container">
      <div className="container">
        <button onClick={() => navigate('/bookings')} className="back-button">
          <ArrowLeft size={20} />
          Back to Bookings
        </button>

        <div className="details-header">
          <div>
            <h1>Booking Details</h1>
            <p className="booking-id">ID: {booking.id}</p>
          </div>
          <div className="status-badge-large" style={{ backgroundColor: statusColor }}>
            {statusLabel}
          </div>
        </div>

        <div className="details-grid">
          <div className="details-card card">
            <h2>Hospital Information</h2>
            <div className="info-list">
              <div className="info-row">
                <strong>Hospital:</strong>
                <span>{booking.hospital_name}</span>
              </div>
              <div className="info-row">
                <strong>Address:</strong>
                <span>{booking.hospital_address}</span>
              </div>
              <div className="info-row">
                <strong>Contact:</strong>
                <span>{booking.hospital_contact}</span>
              </div>
            </div>
          </div>

          <div className="details-card card">
            <h2>Ambulance Details</h2>
            {booking.vehicle_number ? (
              <div className="info-list">
                <div className="info-row">
                  <strong>Vehicle Number:</strong>
                  <span>{booking.vehicle_number}</span>
                </div>
                <div className="info-row">
                  <strong>Vehicle Type:</strong>
                  <span>{booking.vehicle_type}</span>
                </div>
                <div className="info-row">
                  <strong>Driver Name:</strong>
                  <span>{booking.driver_name}</span>
                </div>
                <div className="info-row">
                  <strong>Driver Contact:</strong>
                  <span>
                    <a href={`tel:${booking.driver_contact}`}>{booking.driver_contact}</a>
                  </span>
                </div>
              </div>
            ) : (
              <p className="no-data">Ambulance not yet assigned</p>
            )}
          </div>

          <div className="details-card card">
            <h2>Emergency Information</h2>
            <div className="info-list">
              <div className="info-row">
                <strong>Emergency Type:</strong>
                <span className="emergency-type">{booking.emergency_type}</span>
              </div>
              <div className="info-row">
                <strong>Pickup Location:</strong>
                <span>{booking.pickup_address}</span>
              </div>
              {booking.patient_condition && (
                <div className="info-row">
                  <strong>Condition:</strong>
                  <span>{booking.patient_condition}</span>
                </div>
              )}
            </div>
          </div>

          <div className="details-card card">
            <h2>Timeline</h2>
            <div className="info-list">
              <div className="info-row">
                <strong>Booked At:</strong>
                <span>{new Date(booking.created_at).toLocaleString()}</span>
              </div>
              {booking.estimated_arrival_time && (
                <div className="info-row">
                  <strong>Estimated Arrival:</strong>
                  <span>{new Date(booking.estimated_arrival_time).toLocaleString()}</span>
                </div>
              )}
              {booking.actual_arrival_time && (
                <div className="info-row">
                  <strong>Actual Arrival:</strong>
                  <span>{new Date(booking.actual_arrival_time).toLocaleString()}</span>
                </div>
              )}
              {booking.completion_time && (
                <div className="info-row">
                  <strong>Completed At:</strong>
                  <span>{new Date(booking.completion_time).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {booking.tracking_history && booking.tracking_history.length > 0 && (
          <div className="tracking-section card">
            <h2>Tracking History</h2>
            <div className="tracking-timeline">
              {booking.tracking_history.map((track, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot">
                    <CheckCircle size={20} />
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-status">{track.status_update || 'Location update'}</p>
                    <small>{new Date(track.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!['completed', 'cancelled'].includes(booking.status) && (
          <div className="actions-section">
            <button onClick={handleCancelBooking} className="btn btn-secondary">
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
