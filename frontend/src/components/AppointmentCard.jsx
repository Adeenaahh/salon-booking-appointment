import React from 'react';
import './AppointmentCard.css';

export default function AppointmentCard({ 
  appointment, 
  isAdminView = false, 
  onCancel, 
  onStatusChange 
}) {
  const {
    id,
    customerName,
    customerEmail,
    serviceName,
    servicePrice,
    appointmentDate,
    startTime,
    status,
    notes
  } = appointment;

  const isEligibleForCancel = status === 'pending' || status === 'confirmed';

  return (
    <div className="card appointment-card">
      <div className="appointment-card-top">
        <div className="appointment-date-badge">
          <span className="date-icon">📅</span>
          <span className="date-text">{appointmentDate}</span>
          <span className="time-text">• {startTime}</span>
        </div>
        <span className={`status-badge status-${status}`}>
          ● {status}
        </span>
      </div>

      <div className="appointment-card-content">
        <h4 className="appointment-service-title">{serviceName}</h4>
        
        {servicePrice && (
          <span className="appointment-price">Service Fee: <strong>${servicePrice}</strong></span>
        )}

        {isAdminView && (
          <div className="customer-info-box">
            <p><strong>Client:</strong> {customerName}</p>
            <p><strong>Email:</strong> {customerEmail}</p>
          </div>
        )}

        {notes && (
          <p className="appointment-notes">
            <em>"Note: {notes}"</em>
          </p>
        )}
      </div>

      <div className="appointment-card-actions">
        {/* Customer View Cancellation */}
        {!isAdminView && isEligibleForCancel && (
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => {
              if (window.confirm("Are you sure you want to cancel this salon appointment?")) {
                onCancel(id);
              }
            }}
          >
            Cancel Appointment
          </button>
        )}

        {/* Admin View Status Controls */}
        {isAdminView && (
          <div className="admin-status-buttons">
            {status !== 'confirmed' && (
              <button 
                className="btn btn-sm btn-success"
                onClick={() => onStatusChange(id, 'confirmed')}
              >
                ✓ Confirm
              </button>
            )}
            {status !== 'rejected' && (
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => onStatusChange(id, 'rejected')}
              >
                ✕ Reject
              </button>
            )}
            {status !== 'cancelled' && (
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => onStatusChange(id, 'cancelled')}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
