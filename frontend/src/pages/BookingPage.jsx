import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import './BookingPage.css';

export default function BookingPage() {
  const { services, appointments, salonTimeSlots, bookAppointment, currentUser } = useDemo();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get serviceId from URL if pre-selected from catalog
  const preSelectedServiceId = searchParams.get('serviceId') || (services[0]?.id || '');

  // Calculate today's date in YYYY-MM-DD for min date attribute
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Default to tomorrow for pleasant default
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // State
  const [selectedServiceId, setSelectedServiceId] = useState(preSelectedServiceId);
  const [appointmentDate, setAppointmentDate] = useState(tomorrowStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update selected service if URL search params change
  useEffect(() => {
    if (searchParams.get('serviceId')) {
      setSelectedServiceId(searchParams.get('serviceId'));
    }
  }, [searchParams]);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  // Calculate booked slots for the selected date to prevent overlapping appointments
  const bookedSlotsOnDate = appointments
    .filter(apt => apt.appointmentDate === appointmentDate && apt.status !== 'cancelled' && apt.status !== 'rejected')
    .map(apt => apt.startTime);

  const handleTimeSlotClick = (slot) => {
    if (bookedSlotsOnDate.includes(slot)) {
      return; // already occupied
    }
    setSelectedTimeSlot(slot);
    setError('');
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedService) {
      setError('Please select a salon service.');
      return;
    }
    if (!appointmentDate) {
      setError('Please choose a valid appointment date.');
      return;
    }
    if (appointmentDate < todayStr) {
      setError('Cannot book appointments for past dates.');
      return;
    }
    if (!selectedTimeSlot) {
      setError('Please choose an available time slot.');
      return;
    }
    if (bookedSlotsOnDate.includes(selectedTimeSlot)) {
      setError('This time slot was just taken. Please choose another slot.');
      return;
    }

    // Book appointment in demo state
    bookAppointment({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      appointmentDate,
      startTime: selectedTimeSlot,
      notes
    });

    setBookingSuccess(true);
  };

  return (
    <div className="booking-page section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">CONVENIENT ONLINE RESERVATION</span>
          <h2>Book Your Salon Treatment</h2>
          <p>Choose your desired luxury service, preferred date, and available time slot.</p>
        </div>

        {bookingSuccess ? (
          <div className="card booking-success-card">
            <div className="success-icon">🎉</div>
            <span className="success-badge">Booking Request Received</span>
            <h2>Thank You, {currentUser ? currentUser.name : 'Valued Guest'}!</h2>
            <p>Your salon appointment has been reserved in our schedule.</p>

            <div className="success-summary">
              <div className="summary-row">
                <span>Treatment:</span>
                <strong>{selectedService?.name}</strong>
              </div>
              <div className="summary-row">
                <span>Date &amp; Time:</span>
                <strong>{appointmentDate} at {selectedTimeSlot}</strong>
              </div>
              <div className="summary-row">
                <span>Total Fee:</span>
                <strong>${selectedService?.price}</strong>
              </div>
              <div className="summary-row">
                <span>Status:</span>
                <span className="status-badge status-pending">● Pending Confirmation</span>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/dashboard" className="btn btn-primary">
                View My Appointments
              </Link>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setBookingSuccess(false);
                  setSelectedTimeSlot('');
                  setNotes('');
                }}
              >
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          <div className="booking-layout">
            {/* Left Column: Form & Slot Selection */}
            <div className="card booking-form-card">
              {error && <div className="booking-error-banner">{error}</div>}

              {/* Step 1: Service */}
              <div className="booking-step">
                <div className="step-title-wrap">
                  <span className="step-number">1</span>
                  <h3>Select Salon Treatment</h3>
                </div>
                <div className="form-group">
                  <select
                    className="form-select"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                  >
                    {services.map(srv => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} — ${srv.price} ({srv.duration} mins)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Date */}
              <div className="booking-step">
                <div className="step-title-wrap">
                  <span className="step-number">2</span>
                  <h3>Select Date</h3>
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    min={todayStr}
                    value={appointmentDate}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      setSelectedTimeSlot(''); // reset slot when date changes
                    }}
                    className="form-input"
                  />
                  <span className="form-hint">Appointments cannot be scheduled for past dates.</span>
                </div>
              </div>

              {/* Step 3: Time Slot */}
              <div className="booking-step">
                <div className="step-title-wrap">
                  <span className="step-number">3</span>
                  <h3>Available Time Slots ({appointmentDate})</h3>
                </div>

                <div className="time-slots-grid">
                  {salonTimeSlots.map(slot => {
                    const isBooked = bookedSlotsOnDate.includes(slot);
                    const isSelected = selectedTimeSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        className={`slot-btn ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : 'available'}`}
                        onClick={() => handleTimeSlotClick(slot)}
                      >
                        <span className="slot-time">{slot}</span>
                        <span className="slot-status-label">
                          {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Notes */}
              <div className="booking-step">
                <div className="step-title-wrap">
                  <span className="step-number">4</span>
                  <h3>Special Preferences or Notes (Optional)</h3>
                </div>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Any allergies, hair concerns, or stylist preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Right Column: Sticky Summary Box */}
            <div className="booking-summary-column">
              <div className="card booking-summary-card">
                <h3 className="summary-title">Booking Summary</h3>

                {selectedService && (
                  <div className="summary-service-preview">
                    <img 
                      src={selectedService.image} 
                      alt={selectedService.name} 
                      className="summary-srv-img"
                    />
                    <div className="summary-srv-info">
                      <h4>{selectedService.name}</h4>
                      <span className="summary-srv-duration">⏱ {selectedService.duration} minutes</span>
                    </div>
                  </div>
                )}

                <div className="summary-details">
                  <div className="detail-row">
                    <span>Date:</span>
                    <strong>{appointmentDate || 'Not selected'}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Time Slot:</span>
                    <strong className={selectedTimeSlot ? 'text-rose' : ''}>
                      {selectedTimeSlot || 'Please pick a slot'}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Client Name:</span>
                    <strong>{currentUser ? currentUser.name : 'Guest User'}</strong>
                  </div>
                  <div className="detail-row total-row">
                    <span>Total Service Fee:</span>
                    <span className="total-price">${selectedService?.price || 0}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block confirm-btn"
                  disabled={!selectedTimeSlot}
                  onClick={handleConfirmBooking}
                >
                  {selectedTimeSlot ? 'Confirm Appointment Request 🌸' : 'Select a Time Slot First'}
                </button>

                <p className="summary-security-note">
                  🛡️ Free cancellation up to 2 hours before your appointment time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
